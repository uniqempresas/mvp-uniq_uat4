import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

interface MainSidebarProps {
    activeContext: string
    onContextChange: (context: string) => void
}

export default function MainSidebar({ activeContext, onContextChange }: MainSidebarProps) {
    const navigate = useNavigate()

    const navItems = [
        { id: 'dashboard', icon: 'fingerprint', label: 'Minha Empresa' },
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
        <aside className="flex w-[70px] flex-col items-center justify-between bg-sidebar-dark py-6 z-30 shrink-0 h-full">
            <div className="flex flex-col items-center gap-8 w-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 cursor-pointer hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">spa</span>
                </div>
                <nav className="flex flex-col items-center gap-6 w-full px-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item)}
                            className={`group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${activeContext === item.id
                                ? 'text-primary bg-primary/10 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <div className="absolute left-12 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:block group-hover:opacity-100 z-50 whitespace-nowrap">
                                {item.label}
                            </div>
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex flex-col items-center gap-6 w-full">
                <button
                    onClick={() => onContextChange('settings')}
                    className={`group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${activeContext === 'settings'
                        ? 'text-primary bg-primary/10 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <span className="material-symbols-outlined">settings</span>
                    <div className="absolute left-12 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:block group-hover:opacity-100 z-50 whitespace-nowrap">
                        Configurações
                    </div>
                </button>
                <div
                    onClick={async () => {
                        if (confirm('Deseja realmente sair?')) {
                            await supabase.auth.signOut()
                            window.location.reload()
                        }
                    }}
                    className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 cursor-pointer hover:border-white/50 transition-colors relative group"
                >
                    <img alt="User profile" className="h-full w-full object-cover" src="/avatar.png" />
                    <div className="absolute left-12 top-0 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:block group-hover:opacity-100 z-50 whitespace-nowrap pointer-events-none">
                        Sair
                    </div>
                </div>
            </div>
        </aside>
    )
}
