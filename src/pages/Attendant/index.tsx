import React, { useState, useEffect, useRef } from 'react';
import { conversationService } from '../../services/conversationService';
import { attendantService } from '../../services/attendantService';
import { authService } from '../../services/authService';
import { clientService } from '../../services/clientService';
import type { Conversation, Message, AttendantConfig } from '../../types/attendant';
import { useNavigate } from 'react-router-dom';

export default function AttendantModule() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [config, setConfig] = useState<AttendantConfig | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'archived'>('all');
  
  // Modals
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter Logic
  const filteredConversations = conversations.filter(conv => {
    const name = conv.remote_name || conv.remote_phone || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.remote_phone.includes(searchTerm);
    
    if (!matchesSearch) return false;
    
    if (filterStatus === 'all') return true;
    if (filterStatus === 'unread') return conv.unread_count > 0;
    if (filterStatus === 'archived') return conv.status === 'archived';
    
    return true;
  });

  useEffect(() => {
    loadInitialData();
    loadClients();
    const interval = setInterval(() => {
      loadConversations(true);
      if (selectedChat) {
        loadMessages(selectedChat.id, true);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      conversationService.markAsRead(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const loadInitialData = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      
      const empId = await authService.getEmpresaId();
      
      if (empId) {
        const configData = await attendantService.getConfig(empId);
        setConfig(configData);
        await loadConversations();
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadConversations = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const empId = await authService.getEmpresaId();
      if (empId) {
        const data = await conversationService.getConversations(empId);
        setConversations(data);
        if (data.length > 0 && !selectedChat) {
          setSelectedChat(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadMessages = async (chatId: string, silent = false) => {
    try {
      const msgs = await conversationService.getMessages(chatId);
      if (silent) {
        setMessages(current => {
          if (current.length !== msgs.length) return msgs;
          const lastCurrent = current[current.length - 1];
          const lastNew = msgs[msgs.length - 1];
          if (lastCurrent?.id !== lastNew?.id) return msgs;
          return current;
        });
      } else {
        setMessages(msgs);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !currentUser) return;

    try {
      // Optimistic update
      const tempId = Math.random().toString();
      const newMessage: Message = {
        id: tempId,
        id_conversa: selectedChat.id,
        direction: 'out',
        sender_type: 'agent',
        sender_id: currentUser.id,
        content: messageInput,
        message_type: 'text',
        is_automated: false,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');

      const sentMsg = await conversationService.sendMessage(
        selectedChat.id, 
        newMessage.content, 
        currentUser.id
      );

      setMessages(prev => prev.map(m => m.id === tempId ? sentMsg : m));
      loadConversations(true);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erro ao enviar mensagem');
    }
  };

  const handleAssociateClient = async (clientId: string) => {
    if (!selectedChat) return;
    try {
      await conversationService.associateClient(selectedChat.id, clientId);
      const updated = { ...selectedChat, id_cliente: clientId };
      setSelectedChat(updated);
      setConversations(prev => prev.map(c => c.id === selectedChat.id ? updated : c));
      setIsAssociateModalOpen(false);
    } catch (error) {
      console.error('Error associating client:', error);
    }
  };

  const handleArchiveChat = async () => {
    if (!selectedChat) return;
    try {
      await conversationService.archiveConversation(selectedChat.id);
      setConversations(prev => prev.filter(c => c.id !== selectedChat.id));
      setSelectedChat(null);
    } catch (error) {
      console.error('Error archiving chat:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b77f&color=fff`;
  };

  const getClientName = (conv: Conversation) => {
    return conv.cliente?.nome_cliente || conv.remote_name || conv.remote_phone || 'Desconhecido';
  };

  if (loading) return <div className="flex h-full items-center justify-center">Carregando...</div>;

  return (
    <div className="flex w-full h-full overflow-hidden bg-[#F3F4F6] p-0 lg:p-6 gap-4 relative">
      {/* Left Panel: Conversation List */}
      <div className={`
        flex-col bg-white lg:rounded-xl shadow-sm border-r lg:border border-gray-100 shrink-0 h-full transition-all duration-300
        ${selectedChat ? 'hidden lg:flex w-[360px]' : 'flex w-full lg:w-[360px]'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-50 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-gray-800 text-lg tracking-tight">Conversas WhatsApp</h2>
          <button
            onClick={() => navigate('/attendant/config')}
            className="h-9 w-9 rounded-full bg-[#10b77f]/10 text-[#10b77f] flex items-center justify-center hover:bg-[#10b77f] hover:text-white transition-colors shadow-sm"
            title="Configurações"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 shrink-0 space-y-3">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10b77f] material-symbols-outlined text-[20px] transition-colors">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#10b77f]/20 focus:bg-white text-gray-700 placeholder-gray-400 transition-all shadow-sm outline-none"
              placeholder="Buscar nome ou telefone..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === 'unread' ? 'bg-[#10b77f] text-white' : 'bg-[#10b77f]/10 text-[#10b77f] hover:bg-[#10b77f]/20'}`}
            >
              Não Lidas
            </button>
            <button
              onClick={() => setFilterStatus('archived')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === 'archived' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Arquivadas
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">Nenhuma conversa encontrada</div>
          ) : filteredConversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelectedChat(conv)}
              className={`group flex gap-3 p-3 rounded-xl cursor-pointer relative shadow-sm border border-transparent transition-all ${selectedChat?.id === conv.id
                ? 'bg-[#10b77f]/5 ring-1 ring-[#10b77f]/20'
                : 'hover:bg-gray-50 hover:border-gray-100'
              }`}
            >
              <div className="relative shrink-0">
                <div
                  className="w-11 h-11 rounded-full bg-cover bg-center shadow-sm"
                  style={{ backgroundImage: `url('${getAvatarUrl(getClientName(conv))}')` }}
                ></div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${conv.status === 'open' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{getClientName(conv)}</h3>
                  <span className={`text-[10px] font-bold ${selectedChat?.id === conv.id ? 'text-[#10b77f]' : 'text-gray-400'}`}>
                    {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate font-medium">
                  {conv.last_message_preview || 'Nova conversa'}
                </p>
              </div>
              {conv.unread_count > 0 && (
                <div className="flex items-center justify-center self-center">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#10b77f] text-white text-[10px] font-bold">
                    {conv.unread_count}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel: Chat */}
      <section className={`
        flex-col bg-white lg:rounded-xl shadow-sm border border-gray-100 relative h-full overflow-hidden
        ${selectedChat ? 'flex w-full flex-1' : 'hidden lg:flex lg:flex-1'}
      `}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="h-[72px] border-b border-gray-100 px-4 lg:px-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur z-10">
              <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>

                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-gray-50" 
                    style={{ backgroundImage: `url('${getAvatarUrl(getClientName(selectedChat))}')` }}>
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h2 className="text-sm font-bold text-gray-900 leading-tight truncate">{getClientName(selectedChat)}</h2>
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0"></span>
                    <span className="truncate">{selectedChat.remote_phone}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  className={`xl:hidden p-2 rounded-lg transition-colors ${isDetailsOpen ? 'bg-[#10b77f]/10 text-[#10b77f]' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                >
                  <span className="material-symbols-outlined">info</span>
                </button>
                <div className="h-5 w-px bg-gray-200 mx-1 hidden xl:block"></div>
                <button
                  onClick={handleArchiveChat}
                  className="w-9 h-9 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                  title="Arquivar Conversa"
                >
                  <span className="material-symbols-outlined text-[20px]">archive</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {messages.map((msg) => {
                const isRight = msg.direction === 'out';
                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isRight ? 'ml-auto justify-end' : ''}`}>
                    {!isRight && (
                      <div className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 mt-auto mb-1 ring-2 ring-white" 
                        style={{ backgroundImage: `url('${getAvatarUrl(getClientName(selectedChat))}')` }}>
                      </div>
                    )}
                    <div className={`flex flex-col gap-1 items-${isRight ? 'end' : 'start'}`}>
                      <div className={`p-4 rounded-2xl shadow-md text-sm leading-relaxed ${isRight
                        ? 'bg-[#10b77f] text-white rounded-br-none'
                        : msg.is_automated
                          ? 'bg-purple-100 text-purple-900 rounded-bl-none border border-purple-200'
                          : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                      }`}>
                        {msg.is_automated && (
                          <div className="flex items-center gap-1 mb-1 text-[10px] font-bold uppercase tracking-wider opacity-70">
                            <span className="material-symbols-outlined text-[12px]">smart_toy</span>
                            URA Automática
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${isRight ? 'mr-1' : 'ml-1'}`}>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isRight && (
                          <span className={`material-symbols-outlined text-[14px] ${msg.read_at ? 'text-[#10b77f]' : 'text-gray-300'}`}>done_all</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#10b77f]/20 focus-within:border-[#10b77f] transition-all shadow-inner">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200">
                    <span className="material-symbols-outlined text-[22px]">attach_file</span>
                  </button>
                  <textarea
                    className="flex-1 bg-transparent border-none p-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-0 resize-none max-h-32 outline-none"
                    placeholder="Digite sua mensagem..."
                    rows={1}
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                  ></textarea>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-[#10b77f] text-white rounded-lg shadow-md hover:bg-[#0a8a5f] active:scale-95 transition-all flex items-center justify-center"
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

      {/* Right Panel: Customer Details */}
      <aside className={`
        w-[360px] bg-white lg:rounded-xl shadow-sm border-l border-gray-100 flex-col shrink-0 overflow-y-auto h-full z-20
        xl:flex transition-transform duration-300
        fixed inset-y-0 right-0 lg:relative lg:inset-auto lg:transform-none
        ${isDetailsOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0 hidden'}
      `}>
        {/* Mobile Header */}
        <div className="xl:hidden p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Detalhes</h3>
          <button onClick={() => setIsDetailsOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {selectedChat ? (
          <>
            {/* Profile Header */}
            <div className="p-6 flex flex-col items-center border-b border-gray-50 relative bg-gradient-to-b from-gray-50/50 to-white shrink-0">
              <div className="w-24 h-24 rounded-full bg-cover bg-center mb-4 ring-4 ring-white shadow-md" 
                style={{ backgroundImage: `url('${getAvatarUrl(getClientName(selectedChat))}')` }}>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center">{getClientName(selectedChat)}</h3>
              <p className="text-sm text-gray-500 font-medium">
                {selectedChat.cliente ? 'Cliente Cadastrado' : 'Não Associado'}
              </p>
              <div className="flex gap-2 mt-4">
                {selectedChat.cliente && (
                  <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider border border-purple-200">
                    CLIENTE
                  </span>
                )}
                {config?.mode === 'ura' && (
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                    URA
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-100 bg-gray-50/30 shrink-0">
              <button className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#10b77f] text-white text-sm font-medium hover:bg-[#0a8a5f] transition-all shadow-sm active:scale-95">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Marcar Resolvido
              </button>
              
              {!selectedChat.cliente && (
                <button
                  onClick={() => setIsAssociateModalOpen(true)}
                  className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Associar Cliente
                </button>
              )}
              
              {selectedChat.cliente && (
                <button
                  onClick={() => navigate(`/crm?client=${selectedChat.cliente?.id}`)}
                  className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 text-sm font-bold hover:bg-indigo-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  Ver no CRM
                </button>
              )}
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col gap-5 border-b border-gray-100 shrink-0">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Informações de Contato</h4>
              
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#10b77f]/10 group-hover:text-[#10b77f] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Telefone</span>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-[#10b77f] transition-colors">
                    {selectedChat.remote_phone}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#10b77f]/10 group-hover:text-[#10b77f] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Status</span>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-[#10b77f] transition-colors capitalize">
                    {selectedChat.status === 'open' ? 'Aberta' : selectedChat.status === 'archived' ? 'Arquivada' : selectedChat.status}
                  </span>
                </div>
              </div>

              {config?.agent_name && (
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#10b77f]/10 group-hover:text-[#10b77f] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Atendente</span>
                    <span className="text-sm font-medium text-gray-800 group-hover:text-[#10b77f] transition-colors">
                      {config.agent_name}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom */}
            <div className="p-4 mt-auto border-t border-gray-100 shrink-0">
              <button 
                onClick={() => navigate('/attendant/config')}
                className="w-full py-2.5 rounded-lg bg-gray-50 text-gray-600 text-sm font-bold hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Configurar Atendente
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-gray-400 text-sm flex-1 flex items-center justify-center">
            Selecione uma conversa para ver detalhes
          </div>
        )}
      </aside>

      {/* Backdrop mobile */}
      {isDetailsOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 xl:hidden backdrop-blur-sm"
          onClick={() => setIsDetailsOpen(false)}
        ></div>
      )}

      {/* Associate Client Modal */}
      {isAssociateModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-gray-900">Associar Cliente</h2>
              <button
                onClick={() => setIsAssociateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 max-h-[400px] overflow-y-auto">
              {clients.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum cliente encontrado</p>
              ) : (
                <div className="space-y-2">
                  {clients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => handleAssociateClient(client.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#10b77f]/10 flex items-center justify-center text-[#10b77f] font-bold">
                        {client.nome_cliente.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.nome_cliente}</p>
                        {client.telefone && (
                          <p className="text-sm text-gray-500">{client.telefone}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsAssociateModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
