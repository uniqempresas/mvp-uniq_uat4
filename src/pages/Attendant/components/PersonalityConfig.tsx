import type { AttendantConfigFormData } from '../../../types/attendant';

interface PersonalityConfigProps {
  formData: AttendantConfigFormData;
  onChange: (updates: Partial<AttendantConfigFormData>) => void;
}

export function PersonalityConfig({ formData, onChange }: PersonalityConfigProps) {
  return (
    <div className="bg-white rounded shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Personalização do Atendente</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Atendente
          </label>
          <input
            type="text"
            value={formData.agent_name}
            onChange={(e) => onChange({ agent_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Ana da UNIQ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personalidade / Tom de Voz
          </label>
          <textarea
            value={formData.agent_personality || ''}
            onChange={(e) => onChange({ agent_personality: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Profissional mas simpático. Use emojis ocasionalmente. Sempre cordial e prestativo."
          />
          <p className="text-xs text-gray-500 mt-1">
            Descreva como o atendente deve se comportar nas conversas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp (Evolution API)
            </label>
            <input
              type="tel"
              value={formData.phone_number || ''}
              onChange={(e) => onChange({ phone_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+55 11 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID da Instância Evolution
            </label>
            <input
              type="text"
              value={formData.evolution_instance_id || ''}
              onChange={(e) => onChange({ evolution_instance_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex: uniq-empresa-001"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem de Boas-vindas
          </label>
          <textarea
            value={formData.welcome_message}
            onChange={(e) => onChange({ welcome_message: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Olá! Bem-vindo à nossa empresa..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem Fora de Horário
          </label>
          <textarea
            value={formData.away_message}
            onChange={(e) => onChange({ away_message: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Nosso horário de atendimento é..."
          />
        </div>
      </div>
    </div>
  );
}
