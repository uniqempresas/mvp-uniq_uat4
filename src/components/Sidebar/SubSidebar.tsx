import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MENU_CONFIG, type MenuItem } from '../../config/submenus'
import { storeService } from '../../services/storeService'

interface SubSidebarProps {
    activeContext: string
    onNavigate?: (view: string) => void
}

export default function SubSidebar({ activeContext, onNavigate }: SubSidebarProps) {
    const config = MENU_CONFIG[activeContext] || MENU_CONFIG['dashboard']
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [companySlug, setCompanySlug] = useState<string>('')
    const location = useLocation()

    useEffect(() => {
        storeService.getStoreConfig().then(config => {
            if (config?.slug) setCompanySlug(config.slug)
        })
    }, [])

    const resolveHref = (href: string | undefined) => {
        if (!href) return '#'
        return href.replace(':slug', companySlug || '')
    }

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    const handleClick = (e: React.MouseEvent, item: MenuItem) => {
        if (item.disabled) {
            e.preventDefault()
            e.stopPropagation()
            return
        }
        // G5: Se tem href com template e target _blank, abrir em nova aba
        if (item.target === '_blank' && item.href) {
            e.preventDefault()
            const resolved = resolveHref(item.href)
            if (resolved !== '#') window.open(resolved, '_blank')
            return
        }
        if (item.children && item.id) {
            toggleExpand(item.id, e)
        } else if (item.view && onNavigate) {
            e.preventDefault()
            e.stopPropagation()
            onNavigate(item.view)
        }
    }

    const isItemActive = (item: MenuItem): boolean => {
        if (!item.href) return false
        
        const currentPath = location.pathname
        const itemPath = item.href
        
        // Para o caso especial de /attendant que deve corresponder apenas ao exato ou ter filhos
        if (itemPath === '/attendant') {
            return currentPath === '/attendant' || currentPath === '/attendant/'
        }
        
        // Para outros casos, verifica se o caminho atual começa com o href do item
        // ou é exatamente igual
        return currentPath === itemPath || currentPath.startsWith(itemPath + '/')
    }

    const renderMenuItem = (item: MenuItem, index: number) => {
        if (item.type === 'divider') {
            return <div key={`divider-${index}`} className="my-2 h-px bg-slate-100 w-full"></div>
        }

        const isExpanded = item.id && expandedItems.includes(item.id)
        const hasChildren = item.children && item.children.length > 0
        const hasHref = item.href && item.href !== '#'
        const isActive = isItemActive(item)

        // Se tem href e não tem children, usar Link
        if (hasHref && !hasChildren && item.href) {
            return (
                <div key={`item-${index}`}>
                    <Link
                        to={item.href}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium group select-none ${item.disabled
                            ? 'text-slate-400 cursor-not-allowed opacity-60'
                            : isActive
                                ? 'bg-mint-soft text-primary shadow-sm border border-primary/10'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${!isActive ? 'text-slate-400 group-hover:text-slate-600' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-sm flex-1">{item.label}</span>
                        {item.badge && (
                            <span className="ml-auto bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                                {item.badge}
                            </span>
                        )}
                    </Link>
                </div>
            )
        }

        return (
            <div key={`item-${index}`}>
                <button
                    onClick={(e) => handleClick(e, item)}
                    disabled={item.disabled}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium group select-none ${item.disabled
                        ? 'text-slate-400 cursor-not-allowed opacity-60'
                        : isActive
                            ? 'bg-mint-soft text-primary shadow-sm border border-primary/10'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
                        }`}
                >
                    <span className={`material-symbols-outlined text-[20px] ${!isActive ? 'text-slate-400 group-hover:text-slate-600' : ''}`}>
                        {item.icon}
                    </span>
                    <span className="text-sm flex-1">{item.label}</span>
                    {item.badge && (
                        <span className="ml-auto bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {item.badge}
                        </span>
                    )}
                    {hasChildren && (
                        <span className={`material-symbols-outlined text-sm text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    )}
                </button>

                {/* Submenu Items */}
                {hasChildren && isExpanded && (
                    <div className="flex flex-col gap-1 mt-1 pl-4 border-l border-slate-100 ml-5">
                        {item.children?.map((subItem, subIndex) => {
                            if (subItem.href) {
                                return (
                                    <Link
                                        key={`sub-${index}-${subIndex}`}
                                        to={subItem.href}
                                        className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                                    >
                                        {subItem.icon && (
                                            <span className="material-symbols-outlined text-[18px] text-slate-400">
                                                {subItem.icon}
                                            </span>
                                        )}
                                        <span>{subItem.label}</span>
                                    </Link>
                                )
                            }

                            return (
                                <button
                                    key={`sub-${index}-${subIndex}`}
                                    onClick={(e) => handleClick(e, subItem)}
                                    disabled={subItem.disabled}
                                    className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left ${subItem.disabled
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer'
                                        }`}
                                >
                                    {subItem.icon && (
                                        <span className="material-symbols-outlined text-[18px] text-slate-400">
                                            {subItem.icon}
                                        </span>
                                    )}
                                    <span>{subItem.label}</span>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }

    return (
        <aside className="hidden md:flex w-[240px] flex-col border-r border-slate-200 bg-white h-full shrink-0 z-20">
            <div className="flex flex-col h-full p-6">
                <div className="mb-8">
                    <h1 className="text-slate-900 text-lg font-semibold leading-tight whitespace-pre-line">{config.title.replace('&', '\n&')}</h1>
                    <p className="text-primary text-sm font-medium mt-1">{config.subtitle}</p>
                </div>
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {config.items.map((item, index) => renderMenuItem(item, index))}
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
