import { useState, useEffect, useRef } from 'react'
import { useQuickReplies } from '../../../hooks/crm/useQuickReplies'

interface QuickReplySelectorProps {
  onSelect: (text: string) => void
  inputText: string
}

export function QuickReplySelector({ onSelect, inputText }: QuickReplySelectorProps) {
  const { replies, isLoading } = useQuickReplies()
  const [isOpen, setIsOpen] = useState(false)
  const [filteredReplies, setFilteredReplies] = useState(replies)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Detectar atalho "/" no input
  useEffect(() => {
    const lastWord = inputText.split(' ').pop() || ''
    if (lastWord.startsWith('/')) {
      const searchTerm = lastWord.slice(1).toLowerCase()
      const filtered = replies.filter(r => 
        r.ativo && (
          r.atalho?.toLowerCase().includes(searchTerm) ||
          r.titulo.toLowerCase().includes(searchTerm)
        )
      )
      setFilteredReplies(filtered)
      setIsOpen(filtered.length > 0 && searchTerm.length >= 0)
    } else {
      setIsOpen(false)
    }
  }, [inputText, replies])
  
  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleSelect = (reply: typeof replies[0]) => {
    onSelect(reply.conteudo)
    setIsOpen(false)
  }
  
  const handleQuickReplyButtonClick = () => {
    setFilteredReplies(replies.filter(r => r.ativo))
    setIsOpen(!isOpen)
  }
  
  const getCategoryColor = (categoria: string): string => {
    const colors: Record<string, string> = {
      'geral': '#6B7280',
      'suporte': '#3B82F6',
      'vendas': '#10B981',
      'comercial': '#F59E0B',
      'financeiro': '#EF4444'
    }
    return colors[categoria] || '#6B7280'
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleQuickReplyButtonClick}
        disabled={isLoading}
        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        title="Respostas rápidas"
      >
        <span className="material-symbols-outlined">bolt</span>
      </button>
      
      {isOpen && (
        <>
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded shadow-xl border border-gray-100 overflow-hidden z-50">
            <div className="p-3 border-b border-gray-50 bg-gray-50/50">
              <div className="text-sm font-semibold text-gray-800">Respostas Rápidas</div>
              <div className="text-xs text-gray-500">Digite "/" para buscar por atalho</div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {filteredReplies.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  Nenhuma resposta encontrada
                </div>
              ) : (
                filteredReplies.map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleSelect(reply)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-800 truncate">{reply.titulo}</span>
                      <span 
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: getCategoryColor(reply.categoria) + '20',
                          color: getCategoryColor(reply.categoria)
                        }}
                      >
                        {reply.categoria}
                      </span>
                      {reply.atalho && (
                        <span className="text-xs text-gray-400 font-mono">/{reply.atalho}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{reply.conteudo}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
