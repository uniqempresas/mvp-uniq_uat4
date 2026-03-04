import type { Conversation } from '../../../types/attendant';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  onConversationClick: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  loading,
  onConversationClick,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <span className="material-symbols-rounded text-6xl mb-4">chat</span>
        <p className="text-lg">Nenhuma conversa encontrada</p>
        <p className="text-sm">As conversas aparecerão aqui quando clientes enviarem mensagens</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onConversationClick(conversation)}
          className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-rounded text-2xl text-indigo-600">
                person
              </span>
            </div>
            {conversation.unread_count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900 truncate">
                {conversation.remote_name || conversation.remote_phone}
              </h3>
              {conversation.last_message_at && (
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {formatTime(conversation.last_message_at)}
                </span>
              )}
            </div>

            <p
              className={`text-sm truncate ${
                conversation.unread_count > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
              }`}
            >
              {conversation.last_message_preview || 'Nova conversa'}
            </p>

            {conversation.cliente && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs text-indigo-600">
                <span className="material-symbols-rounded text-sm">person_check</span>
                {conversation.cliente.nome_cliente}
              </span>
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex-shrink-0">
            {conversation.status === 'archived' && (
              <span className="material-symbols-rounded text-gray-400" title="Arquivada">
                inventory_2
              </span>
            )}
            {conversation.assigned_to && (
              <span className="material-symbols-rounded text-indigo-500" title="Atribuída">
                assignment_ind
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'Ontem';
  } else if (days < 7) {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
}
