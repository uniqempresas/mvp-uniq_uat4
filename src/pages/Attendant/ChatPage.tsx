import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { conversationService } from '../../services/conversationService';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { CustomerInfo } from './components/CustomerInfo';
import type { Conversation, Message } from '../../types/attendant';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadUserId();
  }, []);

  useEffect(() => {
    if (id && userId) {
      loadConversation();
      loadMessages();
      markAsRead();
    }
  }, [id, userId]);

  useEffect(() => {
    if (!id) return;
    
    const interval = setInterval(() => {
      loadNewMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [id, messages]);

  const loadUserId = async () => {
    const { data: { user } } = await authService.getUser();
    if (user) {
      setUserId(user.id);
    }
  };

  const loadConversation = useCallback(async () => {
    if (!id) return;
    try {
      const data = await conversationService.getConversation(id);
      setConversation(data);
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    }
  }, [id]);

  const loadMessages = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await conversationService.getMessages(id);
      setMessages(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadNewMessages = useCallback(async () => {
    if (!id || messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    try {
      const newMessages = await conversationService.getRecentMessages(id, lastMessage.created_at);
      if (newMessages.length > 0) {
        setMessages((prev) => [...prev, ...newMessages]);
      }
    } catch (error) {
      console.error('Erro ao carregar novas mensagens:', error);
    }
  }, [id, messages]);

  const markAsRead = useCallback(async () => {
    if (!id) return;
    try {
      await conversationService.markAsRead(id);
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  }, [id]);

  const handleSendMessage = async (content: string) => {
    if (!id || !userId || !content.trim()) return;

    try {
      setSending(true);
      const message = await conversationService.sendMessage(id, content, userId);
      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const handleArchive = async () => {
    if (!id) return;
    try {
      await conversationService.archiveConversation(id);
      navigate('/attendant/conversations');
    } catch (error) {
      console.error('Erro ao arquivar:', error);
    }
  };

  const handleAssociateClient = async (clientId: string) => {
    if (!id) return;
    try {
      await conversationService.associateClient(id, clientId);
      await loadConversation();
    } catch (error) {
      console.error('Erro ao associar cliente:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <span className="material-symbols-rounded text-6xl mb-4">error</span>
        <p>Conversa não encontrada</p>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/attendant/conversations')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-rounded">arrow_back</span>
              </button>

              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {conversation.remote_name || conversation.remote_phone}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{conversation.remote_phone}</span>
                  {conversation.cliente && (
                    <span className="text-indigo-600">• {conversation.cliente.nome_cliente}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleArchive}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-rounded">inventory_2</span>
                Arquivar
              </button>
            </div>
          </div>
        </div>

        <ChatWindow messages={messages} />

        <ChatInput onSend={handleSendMessage} disabled={sending} />
      </div>

      <CustomerInfo
        conversation={conversation}
        onAssociateClient={handleAssociateClient}
      />
    </div>
  );
}
