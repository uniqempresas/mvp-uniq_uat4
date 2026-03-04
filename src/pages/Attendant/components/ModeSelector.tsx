interface ModeSelectorProps {
  mode: 'ura' | 'agent';
  onChange: (mode: 'ura' | 'agent') => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="bg-white rounded shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Modo de Operação</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onChange('ura')}
          className={`p-4 rounded border-2 text-left transition-all ${
            mode === 'ura'
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-2xl text-primary">
              smart_toy
            </span>
            <span className="font-semibold text-gray-900">URA Automática</span>
          </div>
          <p className="text-sm text-gray-600">
            Respostas automáticas baseadas em keywords e horário de funcionamento. 
            Ideal para FAQs e fora de horário.
          </p>
        </button>

        <button
          onClick={() => onChange('agent')}
          className={`p-4 rounded border-2 text-left transition-all ${
            mode === 'agent'
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-2xl text-primary">
              psychology
            </span>
            <span className="font-semibold text-gray-900">Agente Especializado</span>
          </div>
          <p className="text-sm text-gray-600">
            Integração com n8n para fluxos avançados de conversação. 
            Requer configuração de workflow.
          </p>
        </button>
      </div>
    </div>
  );
}
