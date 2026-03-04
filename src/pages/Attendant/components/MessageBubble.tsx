import type { Message } from '../../../types/attendant';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.direction === 'out';
  const isAutomated = message.is_automated;

  const getSenderLabel = () => {
    if (isAutomated) return 'URA Automática';
    if (message.sender_type === 'system') return 'Sistema';
    if (message.sender_type === 'bot') return 'Bot';
    if (isOutgoing) return message.sender?.nome || 'Você';
    return 'Cliente';
  };

  const getBubbleColor = () => {
    if (isAutomated) return 'bg-purple-100 text-purple-900';
    if (message.sender_type === 'system') return 'bg-gray-200 text-gray-700';
    if (isOutgoing) return 'bg-indigo-600 text-white';
    return 'bg-white text-gray-900 border border-gray-200';
  };

  return (
    <div
      className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] ${
          isOutgoing ? 'items-end' : 'items-start'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-500">{getSenderLabel()}</span>
          {isAutomated && (
            <span className="material-symbols-rounded text-xs text-purple-600">
              smart_toy
            </span>
          )}
        </div>

        <div
          className={`px-4 py-2 rounded-2xl ${getBubbleColor()} ${
            isOutgoing ? 'rounded-tr-sm' : 'rounded-tl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {message.media_url && (
            <div className="mt-2">
              {message.message_type === 'image' ? (
                <img
                  src={message.media_url}
                  alt="Imagem"
                  className="max-w-full rounded-lg"
                />
              ) : (
                <a
                  href={message.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm underline"
                >
                  <span className="material-symbols-rounded">attachment</span>
                  Ver arquivo
                </a>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-gray-400">
            {formatTime(message.created_at)}
          </span>
          {isOutgoing && (
            <span className="material-symbols-rounded text-xs text-gray-400">
              {message.read_at ? 'done_all' : 'check'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
