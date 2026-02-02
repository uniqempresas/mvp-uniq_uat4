import { type ReactNode } from 'react'
import StoreHeader from './StoreHeader'
import StoreFooter from './StoreFooter'

interface StoreLayoutProps {
    children: ReactNode
    companyName: string
    logoUrl?: string
    onCartClick: () => void
    showBackButton?: boolean
    backPath?: string
    searchTerm?: string
    onSearchChange?: (term: string) => void
}

export default function StoreLayout({
    children,
    companyName,
    onCartClick,
    searchTerm,
    onSearchChange
}: StoreLayoutProps) {
    // navigate removed as unused

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background-dark font-display text-slate-900 dark:text-gray-100 flex flex-col">
            <StoreHeader
                companyName={companyName}
                onCartClick={onCartClick}
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
            />

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1280px] mx-auto pb-20">
                {children}
            </main>

            <StoreFooter />
        </div>
    )
}
