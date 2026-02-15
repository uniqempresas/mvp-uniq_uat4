import { type ReactNode } from 'react'
import StoreHeader from './StoreHeader'
import StoreFooter from './StoreFooter'
import type { HierarchicalCategory, Category, StoreConfig } from '../../../services/publicService'

interface StoreLayoutProps {
    children: ReactNode
    companyName: string
    logoUrl?: string
    telefone?: string
    email?: string
    onCartClick: () => void
    showBackButton?: boolean
    backPath?: string
    searchTerm?: string
    onSearchChange?: (term: string) => void
    categories?: HierarchicalCategory[]
    flatCategories?: Category[]
    onSelectCategory?: (categoryId: string) => void
    appearance?: StoreConfig['appearance']
}

export default function StoreLayout({
    children,
    companyName,
    logoUrl,
    telefone,
    email,
    onCartClick,
    searchTerm,
    onSearchChange,
    categories,
    flatCategories,
    onSelectCategory,
    appearance
}: StoreLayoutProps) {
    // Injetar tema customizado via CSS Variables
    const themeStyles: Record<string, string> = {}
    if (appearance?.theme) {
        const theme = appearance.theme
        if (theme.primary_color) {
            themeStyles['--primary-color'] = theme.primary_color
            const hoverColor = adjustBrightness(theme.primary_color, -10)
            themeStyles['--primary-hover-color'] = hoverColor
        }
        if (theme.secondary_color) {
            themeStyles['--secondary-color'] = theme.secondary_color
        }
        if (theme.font_family) {
            themeStyles['--font-family'] = theme.font_family
        }
        if (theme.border_radius) {
            themeStyles['--border-radius'] = theme.border_radius
        }
    }

    return (
        <div
            className="min-h-screen bg-gray-50 dark:bg-background-dark font-display text-slate-900 dark:text-gray-100 flex flex-col"
            style={themeStyles}
        >
            <StoreHeader
                companyName={companyName}
                logoUrl={logoUrl}
                onCartClick={onCartClick}
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                categories={categories}
                onSelectCategory={onSelectCategory}
            />

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1280px] mx-auto pb-20">
                {children}
            </main>

            <StoreFooter
                companyName={companyName}
                logoUrl={logoUrl}
                telefone={telefone}
                email={email}
                categories={flatCategories}
            />
        </div>
    )
}

function adjustBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1).toUpperCase()
}
