import { useState } from 'react'

interface UraOpcao {
  id: string
  label: string
  acao: 'mensagem' | 'transferir'
  destino: string
}

interface UraConfig {
  ativa: boolean
  boas_vindas: string
  opcoes: UraOpcao[]
}

const mockUraConfig: UraConfig = {
  ativa: true,
  boas_vindas: 'Olá! Bem-vindo ao atendimento automático. Escolha uma opção:',
  opcoes: [
    { id: '1', label: 'Ver preços', acao: 'mensagem', destino: 'Nossos preços começam em R$ 50,00' },
    { id: '2', label: 'Horário de funcionamento', acao: 'mensagem', destino: 'Segunda a Sexta, 8h às 18h' },
    { id: '3', label: 'Falar com atendente', acao: 'transferir', destino: 'humano' }
  ]
}

export function CRMURASettings() {
  const [config, setConfig] = useState<UraConfig>(mockUraConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [editingOption, setEditingOption] = useState<string | null>(null)
  const [newOption, setNewOption] = useState<UraOpcao>({
    id: '',
    label: '',
    acao: 'mensagem',
    destino: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setSaveMessage('Configurações salvas com sucesso!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddOption = () => {
    if (!newOption.label || !newOption.destino) return
    
    const nextId = (Math.max(...config.opcoes.map(o => parseInt(o.id)), 0) + 1).toString()
    const optionToAdd = { ...newOption, id: nextId }
    
    setConfig(prev => ({
      ...prev,
      opcoes: [...prev.opcoes, optionToAdd]
    }))
    
    setNewOption({ id: '', label: '', acao: 'mensagem', destino: '' })
    setShowAddForm(false)
  }

  const handleUpdateOption = (id: string, updates: Partial<UraOpcao>) => {
    setConfig(prev => ({
      ...prev,
      opcoes: prev.opcoes.map(opcao => 
        opcao.id === id ? { ...opcao, ...updates } : opcao
      )
    }))
  }

  const handleRemoveOption = (id: string) => {
    setConfig(prev => ({
      ...prev,
      opcoes: prev.opcoes.filter(opcao => opcao.id !== id)
    }))
  }

  const resetConfig = () => {
    setConfig(mockUraConfig)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">phone_in_talk</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Configurações da URA</h3>
            <p className="text-sm text-slate-500">Configure o atendimento automático por telefone</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
          <button
            type="button"
            onClick={resetConfig}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Resetar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600">phone_in_talk</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">URA Ativa</h4>
              <p className="text-sm text-slate-500">Ativar ou desativar o atendimento automático</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.ativa}
              onChange={(e) => setConfig(prev => ({ ...prev, ativa: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 p-6">
        <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">record_voice_over</span>
          Mensagem de Boas-vindas
        </h4>
        <textarea
          value={config.boas_vindas}
          onChange={(e) => setConfig(prev => ({ ...prev, boas_vindas: e.target.value }))}
          rows={3}
          className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3 py-2"
          placeholder="Olá! Bem-vindo ao atendimento automático. Escolha uma opção:"
        />
      </div>

      <div className="bg-white rounded border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">menu</span>
            Opções do Menu
          </h4>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-medium transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Adicionar Opção
          </button>
        </div>

        {showAddForm && (
          <div className="bg-gray-50 rounded border border-gray-200 p-4 mb-6">
            <h5 className="font-medium text-slate-900 mb-4">Nova Opção</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Texto da Opção
                </label>
                <input
                  type="text"
                  value={newOption.label}
                  onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full h-10 rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3"
                  placeholder="Ex: Ver preços"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ação
                </label>
                <select
                  value={newOption.acao}
                  onChange={(e) => setNewOption(prev => ({ ...prev, acao: e.target.value as 'mensagem' | 'transferir' }))}
                  className="w-full h-10 rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3"
                >
                  <option value="mensagem">Enviar mensagem</option>
                  <option value="transferir">Transferir</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {newOption.acao === 'mensagem' ? 'Mensagem' : 'Destino da Transferência'}
                </label>
                <input
                  type="text"
                  value={newOption.destino}
                  onChange={(e) => setNewOption(prev => ({ ...prev, destino: e.target.value }))}
                  className="w-full h-10 rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3"
                  placeholder={newOption.acao === 'mensagem' ? 'Digite a mensagem...' : 'Ex: humano, setor_vendas, etc.'}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddOption}
                disabled={!newOption.label || !newOption.destino}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-medium transition-colors disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {config.opcoes.map((opcao, index) => (
            <div key={opcao.id} className="bg-gray-50 rounded border border-gray-200 p-4">
              {editingOption === opcao.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Texto da Opção
                      </label>
                      <input
                        type="text"
                        value={opcao.label}
                        onChange={(e) => handleUpdateOption(opcao.id, { label: e.target.value })}
                        className="w-full h-10 rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Ação
                      </label>
                      <select
                        value={opcao.acao}
                        onChange={(e) => handleUpdateOption(opcao.id, { acao: e.target.value as 'mensagem' | 'transferir' })}
                        className="w-full h-10 rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3"
                      >
                        <option value="mensagem">Enviar mensagem</option>
                        <option value="transferir">Transferir</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {opcao.acao === 'mensagem' ? 'Mensagem' : 'Destino da Transferência'}
                      </label>
                      <input
                        type="text"
                        value={opcao.destino}
                        onChange={(e) => handleUpdateOption(opcao.id, { destino: e.target.value })}
                        className="w-full h-10 rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingOption(null)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingOption(null)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-medium transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{opcao.label}</p>
                      <p className="text-sm text-slate-500">
                        {opcao.acao === 'mensagem' ? 'Mensagem: ' : 'Transferir para: '}
                        <span className="text-slate-700">{opcao.destino}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingOption(opcao.id)}
                      className="p-2 text-slate-500 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(opcao.id)}
                      className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {config.opcoes.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <span className="material-symbols-outlined text-[48px] mb-2">menu_open</span>
              <p>Nenhuma opção configurada</p>
              <p className="text-sm">Adicione opções ao menu da URA</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 p-6">
        <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">preview</span>
          Preview da URA
        </h4>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
            <span className="material-symbols-outlined text-emerald-400">phone_in_talk</span>
            <span className="text-white font-medium">Atendimento Automático</span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-200 text-sm leading-relaxed">
                {config.boas_vindas}
              </p>
            </div>
            
            {config.opcoes.length > 0 && (
              <div className="space-y-2">
                {config.opcoes.map((opcao, index) => (
                  <div 
                    key={opcao.id}
                    className="flex items-center gap-3 bg-slate-700/30 rounded p-3 hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                    <span className="text-slate-200 text-sm">{opcao.label}</span>
                    {opcao.acao === 'transferir' && (
                      <span className="material-symbols-outlined text-[16px] text-emerald-400 ml-auto">transfer_within_a_station</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {config.opcoes.length === 0 && (
              <div className="text-center py-4 text-slate-500 text-sm">
                Nenhuma opção configurada
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-center gap-2 text-slate-500 text-xs">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Preview visual da URA</span>
          </div>
        </div>
      </div>
    </form>
  )
}
