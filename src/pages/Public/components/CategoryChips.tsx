import type { Category } from '../../../services/publicService'

interface CategoryChipsProps {
    categories: Category[]
    activeCategory: string | null
    onSelectCategory: (categoryId: string | null) => void
}

export default function CategoryChips({
    categories,
    activeCategory,
    onSelectCategory
}: CategoryChipsProps) {
    return (
        <nav className="flex items-center gap-3 py-6 overflow-x-auto scrollbar-hide">
            <button
                onClick={() => onSelectCategory(null)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm shrink-0 transition-colors
                    ${activeCategory === null
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary text-gray-700 dark:text-gray-200'
                    }
                `}
            >
                <span className="material-symbols-outlined text-lg">grid_view</span>
                Todas
            </button>

            {categories.map(category => {
                const isActive = activeCategory === category.id_categoria
                return (
                    <button
                        key={category.id_categoria}
                        onClick={() => onSelectCategory(category.id_categoria)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shrink-0
                            ${isActive
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary text-gray-700 dark:text-gray-200'
                            }
                        `}
                    >
                        {category.nome_categoria}
                    </button>
                )
            })}
        </nav>
    )
}
