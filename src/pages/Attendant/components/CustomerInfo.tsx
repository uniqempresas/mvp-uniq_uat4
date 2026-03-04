import { useState, useEffect } from 'react';
import { authService } from '../../../services/authService';
import { conversationService } from '../../../services/conversationService';
import type { Conversation } from '../../../types/attendant';

interface CustomerInfoProps {
  conversation: Conversation;
  onAssociateClient: (clientId: string) => void;
}

interface Client {
  id: string;
  nome_cliente: string;
  telefone?: string;
  email?: string;
}

export function CustomerInfo({ conversation, onAssociateClient }: CustomerInfoProps) {
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmpresaId();
  }, []);

  useEffect(() => {
    if (showClientSelector && empresaId) {
      loadClients();
    }
  }, [showClientSelector, empresaId, searchTerm]);

  const loadEmpresaId = async () => {
    const id = await authService.getEmpresaId();
    setEmpresaId(id);
  };

  const loadClients = async () => {
    if (!empresaId) return;
    
    try {
      const { data } = await conversationService.searchClients(empresaId, searchTerm);
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telefone?.includes(searchTerm)
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Cliente</h2>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700">Telefone</label>
        <p className="text-gray-900 flex items-center gap-2">
          <span className="material-symbols-rounded text-gray-400">phone</span>
          {conversation.remote_phone}
        </p>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Cliente Associado
        </label>
        
        {conversation.cliente ? (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-indigo-600">person</span>
              <span className="font-medium text-indigo-900">
                {conversation.cliente.nome_cliente}
              </span>
            </div>
            <button
              onClick={() => setShowClientSelector(true)}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              Alterar cliente
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-2">Nenhum cliente associado</p>
            <button
              onClick={() => setShowClientSelector(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              + Associar cliente
            </button>
          </div>
        )}
      </div>

      {showClientSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Selecionar Cliente</h3>
              <button
                onClick={() => setShowClientSelector(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                loadClients();
              }}
              placeholder="Buscar cliente..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            />

            <div className="overflow-y-auto max-h-64 space-y-2">
              {filteredClients.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum cliente encontrado</p>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      onAssociateClient(client.id);
                      setShowClientSelector(false);
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="font-medium text-gray-900">{client.nome_cliente}</p>
                    {client.telefone && (
                      <p className="text-sm text-gray-500">{client.telefone}</p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700">Status da Conversa</label>
        <div className="mt-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              conversation.status === 'open'
                ? 'bg-green-100 text-green-700'
                : conversation.status === 'archived'
                ? 'bg-gray-100 text-gray-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {conversation.status === 'open' && 'Aberta'}
            {conversation.status === 'archived' && 'Arquivada'}
            {conversation.status === 'pending' && 'Pendente'}
            {conversation.status === 'resolved' && 'Resolvida'}
          </span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Início da Conversa</label>
        <p className="text-gray-900">
          {new Date(conversation.created_at).toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
}
