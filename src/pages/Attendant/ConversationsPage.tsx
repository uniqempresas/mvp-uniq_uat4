import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { conversationService } from '../../services/conversationService';
import { ConversationList } from './components/ConversationList';
import type { Conversation, ConversationFilter } from '../../types/attendant';

export default function ConversationsPage() {
  const navigate = useNavigate();
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadEmpresaId();
  }, []);

  useEffect(() => {
    if (empresaId) {
      loadConversations();
      const interval = setInterval(loadConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [empresaId, filter, searchTerm]);

  const loadEmpresaId = async () => {
    const id = await authService.getEmpresaId();
    setEmpresaId(id);
  };

  const loadConversations = async () => {
    if (!empresaId) return;

    try {
      const filters: any = {};
      if (filter === 'unread') filters.status = 'open';
      if (filter === 'archived') filters.status = 'archived';
      if (searchTerm) filters.search = searchTerm;

      const data = await conversationService.getConversations(empresaId, filters);
      setConversations(data);

      const total = data.reduce((sum: number, conv: Conversation) => sum + (conv.unread_count || 0), 0);
      setUnreadCount(total);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    navigate(`/attendant/chat/${conversation.id}`);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (filter === 'unread') return conv.unread_count > 0;
    if (filter === 'archived') return conv.status === 'archived';
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Conversas</h1>
            <p className="text-gray-600">Gerencie suas conversas do WhatsApp</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou telefone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'unread', 'archived'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' && 'Todas'}
                {f === 'unread' && 'Não Lidas'}
                {f === 'archived' && 'Arquivadas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ConversationList
          conversations={filteredConversations}
          loading={loading}
          onConversationClick={handleConversationClick}
        />
      </div>
    </div>
  );
}
