import { useState, useEffect, useRef } from 'react'
import { CANAIS_CONFIG, type CanalType } from '../../../types/crm-chat'

interface CanalFilterProps {
  selectedCanais: CanalType[]
  onChange: (canais: CanalType[]) => void
}

export function CanalFilter({ selectedCanais, onChange }: CanalFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const canaisAtivos = Object.values(CANAIS_CONFIG).filter(c => c.ativo)
  
  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  const toggleCanal = (canal: CanalType) => {
    if (selectedCanais.includes(canal)) {
      onChange(selectedCanais.filter(c => c !== canal))
    } else {
      onChange([...selectedCanais, canal])
    }
  }
  
  const getCanalIcon = (icone: string): string => {
    const iconMap: Record<string, string> = {
      'MessageCircle': 'chat_bubble',
      'Mail': 'mail',
      'MessageSquare': 'chat',
      'Instagram': 'photo_camera',
      'Facebook': 'facebook',
      'Send': 'send'
    }
    return iconMap[icone] || 'chat'
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
          selectedCanais.length > 0 
            ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">filter_list</span>
        <span>Canais</span>
        {selectedCanais.length > 0 && (
          <span className="bg-emerald-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
            {selectedCanais.length}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 max-h-60 overflow-y-auto bg-white rounded shadow-lg border border-gray-100 p-2 z-50">
          <div className="text-xs font-semibold text-gray-500 px-2 py-1.5 uppercase tracking-wider sticky top-0 bg-white">
            Filtrar por canal
          </div>
          {canaisAtivos.map((canal) => (
            <button
              key={canal.id}
              onClick={() => toggleCanal(canal.id)}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded text-sm transition-colors ${
                selectedCanais.includes(canal.id)
                  ? 'bg-gray-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center material-symbols-outlined text-white text-[14px] shrink-0"
                style={{ 
                  background: canal.gradient || canal.cor,
                  boxShadow: `0 1px 2px ${canal.cor}40`
                }}
              >
                {getCanalIcon(canal.icone)}
              </div>
              <span className="flex-1 text-left text-gray-700">{canal.nome}</span>
              {selectedCanais.includes(canal.id) && (
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">check</span>
              )}
            </button>
          ))}
          {selectedCanais.length > 0 && (
            <>
              <div className="border-t border-gray-100 my-2 sticky bottom-0 bg-white" />
              <button
                onClick={() => onChange([])}
                className="w-full text-left px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors sticky bottom-0 bg-white"
              >
                Limpar filtros
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Badge compacto para mostrar canais selecionados
export function CanalFilterBadge({ canais, onClear }: { canais: CanalType[], onClear: () => void }) {
  if (canais.length === 0) return null
  
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded">
      <span className="text-xs text-emerald-700 font-medium">
        {canais.length} canal{canais.length > 1 ? 'is' : ''}
      </span>
      <button 
        onClick={onClear}
        className="p-0.5 hover:bg-emerald-100 rounded transition-colors"
      >
        <span className="material-symbols-outlined text-[14px] text-emerald-600">close</span>
      </button>
    </div>
  )
}
