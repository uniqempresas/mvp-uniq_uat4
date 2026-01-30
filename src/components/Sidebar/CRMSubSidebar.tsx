interface CRMSubSidebarProps {
    activeView: string
    onNavigate: (view: string) => void
}

export default function CRMSubSidebar({ activeView, onNavigate }: CRMSubSidebarProps) {
    const menuItems = [
        { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
        { id: 'clients', icon: 'group', label: 'Clientes' },
        { id: 'opportunities', icon: 'target', label: 'Oportunidades' },
        { id: 'activities', icon: 'check_circle', label: 'Atividades' },
        { id: 'attendances', icon: 'call', label: 'Atendimentos' },
        { id: 'chat', icon: 'chat', label: 'Chat' },
        { id: 'settings', icon: 'settings', label: 'Configurações' }
    ]

    return (
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-lg text-slate-800">CRM</h2>
                <p className="text-xs text-gray-500 mt-0.5">Gestão de Relacionamento</p>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-2">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`
              w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors
              ${activeView === item.id
                                ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
            `}
                    >
                        <span className="material-symbols-outlined text-xl">
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer Info */}
            <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
                <p>Módulo CRM v1.0</p>
            </div>
        </aside>
    )
}
