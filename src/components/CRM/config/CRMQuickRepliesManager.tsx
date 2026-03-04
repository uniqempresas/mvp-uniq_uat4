import { useState } from 'react'
import { useQuickReplies } from '../../../hooks/crm/useQuickReplies'

const CATEGORIAS = [
  { id: 'geral', nome: 'Geral', cor: '#6B7280' },
  { id: 'suporte', nome: 'Suporte', cor: '#3B82F6' },
  { id: 'vendas', nome: 'Vendas', cor: '#10B981' },
  { id: 'comercial', nome: 'Comercial', cor: '#F59E0B' },
  { id: 'financeiro', nome: 'Financeiro', cor: '#EF4444' }
]

export function CRMQuickRepliesManager() {
  const { replies, isLoading, createReply, updateReply, deleteReply } = useQuickReplies()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    atalho: '',
    categoria: 'geral',
    cor_tag: '#6B7280',
    ativo: true,
    ordem: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        await updateReply(editingId, formData)
        setEditingId(null)
      } else {
        await createReply(formData)
        setIsAdding(false)
      }
      
      setFormData({ titulo: '', conteudo: '', atalho: '', categoria: 'geral', cor_tag: '#6B7280', ativo: true, ordem: 0 })
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
  }

  const handleEdit = (reply: typeof replies[0]) => {
    setFormData({
      titulo: reply.titulo,
      conteudo: reply.conteudo,
      atalho: reply.atalho || '',
      categoria: reply.categoria,
      cor_tag: reply.cor_tag,
      ativo: reply.ativo,
      ordem: reply.ordem
    })
    setEditingId(reply.id)
    setIsAdding(true)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ titulo: '', conteudo: '', atalho: '', categoria: 'geral', cor_tag: '#6B7280', ativo: true, ordem: 0 })
  }

  const filteredReplies = replies.filter(reply =>
    reply.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reply.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reply.atalho && reply.atalho.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        Carregando respostas rápidas...
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
        <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">bolt</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Respostas Rápidas</h3>
            <p className="text-sm text-slate-500">Crie atalhos para mensagens frequentes</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nova Resposta
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input
          type="text"
          placeholder="Buscar respostas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded border-gray-300 focus:border-primary focus:ring-primary/20"
        />
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded p-6 mb-6">
          <h4 className="font-medium text-slate-900 mb-4">
            {editingId ? 'Editar Resposta' : 'Nova Resposta'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full h-10 rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3"
                placeholder="Ex: Saudação inicial"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Atalho (opcional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">/</span>
                <input
                  type="text"
                  value={formData.atalho}
                  onChange={(e) => setFormData(prev => ({ ...prev, atalho: e.target.value.replace('/', '') }))}
                  className="w-full h-10 pl-6 pr-3 rounded border-gray-300 focus:border-primary focus:ring-primary/20"
                  placeholder="saudacao"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Conteúdo</label>
            <textarea
              value={formData.conteudo}
              onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
              rows={3}
              className="w-full rounded border-gray-300 focus:border-primary focus:ring-primary/20 px-3 py-2"
              placeholder="Digite a mensagem..."
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, categoria: cat.id }))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.categoria === cat.id
                      ? 'ring-2 ring-offset-1'
                      : 'hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: formData.categoria === cat.id ? cat.cor + '20' : 'transparent',
                    color: cat.cor,
                    '--tw-ring-color': cat.cor
                  } as React.CSSProperties}
                >
                  {cat.nome}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded font-medium"
            >
              {editingId ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-2">
        {filteredReplies.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {searchTerm ? 'Nenhuma resposta encontrada' : 'Nenhuma resposta cadastrada'}
          </div>
        ) : (
          filteredReplies.map((reply) => {
            const categoria = CATEGORIAS.find(c => c.id === reply.categoria) || CATEGORIAS[0]
            
            return (
              <div
                key={reply.id}
                className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded hover:border-primary/30 transition-colors group"
              >
                <div className="mt-1 text-slate-300">
                  <span className="material-symbols-outlined">drag_indicator</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900">{reply.titulo}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: categoria.cor + '20',
                        color: categoria.cor
                      }}
                    >
                      {categoria.nome}
                    </span>
                    {reply.atalho && (
                      <span className="text-xs text-slate-400 font-mono">
                        /{reply.atalho}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{reply.conteudo}</p>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    onClick={() => handleEdit(reply)}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => deleteReply(reply.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
