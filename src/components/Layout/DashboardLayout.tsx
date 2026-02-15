import { useState, type ReactNode } from 'react'
import MainSidebar from '../Sidebar/MainSidebar'
import SubSidebar from '../Sidebar/SubSidebar'
import MobileHeader from '../Mobile/MobileHeader'
import MobileDrawer from '../Mobile/MobileDrawer'
import { useBreakpoint } from '../../hooks/useBreakpoint'

interface DashboardLayoutProps {
    children: ReactNode
    activeContext: string
    setActiveContext: (context: string) => void
    onNavigate?: (view: string) => void
}

export default function DashboardLayout({
    children,
    activeContext,
    setActiveContext,
    onNavigate
}: DashboardLayoutProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const { isMobile } = useBreakpoint()

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light text-slate-800 antialiased selection:bg-primary/20 selection:text-primary">

            {/* Mobile Header (apenas mobile) */}
            {isMobile && <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />}

            {/* Mobile Drawer (apenas mobile) */}
            {isMobile && (
                <MobileDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    activeContext={activeContext}
                    onContextChange={setActiveContext}
                    onNavigate={onNavigate}
                />
            )}

            {/* Desktop Sidebars (apenas desktop) */}
            {!isMobile && (
                <>
                    <MainSidebar
                        activeContext={activeContext}
                        onContextChange={(ctx) => {
                            setActiveContext(ctx)
                            if (onNavigate) {
                                onNavigate('home')
                            }
                        }}
                    />

                    <SubSidebar
                        activeContext={activeContext}
                        onNavigate={onNavigate}
                    />
                </>
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto pt-16 md:pt-0">
                {children}
            </main>
        </div>
    )
}
