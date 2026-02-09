import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface MobileDrawerProps {
    isOpen: boolean
    onClose: () => void
    activeContext?: string
    onContextChange?: (context: string) => void
    onNavigate?: (view: string) => void
}

export default function MobileDrawer({ isOpen, onClose, activeContext = 'dashboard', onContextChange, onNavigate }: MobileDrawerProps) {
    const navigate = useNavigate()
    const [expandedItem, setExpandedItem] = useState<string | null>(null)

    const navItems = [
        {
            id: 'dashboard',
            icon: 'fingerprint',
            label: 'Minha Empresa',
            route: '/dashboard',
            submenu: [
                { id: 'products', icon: 'package_2', label: 'Produtos', view: 'products' },
                { id: 'services', icon: 'handyman', label: 'Serviços', view: 'services' },
                { id: 'clients', icon: 'group', label: 'Clientes', view: 'clients' },
                { id: 'suppliers', icon: 'warehouse', label: 'Fornecedores', view: 'suppliers' },
                { id: 'collaborators', icon: 'badge', label: 'Colaboradores', view: 'collaborators' }
            ]
        },
        { id: 'crm', icon: 'groups', label: 'CRM', route: '/crm' },
        { id: 'storefront', icon: 'storefront', label: 'Loja' },
        { id: 'finance', icon: 'attach_money', label: 'Financeiro', route: '/finance' },
        { id: 'inventory', icon: 'inventory_2', label: 'Estoque' },
        { id: 'store', icon: 'extension', label: 'Store' },
        { id: 'team', icon: 'group', label: 'Equipe' },
        { id: 'reports', icon: 'bar_chart', label: 'Relatórios' },
    ]

    const handleNavClick = (item: typeof navItems[0]) => {
        // Se o item tem submenu, expande/colapsa
        if (item.submenu) {
            setExpandedItem(expandedItem === item.id ? null : item.id)
            return
        }

        // Caso contrário, navega normalmente
        if (item.route) {
            navigate(item.route)
        }
        if (onContextChange) {
            onContextChange(item.id)
        }
        onClose()
    }

    const handleSubmenuClick = (parentRoute: string | undefined, view: string) => {
        // Navega para a rota pai se existir
        if (parentRoute) {
            navigate(parentRoute)
        }

        // Chama onNavigate para mudar a view no Dashboard
        if (onNavigate) {
            onNavigate(view)
        }

        onClose()
    }

    const handleLogout = async () => {
        if (confirm('Deseja realmente sair?')) {
            await supabase.auth.signOut()
            window.location.reload()
        }
    }

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <aside
                className={`fixed top-0 left-0 h-full w-[280px] bg-sidebar-dark z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full py-6 px-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-2xl">spa</span>
                        </div>
                        <span className="text-white font-semibold text-lg">UNIQ</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <div key={item.id}>
                                {/* Main Item */}
                                <button
                                    onClick={() => handleNavClick(item)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full ${activeContext === item.id
                                        ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                                    {item.submenu && (
                                        <span className={`material-symbols-outlined text-sm transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    )}
                                </button>

                                {/* Submenu (Accordion) */}
                                {item.submenu && expandedItem === item.id && (
                                    <div className="ml-6 mt-1 flex flex-col gap-1">
                                        {item.submenu.map((subitem) => (
                                            <button
                                                key={subitem.id}
                                                onClick={() => handleSubmenuClick(item.route, subitem.view)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">{subitem.icon}</span>
                                                <span>{subitem.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Footer - Settings & Logout */}
                    <div className="flex flex-col gap-2 pt-6 border-t border-white/10">
                        <button
                            onClick={() => {
                                if (onContextChange) onContextChange('settings')
                                onClose()
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeContext === 'settings'
                                ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm font-medium">Configurações</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm font-medium">Sair</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
