import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MENU_CONFIG, type MenuItem } from '../../config/submenus'

interface SubSidebarProps {
    activeContext: string
    onNavigate?: (view: string) => void
}

export default function SubSidebar({ activeContext, onNavigate }: SubSidebarProps) {
    const config = MENU_CONFIG[activeContext] || MENU_CONFIG['dashboard']
    const [expandedItems, setExpandedItems] = useState<string[]>([])

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    const handleClick = (e: React.MouseEvent, item: MenuItem) => {
        if (item.children && item.id) {
            toggleExpand(item.id, e)
        } else if (item.view && onNavigate) {
            e.preventDefault()
            e.stopPropagation() // Ensure no bubbling issues
            console.log('Navigating to:', item.view)
            onNavigate(item.view)
        }
    }

    const renderMenuItem = (item: MenuItem, index: number) => {
        if (item.type === 'divider') {
            return <div key={`divider-${index}`} className="my-2 h-px bg-slate-100 w-full"></div>
        }

        const isExpanded = item.id && expandedItems.includes(item.id)
        const hasChildren = item.children && item.children.length > 0

        return (
            <div key={`item-${index}`}>
                <button
                    onClick={(e) => handleClick(e, item)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium group select-none cursor-pointer text-left ${item.active
                        ? 'bg-mint-soft text-primary shadow-sm border border-primary/10'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                >
                    <span className={`material-symbols-outlined text-[20px] ${!item.active ? 'text-slate-400 group-hover:text-slate-600' : ''}`}>
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
                                    className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer text-left"
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
