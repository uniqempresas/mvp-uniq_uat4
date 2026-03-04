import { useState, useEffect } from 'react';
import { attendantService } from '../../../services/attendantService';
import type { UraRule } from '../../../types/attendant';

interface UraConfigProps {
  empresaId: string;
}

export function UraConfig({ empresaId }: UraConfigProps) {
  const [rules, setRules] = useState<UraRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyword, setNewKeyword] = useState('');
  const [newResponse, setNewResponse] = useState('');

  useEffect(() => {
    loadRules();
  }, [empresaId]);

  const loadRules = async () => {
    try {
      setLoading(true);
      const data = await attendantService.getUraRules(empresaId);
      setRules(data);
    } catch (error) {
      console.error('Erro ao carregar regras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async () => {
    if (!newKeyword.trim() || !newResponse.trim()) return;

    try {
      await attendantService.addUraRule(empresaId, {
        keyword: newKeyword.trim(),
        response: newResponse.trim(),
        active: true,
      });
      setNewKeyword('');
      setNewResponse('');
      await loadRules();
    } catch (error) {
      console.error('Erro ao adicionar regra:', error);
    }
  };

  const handleRemoveRule = async (ruleId: string) => {
    try {
      await attendantService.removeUraRule(empresaId, ruleId);
      await loadRules();
    } catch (error) {
      console.error('Erro ao remover regra:', error);
    }
  };

  const handleToggleRule = async (rule: UraRule) => {
    try {
      const updatedRules = rules.map((r) =>
        r.id === rule.id ? { ...r, active: !r.active } : r
      );
      await attendantService.saveUraRules(empresaId, updatedRules);
      await loadRules();
    } catch (error) {
      console.error('Erro ao alternar regra:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded shadow-sm border border-gray-200 p-6 mb-6">
        <p className="text-gray-500">Carregando regras URA...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Configuração URA</h2>
      <p className="text-sm text-gray-600 mb-4">
        Configure keywords para respostas automáticas. Quando um cliente enviar uma mensagem 
        contendo uma dessas palavras, o sistema responderá automaticamente.
      </p>

      {/* Add New Rule */}
      <div className="bg-gray-50 rounded p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Adicionar Nova Regra</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Keyword (ex: preço, horário, endereço)"
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <input
            type="text"
            value={newResponse}
            onChange={(e) => setNewResponse(e.target.value)}
            placeholder="Resposta automática"
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button
          onClick={handleAddRule}
          disabled={!newKeyword.trim() || !newResponse.trim()}
          className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          Adicionar Regra
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-2">
        {rules.length === 0 ? (
          <p className="text-gray-500 text-sm italic">Nenhuma regra configurada ainda.</p>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.id}
              className={`flex items-center justify-between p-3 rounded border ${
                rule.active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      rule.active
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {rule.keyword}
                  </span>
                  {!rule.active && (
                    <span className="text-xs text-gray-400">(inativo)</span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${rule.active ? 'text-gray-700' : 'text-gray-400'}`}>
                  {rule.response}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleRule(rule)}
                  className={`p-2 rounded transition-colors ${
                    rule.active
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-200'
                  }`}
                  title={rule.active ? 'Desativar' : 'Ativar'}
                >
                  <span className="material-symbols-outlined">
                    {rule.active ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </button>

                <button
                  onClick={() => handleRemoveRule(rule.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remover"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
