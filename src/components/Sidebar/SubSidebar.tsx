interface SubSidebarProps {
    activeContext: string
}

interface MenuItem {
    icon?: string;
    label?: string;
    active?: boolean;
    href?: string;
    type?: 'divider';
    badge?: string;
}

const MENU_CONFIG: Record<string, { title: string; subtitle: string; items: MenuItem[] }> = {
    dashboard: {
        title: 'Minha Empresa',
        subtitle: 'Visão Geral',
        items: [
            { icon: 'grid_view', label: 'Dashboard Hub', active: true, href: '#' },
            { type: 'divider' },
            { icon: 'person_search', label: 'CRM', href: '#' },
            { icon: 'point_of_sale', label: 'Vendas & PDV', href: '#' },
            { icon: 'attach_money', label: 'Financeiro', href: '#' },
            { icon: 'app_registration', label: 'Cadastros', href: '#' },
        ],
    },
    storefront: {
        title: 'Loja Virtual',
        subtitle: 'E-commerce',
        items: [
            { icon: 'store', label: 'Vitrine', active: true, href: '#' },
            { icon: 'palette', label: 'Aparência', href: '#' },
            { icon: 'local_shipping', label: 'Entregas', href: '#' },
            { icon: 'percent', label: 'Cupons', href: '#' },
        ],
    },
    inventory: {
        title: 'Estoque',
        subtitle: 'Gestão de Produtos',
        items: [
            { icon: 'inventory', label: 'Produtos', active: true, href: '#' },
            { icon: 'category', label: 'Categorias', href: '#' },
            { icon: 'swap_vert', label: 'Movimentações', href: '#' },
            { icon: 'warehouse', label: 'Fornecedores', href: '#' },
        ],
    },
    team: {
        title: 'Equipe',
        subtitle: 'Gestão de Pessoas',
        items: [
            { icon: 'group', label: 'Colaboradores', active: true, href: '#' },
            { icon: 'badge', label: 'Cargos', href: '#' },
            { icon: 'work_history', label: 'Ponto Eletrônico', href: '#' },
        ],
    },
    reports: {
        title: 'Relatórios',
        subtitle: 'Inteligência',
        items: [
            { icon: 'bar_chart', label: 'Vendas', active: true, href: '#' },
            { icon: 'pie_chart', label: 'Financeiro', href: '#' },
            { icon: 'trending_up', label: 'Metas', href: '#' },
        ],
    },
    settings: {
        title: 'Configurações',
        subtitle: 'Sistema',
        items: [
            { icon: 'settings', label: 'Geral', active: true, href: '#' },
            { icon: 'domain', label: 'Empresa', href: '#' },
            { icon: 'lock', label: 'Segurança', href: '#' },
            { icon: 'credit_card', label: 'Faturamento', href: '#' },
        ],
    },
    store: {
        title: 'Loja',
        subtitle: 'Módulos & Adds',
        items: [
            { icon: 'storefront', label: 'Módulo Store', active: true, href: '#' },
            { icon: 'extension', label: 'Integrações', href: '#' },
        ],
    },
}

export default function SubSidebar({ activeContext }: SubSidebarProps) {
    const config = MENU_CONFIG[activeContext] || MENU_CONFIG['dashboard']

    return (
        <aside className="hidden md:flex w-[240px] flex-col border-r border-slate-200 bg-white h-full shrink-0 z-20">
            <div className="flex flex-col h-full p-6">
                <div className="mb-8">
                    <h1 className="text-slate-900 text-lg font-semibold leading-tight whitespace-pre-line">{config.title.replace('&', '\n&')}</h1>
                    <p className="text-primary text-sm font-medium mt-1">{config.subtitle}</p>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    {config.items.map((item, index) => {
                        if (item.type === 'divider') {
                            return <div key={index} className="my-2 h-px bg-slate-100 w-full"></div>
                        }

                        return (
                            <a
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium group ${item.active
                                    ? 'bg-mint-soft text-primary shadow-sm border border-primary/10'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${!item.active ? 'text-slate-400 group-hover:text-slate-600' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        {item.badge}
                                    </span>
                                )}
                            </a>
                        )
                    })}
                </div>
                <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 h-16 w-16 rounded-full bg-white/10 blur-xl"></div>
                        <p className="text-xs font-medium text-white/60 mb-1">Status do Plano</p>
                        <p className="text-sm font-semibold mb-3">UNIQ Pro Enterprise</p>
                        <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
                            <div className="bg-primary h-1.5 rounded-full w-[75%]"></div>
                        </div>
                        <p className="text-[10px] text-white/50 text-right">75% da cota usada</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
