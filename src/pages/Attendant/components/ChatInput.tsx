import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSend(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-end gap-2">
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Anexar arquivo"
        >
          <span className="material-symbols-rounded">attach_file</span>
        </button>

        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            rows={1}
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
        </div>

        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Emoji"
        >
          <span className="material-symbols-rounded">sentiment_satisfied</span>
        </button>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Enviar"
        >
          <span className="material-symbols-rounded">send</span>
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Pressione Enter para enviar, Shift+Enter para nova linha
      </p>
    </form>
  );
}
