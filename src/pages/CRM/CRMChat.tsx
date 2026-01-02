import React, { useState, useEffect, useRef } from 'react'
import { crmChatService } from '../../services/crmChatService'
import type { ChatConversation, ChatMessage } from '../../services/crmChatService'
import { authService } from '../../services/authService'

export default function CRMChat() {
    const [conversations, setConversations] = useState<ChatConversation[]>([])
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null)
    const [messageInput, setMessageInput] = useState('')
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const user = await authService.getCurrentUser()
            setCurrentUser(user)
        }
        fetchUser()
        loadInitialData()
    }, [])

    useEffect(() => {
        if (selectedChat) {
            loadMessages(selectedChat.id)
            crmChatService.markAsRead(selectedChat.id) // Mark read on open
        }
    }, [selectedChat])

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const loadInitialData = async () => {
        try {
            const empresaId = await authService.getEmpresaId()
            if (empresaId) {
                const data = await crmChatService.getConversations(empresaId)
                setConversations(data)

                // Select first chat if available
                if (data.length > 0 && !selectedChat) {
                    setSelectedChat(data[0])
                }
            }
        } catch (error) {
            console.error('Error loading conversations:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMessages = async (chatId: string) => {
        try {
            const msgs = await crmChatService.getMessages(chatId)
            setMessages(msgs)
        } catch (error) {
            console.error('Error loading messages:', error)
        }
    }

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedChat) return

        try {
            // Optimistic update
            const tempId = Math.random().toString()
            const newMessage: ChatMessage = {
                id: tempId,
                conversa_id: selectedChat.id,
                remetente_tipo: 'usuario',
                conteudo: messageInput,
                tipo_conteudo: 'texto',
                lido: true,
                criado_em: new Date().toISOString()
            }
            setMessages(prev => [...prev, newMessage])
            setMessageInput('')

            const sentMsg = await crmChatService.sendMessage(selectedChat.id, newMessage.conteudo, 'usuario', currentUser?.id)

            // Replace temp message with real one
            setMessages(prev => prev.map(m => m.id === tempId ? sentMsg : m))

            // Refresh conversation list order
            loadInitialData()

        } catch (error) {
            console.error('Error sending message:', error)
            alert('Erro ao enviar mensagem')
        }
    }

    const handleToggleMode = async () => {
        if (!selectedChat) return
        const newMode = selectedChat.modo === 'bot' ? 'humano' : 'bot'
        try {
            await crmChatService.toggleMode(selectedChat.id, newMode)
            setSelectedChat(prev => prev ? { ...prev, modo: newMode } : null)
            setConversations(prev => prev.map(c => c.id === selectedChat.id ? { ...c, modo: newMode } : c))
        } catch (error) {
            console.error('Error toggling mode:', error)
            alert('Erro ao alterar modo')
        }
    }

    const getAvatarUrl = (name: string) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=fff`
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (loading) return <div className="flex h-full items-center justify-center">Carregando...</div>

    return (
        <div className="flex h-full overflow-hidden bg-[#F3F4F6] p-4 lg:p-6 gap-4">
            {/* Left Panel: Conversation List */}
            <div className="w-80 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 shrink-0 flex-1 md:flex-none h-full">
                {/* Header */}
                <div className="p-4 border-b border-gray-50 flex justify-between items-center shrink-0">
                    <h2 className="font-bold text-gray-800 text-lg tracking-tight">Conversas</h2>
                    <button className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                </div>
                {/* Search */}
                <div className="px-4 py-3 shrink-0">
                    <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 material-symbols-outlined text-[20px] transition-colors">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-gray-700 placeholder-gray-400 transition-all shadow-sm outline-none"
                            placeholder="Buscar cliente..."
                            type="text"
                        />
                    </div>
                </div>
                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {conversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">Nenhuma conversa encontrada</div>
                    ) : conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setSelectedChat(conv)}
                            className={`group flex gap-3 p-3 rounded-xl cursor-pointer relative shadow-sm border border-transparent transition-all ${selectedChat?.id === conv.id
                                ? 'bg-[#f0f9f6] ring-1 ring-emerald-500/20'
                                : 'hover:bg-gray-50 hover:border-gray-100'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <div
                                    className="w-11 h-11 rounded-full bg-cover bg-center shadow-sm"
                                    style={{ backgroundImage: `url('${getAvatarUrl(conv.cliente?.nome_cliente || conv.lead?.nome || 'Cliente')}')` }}
                                ></div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${conv.status === 'aberto' ? 'bg-green-500' : 'bg-gray-300'
                                    }`}></div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-bold text-gray-900 truncate">{conv.cliente?.nome_cliente || conv.lead?.nome || 'Desconhecido'}</h3>
                                    <span className={`text-[10px] font-bold ${selectedChat?.id === conv.id ? 'text-emerald-600' : 'text-gray-400'
                                        }`}>{conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                </div>
                                <p className="text-xs text-gray-600 truncate font-medium">
                                    {conv.modo === 'bot' && <span className="mr-1 text-[10px] bg-gray-200 px-1 rounded text-gray-600">BOT</span>}
                                    {conv.lastMessage?.conteudo || 'Nova conversa'}
                                </p>
                            </div>
                            {conv.unreadCount ? (
                                conv.unreadCount > 0 && (
                                    <div className="flex items-center justify-center self-center">
                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                                            {conv.unreadCount}
                                        </span>
                                    </div>
                                )
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            {/* Center Panel: Chat Interface */}
            <section className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 min-w-[350px] relative h-full overflow-hidden">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-[72px] border-b border-gray-100 px-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-gray-50" style={{ backgroundImage: `url('${getAvatarUrl(selectedChat.cliente?.nome_cliente || selectedChat.lead?.nome || 'C')}')` }}></div>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-sm font-bold text-gray-900 leading-tight">{selectedChat.cliente?.nome_cliente || selectedChat.lead?.nome || 'Cliente'}</h2>
                                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                        {selectedChat.modo === 'bot' ? 'Atendimento Automático (Bot)' : 'Atendimento Humano'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleToggleMode}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 border ${selectedChat.modo === 'bot'
                                        ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">{selectedChat.modo === 'bot' ? 'smart_toy' : 'person'}</span>
                                    {selectedChat.modo === 'bot' ? 'Assumir Conversa' : 'Devolver p/ Bot'}
                                </button>
                                <div className="h-5 w-px bg-gray-200 mx-1"></div>
                                <button className="w-9 h-9 rounded-full hover:bg-gray-50 text-gray-500 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {messages.map((msg, idx) => (
                                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.remetente_tipo === 'usuario' ? 'ml-auto justify-end' : ''}`}>
                                    {msg.remetente_tipo !== 'usuario' && (
                                        <div className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 mt-auto mb-1 ring-2 ring-white" style={{ backgroundImage: `url('${getAvatarUrl(selectedChat.cliente?.nome_cliente || 'C')}')` }}></div>
                                    )}
                                    <div className={`flex flex-col gap-1 items-${msg.remetente_tipo === 'usuario' ? 'end' : 'start'}`}>
                                        <div className={`p-4 rounded-2xl shadow-md text-sm leading-relaxed ${msg.remetente_tipo === 'usuario'
                                            ? 'bg-emerald-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                                            }`}>
                                            <p>{msg.conteudo}</p>
                                        </div>
                                        <div className={`flex items-center gap-1 ${msg.remetente_tipo === 'usuario' ? 'mr-1' : 'ml-1'}`}>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {new Date(msg.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {msg.remetente_tipo === 'usuario' && (
                                                <span className={`material-symbols-outlined text-[14px] ${msg.lido ? 'text-emerald-500' : 'text-gray-300'}`}>done_all</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-inner">
                                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200">
                                        <span className="material-symbols-outlined text-[22px]">attach_file</span>
                                    </button>
                                    <textarea
                                        className="flex-1 bg-transparent border-none p-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-0 resize-none max-h-32 outline-none"
                                        placeholder="Escreva sua mensagem..."
                                        rows={1}
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                    ></textarea>
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-2 bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center disable:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <span className="material-symbols-outlined text-6xl mb-4 opacity-20">chat_bubble</span>
                        <p>Selecione uma conversa para iniciar</p>
                    </div>
                )}
            </section>

            {/* Right Panel: Customer Details (Hidden on small screens) */}
            <aside className="w-80 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col shrink-0 overflow-y-auto hidden xl:flex h-full">
                {selectedChat ? (
                    <>
                        {/* Profile Header */}
                        <div className="p-6 flex flex-col items-center border-b border-gray-50 relative bg-gradient-to-b from-gray-50/50 to-white shrink-0">
                            <div className="w-24 h-24 rounded-full bg-cover bg-center mb-4 ring-4 ring-white shadow-md" style={{ backgroundImage: `url('${getAvatarUrl(selectedChat.cliente?.nome_cliente || selectedChat.lead?.nome || 'C')}')` }}></div>
                            <h3 className="text-xl font-bold text-gray-900 text-center">{selectedChat.cliente?.nome_cliente || selectedChat.lead?.nome || 'Cliente'}</h3>
                            <p className="text-sm text-gray-500 font-medium">{selectedChat.cliente ? 'Cliente Cadastrado' : 'Lead Potencial'}</p>
                        </div>

                        <div className="p-5 flex flex-col gap-5 border-b border-gray-100 shrink-0">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contato</h4>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-400">Email</span>
                                <span className="text-sm font-medium text-gray-800">{selectedChat.cliente?.email || selectedChat.lead?.email || '-'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-400">Telefone</span>
                                <span className="text-sm font-medium text-gray-800">{selectedChat.cliente?.telefone || selectedChat.lead?.telefone || '-'}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-6 text-center text-gray-400 text-sm">Detalhes do cliente</div>
                )}
            </aside>
        </div>
    )
}
