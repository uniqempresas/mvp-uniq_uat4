import { useState, useEffect } from 'react'
import { useCRMChatConfig } from '../../../hooks/crm/useCRMChatConfig'
import { CRMURASettings } from './CRMURASettings'

const DIAS_SEMANA = [
  { id: 'seg', label: 'Seg' },
  { id: 'ter', label: 'Ter' },
  { id: 'qua', label: 'Qua' },
  { id: 'qui', label: 'Qui' },
  { id: 'sex', label: 'Sex' },
  { id: 'sab', label: 'Sáb' },
  { id: 'dom', label: 'Dom' }
] as const

export function CRMAgentSettings() {
  const { config, isLoading, updateConfig } = useCRMChatConfig()
  const [formData, setFormData] = useState({
    agente_nome: '',
    mensagem_boas_vindas: '',
    mensagem_ausencia: '',
    horario_dias: [] as Array<'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom'>,
    horario_inicio: '08:00',
    horario_fim: '18:00',
    tempo_resposta_minutos: 5,
    agente_ativo: true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (config) {
      setFormData({
        agente_nome: config.agente_nome,
        mensagem_boas_vindas: config.mensagem_boas_vindas,
        mensagem_ausencia: config.mensagem_ausencia,
        horario_dias: config.horario_funcionamento.dias,
        horario_inicio: config.horario_funcionamento.inicio,
        horario_fim: config.horario_funcionamento.fim,
        tempo_resposta_minutos: config.tempo_resposta_minutos,
        agente_ativo: config.agente_ativo
      })
    }
  }, [config])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      await updateConfig({
        agente_nome: formData.agente_nome,
        mensagem_boas_vindas: formData.mensagem_boas_vindas,
        mensagem_ausencia: formData.mensagem_ausencia,
        horario_funcionamento: {
          dias: formData.horario_dias,
          inicio: formData.horario_inicio,
          fim: formData.horario_fim
        },
        tempo_resposta_minutos: formData.tempo_resposta_minutos,
        agente_ativo: formData.agente_ativo
      })
      setSaveMessage('Configurações salvas com sucesso!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleDia = (diaId: 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom') => {
    setFormData(prev => ({
      ...prev,
      horario_dias: prev.horario_dias.includes(diaId)
        ? prev.horario_dias.filter(d => d !== diaId)
        : [...prev.horario_dias, diaId]
    }))
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        Carregando configurações...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Configurações do Agente</h3>
            <p className="text-sm text-slate-500">Personalize o comportamento do seu assistente virtual</p>
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
            onClick={() => config && setFormData({
              agente_nome: config.agente_nome,
              mensagem_boas_vindas: config.mensagem_boas_vindas,
              mensagem_ausencia: config.mensagem_ausencia,
              horario_dias: config.horario_funcionamento.dias,
              horario_inicio: config.horario_funcionamento.inicio,
              horario_fim: config.horario_funcionamento.fim,
              tempo_resposta_minutos: config.tempo_resposta_minutos,
              agente_ativo: config.agente_ativo
            })}
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

      {/* Ativar/Desativar Agente */}
      <div className="bg-white rounded border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600">smart_toy</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Agente Virtual</h4>
              <p className="text-sm text-slate-500">Ativar ou desativar o assistente automático</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agente_ativo}
              onChange={(e) => setFormData(prev => ({ ...prev, agente_ativo: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Nome e Avatar */}
      <div className="bg-white rounded border border-gray-200 p-6">
        <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">chat</span>
          Identidade do Agente
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome do Agente
            </label>
            <input
              type="text"
              value={formData.agente_nome}
              onChange={(e) => setFormData(prev => ({ ...prev, agente_nome: e.target.value }))}
              className="w-full h-10 rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3"
              placeholder="Ex: Assistente UNIQ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">smart_toy</span>
              </div>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-slate-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">upload</span>
                Alterar avatar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="bg-white rounded border border-gray-200 p-6">
        <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">chat</span>
          Mensagens Automáticas
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mensagem de Boas-vindas
            </label>
            <textarea
              value={formData.mensagem_boas_vindas}
              onChange={(e) => setFormData(prev => ({ ...prev, mensagem_boas_vindas: e.target.value }))}
              rows={3}
              className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3 py-2"
              placeholder="Olá! Como posso ajudar?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mensagem de Fora de Expediente
            </label>
            <textarea
              value={formData.mensagem_ausencia}
              onChange={(e) => setFormData(prev => ({ ...prev, mensagem_ausencia: e.target.value }))}
              rows={3}
              className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3 py-2"
              placeholder="Nosso horário de atendimento é..."
            />
          </div>
        </div>
      </div>

      {/* Horário de Funcionamento */}
      <div className="bg-white rounded border border-gray-200 p-6">
        <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
          Horário de Funcionamento
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Dias da Semana
            </label>
            <div className="flex flex-wrap gap-2">
              {DIAS_SEMANA.map((dia) => (
                <button
                  key={dia.id}
                  type="button"
                  onClick={() => toggleDia(dia.id)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    formData.horario_dias.includes(dia.id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
                >
                  {dia.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Horário de Início
              </label>
              <input
                type="time"
                value={formData.horario_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, horario_inicio: e.target.value }))}
                className="w-full h-10 rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Horário de Término
              </label>
              <input
                type="time"
                value={formData.horario_fim}
                onChange={(e) => setFormData(prev => ({ ...prev, horario_fim: e.target.value }))}
                className="w-full h-10 rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tempo de Resposta */}
      <div className="bg-white rounded border border-gray-200 p-6">
        <h4 className="font-medium text-slate-900 mb-4">Tempo de Resposta Esperado</h4>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="60"
            value={formData.tempo_resposta_minutos}
            onChange={(e) => setFormData(prev => ({ ...prev, tempo_resposta_minutos: parseInt(e.target.value) }))}
            className="flex-1 h-2 bg-gray-200 rounded appearance-none cursor-pointer accent-primary"
          />
          <span className="text-sm font-medium text-slate-700 w-24">
            {formData.tempo_resposta_minutos} min
          </span>
        </div>
      </div>

      {/* URA Settings */}
      <CRMURASettings />
    </form>
  )
}
