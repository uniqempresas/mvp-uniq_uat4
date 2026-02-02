export interface Category {
    id: string
    nome_categoria: string
}

interface CategoryTabsProps {
    categories: Category[]
    activeCategory: string | null
    onSelectCategory: (categoryId: string | null) => void
    productCounts: Record<string, number>
}

export default function CategoryTabs({
    categories,
    activeCategory,
    onSelectCategory,
    productCounts
}: CategoryTabsProps) {
    const allCount = Object.values(productCounts).reduce((sum, count) => sum + count, 0)

    return (
        <div className="sticky top-[73px] z-20 bg-white border-b border-gray-100 shadow-sm">
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 px-4 py-3 min-w-max">
                    {/* Tab "Todas" */}
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={`
                            relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                            transition-all duration-300 flex items-center gap-2
                            ${activeCategory === null
                                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30'
                                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                            }
                        `}
                    >
                        <span className="relative z-10">Todas</span>
                        <span className={`
                            relative z-10 px-1.5 py-0.5 rounded-full text-xs font-bold
                            ${activeCategory === null
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-500'
                            }
                        `}>
                            {allCount}
                        </span>
                    </button>

                    {/* Tabs de Categorias */}
                    {categories.map(category => {
                        const count = productCounts[category.id] || 0
                        const isActive = activeCategory === category.id

                        return (
                            <button
                                key={category.id}
                                onClick={() => onSelectCategory(category.id)}
                                className={`
                                    relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                                    transition-all duration-300 flex items-center gap-2
                                    ${isActive
                                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30'
                                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                                    }
                                `}
                            >
                                <span className="relative z-10">{category.nome_categoria}</span>
                                <span className={`
                                    relative z-10 px-1.5 py-0.5 rounded-full text-xs font-bold
                                    ${isActive
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-100 text-gray-500'
                                    }
                                `}>
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
