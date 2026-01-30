import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface MainSidebarProps {
    activeContext: string
    onContextChange: (context: string) => void
}

export default function MainSidebar({ activeContext, onContextChange }: MainSidebarProps) {
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false)

    const navItems = [
        { id: 'dashboard', icon: 'fingerprint', label: 'Minha Empresa' },
        { id: 'crm', icon: 'groups', label: 'CRM', route: '/crm' },
        { id: 'storefront', icon: 'storefront', label: 'Loja' },
        { id: 'finance', icon: 'attach_money', label: 'Financeiro', route: '/finance' },
        { id: 'inventory', icon: 'inventory_2', label: 'Estoque' },
        { id: 'store', icon: 'extension', label: 'Store' },
        { id: 'team', icon: 'group', label: 'Equipe' },
        { id: 'reports', icon: 'bar_chart', label: 'Relatórios' },
    ]

    const handleNavClick = (item: typeof navItems[0]) => {
        if (item.route) {
            navigate(item.route)
        }
        onContextChange(item.id)
    }

    return (
        <aside
            className={`flex flex-col items-center justify-between bg-sidebar-dark py-6 z-30 shrink-0 h-full transition-all duration-300 ${isHovered ? 'w-48' : 'w-[70px]'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col items-center gap-8 w-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 cursor-pointer hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">spa</span>
                </div>
                <nav className="flex flex-col items-center gap-6 w-full px-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item)}
                            className={`group relative flex h-10 items-center rounded-lg transition-all ${isHovered ? 'w-full px-3 gap-3 justify-start' : 'w-10 justify-center'
                                } ${activeContext === item.id
                                    ? 'text-primary bg-primary/10 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined shrink-0">{item.icon}</span>
                            {isHovered && (
                                <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                    {item.label}
                                </span>
                            )}
                            {!isHovered && (
                                <div className="absolute left-12 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:block group-hover:opacity-100 z-50 whitespace-nowrap pointer-events-none">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex flex-col items-center gap-6 w-full px-2">
                <button
                    onClick={() => onContextChange('settings')}
                    className={`group relative flex h-10 items-center rounded-lg transition-all ${isHovered ? 'w-full px-3 gap-3 justify-start' : 'w-10 justify-center'
                        } ${activeContext === 'settings'
                            ? 'text-primary bg-primary/10 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <span className="material-symbols-outlined shrink-0">settings</span>
                    {isHovered && (
                        <span className="text-sm whitespace-nowrap">Configurações</span>
                    )}
                    {!isHovered && (
                        <div className="absolute left-12 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:block group-hover:opacity-100 z-50 whitespace-nowrap pointer-events-none">
                            Configurações
                        </div>
                    )}
                </button>
                <div
                    onClick={async () => {
                        if (confirm('Deseja realmente sair?')) {
                            await supabase.auth.signOut()
                            window.location.reload()
                        }
                    }}
                    className={`overflow-hidden rounded-full border-2 border-white/20 cursor-pointer hover:border-white/50 transition-all relative group ${isHovered ? 'h-10 w-full' : 'h-10 w-10'
                        }`}
                >
                    {isHovered ? (
                        <div className="flex items-center gap-3 h-full px-3">
                            <img alt="User" className="h-8 w-8 rounded-full object-cover" src="/avatar.png" />
                            <span className="text-sm text-white whitespace-nowrap">Sair</span>
                        </div>
                    ) : (
                        <>
                            <img alt="User profile" className="h-full w-full object-cover" src="/avatar.png" />
                            <div className="absolute left-12 top-0 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:block group-hover:opacity-100 z-50 whitespace-nowrap pointer-events-none">
                                Sair
                            </div>
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}
