import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../contexts/CartContext'
import type { HierarchicalCategory } from '../../../services/publicService'

interface StoreHeaderProps {
    companyName: string
    logoUrl?: string
    onCartClick: () => void
    searchTerm?: string
    onSearchChange?: (term: string) => void
    categories?: HierarchicalCategory[]
    onSelectCategory?: (categoryId: string) => void
}

export default function StoreHeader({
    companyName,
    logoUrl,
    onCartClick,
    searchTerm = '',
    onSearchChange,
    categories,
    onSelectCategory
}: StoreHeaderProps) {
    const navigate = useNavigate()
    const { itemCount } = useCart()
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const initial = companyName.charAt(0).toUpperCase()

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-background-dark/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
                {/* Logo do Parceiro */}
                <div
                    className="flex items-center gap-3 shrink-0 cursor-pointer group"
                    onClick={() => navigate(0)}
                    title={companyName}
                >
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={`Logo ${companyName}`}
                            className="h-10 w-10 rounded-lg object-cover ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-primary/30 transition-all"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:shadow-primary/20 transition-all">
                            {initial}
                        </div>
                    )}
                    <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white max-w-[180px] truncate hidden sm:block">
                        {companyName}
                    </h1>
                </div>

                {/* Search Bar Desktop */}
                <div className="flex-1 max-w-xl hidden md:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">search</span>
                        </div>
                        <input
                            className="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary/40 text-sm font-medium transition-all outline-none"
                            placeholder="Buscar produtos..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                        <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>

                    <button
                        onClick={onCartClick}
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative"
                    >
                        <span className="material-symbols-outlined">shopping_cart</span>
                        {itemCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 size-5 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-white dark:ring-background-dark">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors hidden sm:flex">
                        <span className="material-symbols-outlined">favorite</span>
                    </button>

                    <div className="h-7 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

                    <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95">
                        <span className="material-symbols-outlined text-lg">person</span>
                        <span className="hidden sm:inline">Entrar</span>
                    </button>
                </div>
            </div>

            {/* Categories Nav — Desktop */}
            {categories && categories.length > 0 && (
                <nav className="hidden md:block border-t border-gray-50 dark:border-gray-800/50 bg-white/60 dark:bg-background-dark/60">
                    <div className="max-w-[1280px] mx-auto px-6">
                        <ul className="flex items-center gap-0.5 h-11">
                            {categories.map(cat => (
                                <li
                                    key={String(cat.id_categoria)}
                                    className="relative"
                                    onMouseEnter={() => setHoveredCategory(String(cat.id_categoria))}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                >
                                    <button
                                        onClick={() => onSelectCategory?.(String(cat.id_categoria))}
                                        className="px-4 py-2.5 text-[13px] font-semibold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        {cat.nome_categoria}
                                        {cat.subcategories.length > 0 && (
                                            <span className="material-symbols-outlined text-xs opacity-50">expand_more</span>
                                        )}
                                    </button>

                                    {/* Dropdown subcategorias */}
                                    {cat.subcategories.length > 0 && hoveredCategory === String(cat.id_categoria) && (
                                        <div className="absolute top-full left-0 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-3 min-w-[200px] z-50">
                                            <ul className="space-y-0.5">
                                                {cat.subcategories.map(sub => (
                                                    <li key={String(sub.id_categoria)}>
                                                        <button
                                                            onClick={() => {
                                                                onSelectCategory?.(String(sub.id_categoria))
                                                                setHoveredCategory(null)
                                                            }}
                                                            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                        >
                                                            {sub.nome_categoria}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            )}

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 max-h-[70vh] overflow-y-auto">
                    {/* Mobile Search */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input
                                className="w-full h-10 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                placeholder="Buscar produtos..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Mobile Categories */}
                    {categories && categories.length > 0 && (
                        <div className="p-4 space-y-1">
                            {categories.map(cat => (
                                <div key={String(cat.id_categoria)}>
                                    <button
                                        onClick={() => {
                                            onSelectCategory?.(String(cat.id_categoria))
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                    >
                                        {cat.nome_categoria}
                                    </button>
                                    {cat.subcategories.length > 0 && (
                                        <div className="pl-6 space-y-0.5">
                                            {cat.subcategories.map(sub => (
                                                <button
                                                    key={String(sub.id_categoria)}
                                                    onClick={() => {
                                                        onSelectCategory?.(String(sub.id_categoria))
                                                        setIsMobileMenuOpen(false)
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                                >
                                                    {sub.nome_categoria}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}
