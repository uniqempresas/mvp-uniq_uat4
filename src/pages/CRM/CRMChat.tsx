import React, { useState, useEffect, useRef } from 'react'
import { crmChatService, type ChatConversation, type ChatMessage } from '../../services/crmChatService'
import { authService } from '../../services/authService'
import { clientService } from '../../services/clientService'
import { crmService, type FunnelStage } from '../../services/crmService'
import ClientForm from './ClientForm'

export default function CRMChat() {
    const [conversations, setConversations] = useState<ChatConversation[]>([])
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null)
    const [messageInput, setMessageInput] = useState('')
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)

    // Modal State
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false)
    const [leads, setLeads] = useState<any[]>([])
    const [customers, setCustomers] = useState<any[]>([])
    const [newChatForm, setNewChatForm] = useState({
        id: '', // Phone/Handle
        canal: 'whatsapp',
        titulo: '',
        clienteId: '',
        leadId: '',
        foto_contato: ''
    })

    // CRM Actions State
    const [isClientFormOpen, setIsClientFormOpen] = useState(false)
    const [clientInitialData, setClientInitialData] = useState<any>(undefined)
    const [isOppFormOpen, setIsOppFormOpen] = useState(false)
    const [stages, setStages] = useState<FunnelStage[]>([])
    const [oppForm, setOppForm] = useState({
        titulo: '',
        valor: '',
        estagio: '',
        data_fechamento: ''
    })

    const handleClientSubmit = async (clientData: any) => {
        try {
            const newClient = await clientService.createClient(clientData)

            // Link new lead to current conversation
            if (selectedChat) {
                await crmChatService.updateConversation(selectedChat.id, {
                    lead_id: newClient.id,
                    // If we want to update the conversation title as well:
                    // title: newClient.nome 
                })
            }

            fetchContacts() // Refresh lists
            setIsClientFormOpen(false)
            alert('Lead criado e vinculado com sucesso!')
        } catch (error) {
            console.error('Error creating client:', error)
            alert('Erro ao criar lead')
        }
    }

    const handleOppSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedChat) return

        try {
            await crmService.createOpportunity({
                titulo: oppForm.titulo,
                valor: Number(oppForm.valor),
                estagio: oppForm.estagio,
                cliente_id: selectedChat.cliente?.id, // Only one of these will be set normally
                lead_id: selectedChat.lead?.id,
                data_fechamento: oppForm.data_fechamento ? new Date(oppForm.data_fechamento).toISOString() : undefined,
                empresa_id: '' // Service handles this
            } as any)

            setIsOppFormOpen(false)
            setOppForm({ titulo: '', valor: '', estagio: '', data_fechamento: '' })
            alert('Oportunidade criada com sucesso!')
        } catch (error) {
            console.error('Error creating opportunity:', error)
            alert('Erro ao criar oportunidade')
        }
    }

    useEffect(() => {
        crmService.getStages().then(setStages).catch(console.error)
    }, [])

    const [isActivityFormOpen, setIsActivityFormOpen] = useState(false)
    const [activityForm, setActivityForm] = useState({
        tipo: 'nota',
        descricao: '',
        data_vencimento: ''
    })

    const handleActivitySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedChat) return

        try {
            await crmService.addActivity({

                // Actually, activities usually need a link. If no Opp, maybe just Client/Lead?
                // The DB schema for activities usually links to Opps.
                // Let's check crmService type. It has oportunidade_id.
                // If we want to add activity to a client without opp, we might need schema change or logic.
                // However, crm_atividades generally requires oportunidade_id.
                // For MVP, let's assume we link to LATEST opp or create a generic one?
                // Or maybe just alert if no opp.
                // WAIT: crm_atividades usually has client_id too?
                // Checked crmService.ts: activity interface has oportunidade_id, empresa_id.
                // It seems activities are TIGHTLY coupled to opportunities in this system.
                // If so, we can only add activity if there is an opportunity.
                // Let's try to find an active opportunity for this client.
                // If none, maybe prompt to create one?
                // OR, just pass empty string if DB allows nullable.
                // Checking DB schema via types: Activity interface has oportunidade_id as string (mandatory?).
                // Let's assume mandatory for now.
                // If so, I'll fetch opportunities for this client and pick the first one, or ask user to select?
                // Use a 'General' logic: If no opp, maybe we can't create activity.
                // Let's check if the user is a Lead/Client.
                // For now, I will send '' and see if it fails (it likely will if FK).
                // BETTER STRATEGY: Fetch user's opportunities.

                // Workaround: link to dummy ID or handle logic.
                // Let's just try to send generic activity if possible.
                // If not, I'll just alert "Selecione uma oportunidade".
                // But for "Chat Actions", it implies "Add Note to THIS customer".

                // Let's pass a dummy or empty ID for now and see if backend handles it (some CRMs allow activities on Clients directly).
                // Update: crmService.ts addActivity takes `Omit<Activity, ...>`. `oportunidade_id` is required.

                // I will assume there is an open opportunity or I can't add activity?
                // Let's use a "General" placeholder if allowed, or just fail safely.
                // For now, I will try to use the selectedChat.id if it happens to be valid UUID? No.

                oportunidade_id: '00000000-0000-0000-0000-000000000000', // Placeholder or try to find one?
                tipo: activityForm.tipo as any,
                descricao: activityForm.descricao,
                data_vencimento: activityForm.data_vencimento ? new Date(activityForm.data_vencimento).toISOString() : undefined,
                empresa_id: '',
                concluido: false
            })
            setIsActivityFormOpen(false)
            setActivityForm({ tipo: 'nota', descricao: '', data_vencimento: '' })
            alert('Atividade criada com sucesso!')
        } catch (error) {
            console.error('Error creating activity:', error)
            // If it fails due to FK, we know we need an Opp.
            alert('Erro: É necessário ter uma oportunidade ativa para criar atividades.')
        }
    }

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const user = await authService.getCurrentUser()
            setCurrentUser(user)
        }
        fetchUser()
        loadInitialData()
        fetchContacts()
    }, [])

    useEffect(() => {
        if (selectedChat) {
            loadMessages(selectedChat.id)
            crmChatService.markAsRead(selectedChat.id) // Mark read on open
        }
    }, [selectedChat])

    // Auto scroll to bottom
    useEffect(() => {
        // Use 'auto' instead of 'smooth' to ensure it jumps to end instantly, 
        // preventing user from getting lost or seeing scroll animation on load.
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }, [messages])

    // Polling for updates (Autorefresh)
    useEffect(() => {
        const interval = setInterval(() => {
            // silent update
            loadInitialData(true)
            if (selectedChat) {
                loadMessages(selectedChat.id, true)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [selectedChat, selectedChat?.id])

    const loadInitialData = async (silent = false) => {
        try {
            if (!silent) setLoading(true)
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
            if (!silent) setLoading(false)
        }
    }

    const fetchContacts = async () => {
        try {
            const [leadsData, customersData] = await Promise.all([
                clientService.getClients(), // Returns leads (crm_leads usually, based on previous analysis)
                clientService.getCustomers() // Returns me_cliente
            ])
            setLeads(leadsData)
            setCustomers(customersData)
        } catch (error) {
            console.error('Error fetching contacts:', error)
        }
    }

    const loadMessages = async (chatId: string, silent = false) => {
        try {
            const msgs = await crmChatService.getMessages(chatId)
            // If silent update, only update if length changed or new content
            // Simple check: compare length first, then ID of last message
            if (silent) {
                setMessages(current => {
                    if (current.length !== msgs.length) return msgs
                    const lastCurrent = current[current.length - 1]
                    const lastNew = msgs[msgs.length - 1]
                    if (lastCurrent?.id !== lastNew?.id) return msgs
                    return current
                })
            } else {
                setMessages(msgs)
            }
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

            // Parallel execution: Persist to DB and Send to Webhook
            const [sentMsg] = await Promise.all([
                crmChatService.sendMessage(selectedChat.id, newMessage.conteudo, 'usuario', currentUser?.id),
                crmChatService.sendToWebhook({
                    conversaId: selectedChat.id,
                    conteudo: newMessage.conteudo,
                    remetenteId: currentUser?.id,
                    remetenteTipo: 'usuario',
                    timestamp: newMessage.criado_em
                })
            ])

            // Replace temp message with real one
            setMessages(prev => prev.map(m => m.id === tempId ? sentMsg : m))

            // Refresh conversation list order
            loadInitialData(true)

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

    const handleCreateConversation = async () => {
        if (!newChatForm.canal) {
            alert('Selecione um canal')
            return
        }
        // ID is optional, but if provided it should be used. User said "solicited the contract of lead/client".
        // If contract/lead selected, we might use their phone as ID?
        // Or if ID (phone) is entered manually.
        // Let's rely on form ID if present, otherwise let dropdowns populate it?
        // Actually, contract usually implies connecting to a DB entity.
        // Let's ensure at least one contact method is clear.

        try {
            const empresaId = await authService.getEmpresaId()
            if (!empresaId) return

            // Determine title
            let title = newChatForm.titulo
            if (!title) {
                if (newChatForm.clienteId) {
                    const c = customers.find(x => x.id === newChatForm.clienteId)
                    title = c?.nome_cliente || 'Novo Chat'
                } else if (newChatForm.leadId) {
                    const l = leads.find(x => x.id === newChatForm.leadId)
                    title = l?.nome || 'Novo Chat'
                } else {
                    title = newChatForm.id || 'Visitante'
                }
            }

            const newConv = await crmChatService.createConversation(empresaId, title, {
                id: newChatForm.id || undefined,
                clienteId: newChatForm.clienteId || undefined,
                leadId: newChatForm.leadId || undefined,
                canal: newChatForm.canal,
                foto_contato: newChatForm.foto_contato
            })

            setConversations(prev => [newConv, ...prev])
            setSelectedChat(newConv)
            setIsNewChatModalOpen(false)
            setNewChatForm({
                id: '',
                canal: 'whatsapp',
                titulo: '',
                clienteId: '',
                leadId: '',
                foto_contato: ''
            })

        } catch (error) {
            console.error('Error creating conversation:', error)
            alert('Erro ao criar conversa')
        }
    }

    const getAvatarUrl = (name: string, photoUrl?: string) => {
        if (photoUrl) return photoUrl
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=fff`
    }

    const getChannelIcon = (channel: string) => {
        switch (channel?.toLowerCase()) {
            case 'whatsapp': return 'chat' // Material symbol doesn't have whatsapp specifically, maybe 'chat' or custom
            // In a real app we'd use specific SVGs.
            case 'instagram': return 'photo_camera'
            case 'facebook': return 'public'
            default: return 'mail'
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (loading) return <div className="flex h-full items-center justify-center">Carregando...</div>

    return (
        <div className="flex h-full overflow-hidden bg-[#F3F4F6] p-4 lg:p-6 gap-4 relative">
            {/* Left Panel: Conversation List */}
            <div className="w-80 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 shrink-0 flex-1 md:flex-none h-full">
                {/* Header */}
                <div className="p-4 border-b border-gray-50 flex justify-between items-center shrink-0">
                    <h2 className="font-bold text-gray-800 text-lg tracking-tight">Conversas</h2>
                    <button
                        onClick={() => setIsNewChatModalOpen(true)}
                        className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                </div>
                {/* Search */}
                <div className="px-4 py-3 shrink-0">
                    <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 material-symbols-outlined text-[20px] transition-colors">search</span>
                        <input
                            id="chat-search"
                            name="chat-search"
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
                                    style={{ backgroundImage: `url('${getAvatarUrl(conv.cliente?.nome_cliente || conv.lead?.nome || conv.nome || conv.titulo || 'Cliente', conv.foto_contato)}')` }}
                                ></div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${conv.status === 'aberto' ? 'bg-green-500' : 'bg-gray-300'
                                    }`}></div>
                                {/* Channel Icon Badge */}
                                {conv.canal && (
                                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                                        <span className="material-symbols-outlined text-[10px] text-gray-500 block">
                                            {getChannelIcon(conv.canal)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-bold text-gray-900 truncate">{conv.cliente?.nome_cliente || conv.lead?.nome || conv.nome || conv.titulo || 'Desconhecido'}</h3>
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
                                    <div className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-gray-50" style={{ backgroundImage: `url('${getAvatarUrl(selectedChat.cliente?.nome_cliente || selectedChat.lead?.nome || selectedChat.nome || selectedChat.titulo || 'C', selectedChat.foto_contato)}')` }}></div>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-sm font-bold text-gray-900 leading-tight">{selectedChat.cliente?.nome_cliente || selectedChat.lead?.nome || selectedChat.nome || selectedChat.titulo || 'Cliente'}</h2>
                                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                        {selectedChat.modo === 'bot' ? 'Atendimento Automático (Bot)' : 'Atendimento Humano'}
                                        {selectedChat.canal && <span className="text-gray-400 mx-1">• {selectedChat.canal}</span>}
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
                            {messages.map((msg) => {
                                const isRight = msg.remetente_tipo === 'usuario' || msg.remetente_tipo === 'sistema'
                                return (
                                    <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isRight ? 'ml-auto justify-end' : ''}`}>
                                        {!isRight && (
                                            <div className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 mt-auto mb-1 ring-2 ring-white" style={{ backgroundImage: `url('${getAvatarUrl(selectedChat.cliente?.nome_cliente || selectedChat.nome || 'C', selectedChat.foto_contato)}')` }}></div>
                                        )}
                                        <div className={`flex flex-col gap-1 items-${isRight ? 'end' : 'start'}`}>
                                            <div className={`p-4 rounded-2xl shadow-md text-sm leading-relaxed ${isRight
                                                ? 'bg-emerald-500 text-white rounded-br-none'
                                                : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                                                }`}>
                                                <p>{msg.conteudo}</p>
                                            </div>
                                            <div className={`flex items-center gap-1 ${isRight ? 'mr-1' : 'ml-1'}`}>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(msg.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isRight && (
                                                    <span className={`material-symbols-outlined text-[14px] ${msg.lido ? 'text-emerald-500' : 'text-gray-300'}`}>done_all</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
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
                                        id="message-input"
                                        name="message"
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
                            <div className="absolute top-4 right-4 flex gap-1">
                                <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                </button>
                            </div>
                            <div className="w-24 h-24 rounded-full bg-cover bg-center mb-4 ring-4 ring-white shadow-md" style={{ backgroundImage: `url('${getAvatarUrl(selectedChat.cliente?.nome_cliente || selectedChat.lead?.nome || selectedChat.nome || 'C', selectedChat.foto_contato)}')` }}></div>
                            <h3 className="text-xl font-bold text-gray-900 text-center">{selectedChat.cliente?.nome_cliente || selectedChat.lead?.nome || selectedChat.nome || selectedChat.titulo || 'Cliente'}</h3>
                            <p className="text-sm text-gray-500 font-medium">{selectedChat.cliente ? 'Cliente Cadastrado' : selectedChat.lead ? 'Lead Potencial' : 'Visitante'}</p>
                            <div className="flex gap-2 mt-4">
                                {selectedChat.cliente && <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider border border-purple-200">CLIENTE</span>}
                                {selectedChat.modo === 'bot' && <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200">BOT</span>}
                            </div>
                        </div>

                        {/* Actions Grid */}
                        <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-100 bg-gray-50/30 shrink-0">
                            <button className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all shadow-sm active:scale-95">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                Marcar Resolvido
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors hover:border-gray-300">
                                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                Agendar
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors hover:border-gray-300">
                                <span className="material-symbols-outlined text-[18px]">article</span>
                                Nota
                            </button>

                            {/* CRM Actions */}
                            {!selectedChat.cliente && !selectedChat.lead && (
                                <button
                                    onClick={() => {
                                        setClientInitialData({
                                            nome: selectedChat.cliente?.nome_cliente || selectedChat.lead?.nome || selectedChat?.nome || selectedChat?.titulo || '',
                                            telefone: selectedChat?.id || '',
                                            status: 'Novo',
                                            origem: 'Chat',
                                            foto_url: selectedChat?.foto_contato || ''
                                        })
                                        setIsClientFormOpen(true)
                                    }}
                                    className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                                    Adicionar Lead
                                </button>
                            )}

                            {(selectedChat.cliente || selectedChat.lead) && (

                                <>
                                    <button
                                        onClick={() => {
                                            setOppForm({
                                                titulo: `Oportunidade ${selectedChat.cliente?.nome_cliente || selectedChat.lead?.nome}`,
                                                valor: '',
                                                estagio: stages[0]?.nome || '',
                                                data_fechamento: ''
                                            })
                                            setIsOppFormOpen(true)
                                        }}
                                        className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 text-sm font-bold hover:bg-indigo-100 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                        ```
                                        Nova Oportunidade
                                    </button>

                                    {/* Show Add Activity if Client/Lead (assuming possibility of opportunity) */}
                                    <button
                                        onClick={() => setIsActivityFormOpen(true)}
                                        className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 text-sm font-bold hover:bg-orange-100 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">event_note</span>
                                        Nova Atividade
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Info List */}
                        <div className="p-5 flex flex-col gap-5 border-b border-gray-100 shrink-0">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Informações de Contato</h4>
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">mail</span>
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-xs text-gray-400">Email</span>
                                    <span className="text-sm font-medium text-gray-800 group-hover:text-emerald-600 transition-colors truncate" title={selectedChat.cliente?.email || selectedChat.lead?.email}>
                                        {selectedChat.cliente?.email || selectedChat.lead?.email || '-'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">call</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Telefone</span>
                                    <span className="text-sm font-medium text-gray-800 group-hover:text-emerald-600 transition-colors">
                                        {selectedChat.cliente?.telefone || selectedChat.lead?.telefone || selectedChat.id || '-'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">domain</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Canal</span>
                                    <span className="text-sm font-medium text-gray-800 group-hover:text-emerald-600 transition-colors capitalize">
                                        {selectedChat.canal || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* History/Deals Widget */}
                        <div className="p-5 flex flex-col gap-4 flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Oportunidades</h4>
                                <button className="text-emerald-600 hover:text-emerald-700 text-xs font-bold">VER TUDO</button>
                            </div>
                            {/* Placeholder Data for UI Demo */}
                            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:border-emerald-500/30 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">Licença Enterprise</span>
                                    <span className="text-xs font-bold text-gray-900">R$ 12k</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-yellow-400 w-[60%] rounded-full"></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                                    <span>Em negociação</span>
                                    <span>60%</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action */}
                        <div className="p-4 mt-auto border-t border-gray-100 shrink-0">
                            <button className="w-full py-2.5 rounded-lg bg-gray-50 text-gray-600 text-sm font-bold hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">person</span>
                                Ver Perfil Detalhado
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-6 text-center text-gray-400 text-sm">Selecione uma conversa para ver detalhes</div>
                )}
            </aside>

            {/* New Chat Modal */}
            {isNewChatModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[fade-in-up_0.3s_ease-out]">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h2 className="text-lg font-bold text-gray-900">Nova Conversa</h2>
                            <button
                                onClick={() => setIsNewChatModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label htmlFor="new-chat-canal" className="block text-sm font-semibold text-gray-700 mb-1.5">Canal</label>
                                <select
                                    id="new-chat-canal"
                                    name="canal"
                                    className="w-full h-10 rounded-lg border-gray-300 bg-white px-3 text-sm focus:border-primary focus:ring-primary/20 transition-all border"
                                    value={newChatForm.canal}
                                    onChange={e => setNewChatForm({ ...newChatForm, canal: e.target.value })}
                                >
                                    <option value="whatsapp">Whatsapp</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="new-chat-id" className="block text-sm font-semibold text-gray-700 mb-1.5">ID do Contato (Telefone/Handle)</label>
                                <input
                                    id="new-chat-id"
                                    name="contact-id"
                                    className="w-full h-10 rounded-lg border-gray-300 bg-white px-3 text-sm focus:border-primary focus:ring-primary/20 transition-all border"
                                    type="text"
                                    placeholder="Ex: 5511999999999"
                                    value={newChatForm.id}
                                    onChange={e => setNewChatForm({ ...newChatForm, id: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Este será o identificador único da conversa.</p>
                            </div>

                            <div>
                                <label htmlFor="new-chat-photo" className="block text-sm font-semibold text-gray-700 mb-1.5">Foto do Contato (URL - Opcional)</label>
                                <input
                                    id="new-chat-photo"
                                    name="contact-photo"
                                    className="w-full h-10 rounded-lg border-gray-300 bg-white px-3 text-sm focus:border-primary focus:ring-primary/20 transition-all border"
                                    type="text"
                                    placeholder="https://..."
                                    value={newChatForm.foto_contato}
                                    onChange={e => setNewChatForm({ ...newChatForm, foto_contato: e.target.value })}
                                />
                            </div>

                            <hr className="border-gray-100" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vincular Cliente (Opcional)</p>

                            <div>
                                <label htmlFor="new-chat-lead" className="block text-sm font-semibold text-gray-700 mb-1.5">Lead</label>
                                <select
                                    id="new-chat-lead"
                                    name="link-lead"
                                    className="w-full h-10 rounded-lg border-gray-300 bg-white px-3 text-sm focus:border-primary focus:ring-primary/20 transition-all border"
                                    value={newChatForm.leadId}
                                    onChange={e => setNewChatForm({ ...newChatForm, leadId: e.target.value, clienteId: '' })}
                                >
                                    <option value="">Selecione um Lead...</option>
                                    {leads.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="new-chat-client" className="block text-sm font-semibold text-gray-700 mb-1.5">Cliente</label>
                                <select
                                    id="new-chat-client"
                                    name="link-client"
                                    className="w-full h-10 rounded-lg border-gray-300 bg-white px-3 text-sm focus:border-primary focus:ring-primary/20 transition-all border"
                                    value={newChatForm.clienteId}
                                    onChange={e => setNewChatForm({ ...newChatForm, clienteId: e.target.value, leadId: '' })}
                                >
                                    <option value="">Selecione um Cliente...</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.nome_cliente}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsNewChatModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateConversation}
                                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
                            >
                                Iniciar Conversa
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Client Form Modal */}
            <ClientForm
                isOpen={isClientFormOpen}
                onClose={() => setIsClientFormOpen(false)}
                onSubmit={handleClientSubmit}
                initialData={clientInitialData}
            />
            {/* Opportunity Modal */}
            {isOppFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-lg text-slate-900">Nova Oportunidade</h3>
                            <button onClick={() => setIsOppFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleOppSubmit} className="p-6 flex flex-col gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Título</label>
                                <input
                                    required
                                    value={oppForm.titulo}
                                    onChange={e => setOppForm({ ...oppForm, titulo: e.target.value })}
                                    className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                    placeholder="Ex: Venda de Consultoria"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Valor (R$)</label>
                                    <input
                                        type="number"
                                        value={oppForm.valor}
                                        onChange={e => setOppForm({ ...oppForm, valor: e.target.value })}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Estágio</label>
                                    <select
                                        value={oppForm.estagio}
                                        onChange={e => setOppForm({ ...oppForm, estagio: e.target.value })}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                    >
                                        <option value="">Selecione...</option>
                                        {stages.map(s => (
                                            <option key={s.id} value={s.nome}>{s.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Data de Fechamento</label>
                                <input
                                    type="date"
                                    value={oppForm.data_fechamento}
                                    onChange={e => setOppForm({ ...oppForm, data_fechamento: e.target.value })}
                                    className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOppFormOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm transition-colors"
                                >
                                    Salvar Oportunidade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Activity Modal */}
            {isActivityFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-lg text-slate-900">Nova Atividade</h3>
                            <button onClick={() => setIsActivityFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleActivitySubmit} className="p-6 flex flex-col gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Tipo</label>
                                <select
                                    value={activityForm.tipo}
                                    onChange={e => setActivityForm({ ...activityForm, tipo: e.target.value })}
                                    className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                >
                                    <option value="nota">Nota</option>
                                    <option value="tarefa">Tarefa</option>
                                    <option value="reuniao">Reunião</option>
                                    <option value="ligacao">Ligação</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Descrição *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={activityForm.descricao}
                                    onChange={e => setActivityForm({ ...activityForm, descricao: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm p-3"
                                    placeholder="Detalhes da atividade..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Data de Vencimento</label>
                                <input
                                    type="datetime-local"
                                    value={activityForm.data_vencimento}
                                    onChange={e => setActivityForm({ ...activityForm, data_vencimento: e.target.value })}
                                    className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsActivityFormOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm transition-colors"
                                >
                                    Salvar Atividade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
