import type { CanalType } from '../../../types/crm-chat'
import { getCanalConfig } from '../../../lib/canais'

// Mapeamento de ícones do Material Symbols
const ICONES_MATERIAL: Record<string, string> = {
  'MessageCircle': 'chat_bubble',
  'Mail': 'mail',
  'MessageSquare': 'chat',
  'Instagram': 'photo_camera',
  'Facebook': 'facebook',
  'Send': 'send'
}

interface CRMChatCanalBadgeProps {
  canal: CanalType
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function CRMChatCanalBadge({ canal, size = 'md', showLabel = false }: CRMChatCanalBadgeProps) {
  const config = getCanalConfig(canal)
  const iconName = ICONES_MATERIAL[config.icone] || 'chat_bubble'
  
  const sizeClasses = {
    sm: 'w-5 h-5 text-[14px]',
    md: 'w-6 h-6 text-[16px]',
    lg: 'w-8 h-8 text-[20px]'
  }

  return (
    <div className="flex items-center gap-2" title={config.nome}>
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center material-symbols-outlined text-white`}
        style={{
          background: config.gradient || config.cor,
          boxShadow: `0 2px 4px ${config.cor}40`
        }}
      >
        {iconName}
      </div>
      
      {showLabel && (
        <span className="text-sm font-medium text-slate-700">
          {config.nome}
        </span>
      )}
    </div>
  )
}

// Versão minimalista apenas com ícone
export function CRMChatCanalIcon({ canal, size = 'md' }: { canal: CanalType; size?: 'sm' | 'md' | 'lg' }) {
  const config = getCanalConfig(canal)
  const iconName = ICONES_MATERIAL[config.icone] || 'chat_bubble'
  
  const iconSizes = {
    sm: 'text-[14px]',
    md: 'text-[18px]',
    lg: 'text-[22px]'
  }

  return (
    <span
      className={`material-symbols-outlined ${iconSizes[size]}`}
      style={{ color: config.cor }}
      title={config.nome}
    >
      {iconName}
    </span>
  )
}

// Badge com texto para listas
export function CRMChatCanalLabel({ canal }: { canal: CanalType }) {
  const config = getCanalConfig(canal)
  
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{
        backgroundColor: config.cor + '15',
        color: config.cor
      }}
    >
      {config.nome}
    </span>
  )
}
