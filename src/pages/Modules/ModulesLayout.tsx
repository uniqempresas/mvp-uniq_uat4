import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import MainSidebar from '../../components/Sidebar/MainSidebar'
import MobileHeader from '../../components/Mobile/MobileHeader'
import MobileDrawer from '../../components/Mobile/MobileDrawer'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export default function ModulesLayout() {
    const location = useLocation()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const { isMobile } = useBreakpoint()

    // Determine active tab based on pathname
    const isNew = location.pathname.includes('/new')
    const isDev = location.pathname.includes('/dev')
    const isChosen = !isNew && !isDev && location.pathname.includes('/modules')

    const handleContextChange = (context: string) => {
        // Handle navigation to other modules if needed
        console.log('Context change:', context)
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Header (apenas mobile) */}
            {isMobile && <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />}

            {/* Mobile Drawer (apenas mobile) */}
            {isMobile && (
                <MobileDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    activeContext="modules"
                    onNavigate={undefined}
                />
            )}

            {/* Desktop Main Sidebar */}
            <MainSidebar activeContext="modules" onContextChange={handleContextChange} />
            {/* Context Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex z-10">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Loja</h2>
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                            <span className="material-symbols-outlined">extension</span>
                        </div>
                        <div>
                            <h1 className="text-gray-900 font-bold leading-tight">Módulos</h1>
                            <p className="text-primary text-xs font-medium">Gestão & Contratação</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px] text-gray-400">arrow_back</span>
                        <span className="text-sm font-medium">Voltar ao Dashboard</span>
                    </Link>

                    <div className="my-2 border-t border-gray-100"></div>

                    <Link
                        to="/modules"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isChosen ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isChosen ? 'fill-1' : 'text-gray-400 group-hover:text-gray-600'}`}>check_circle</span>
                        <span className="text-sm font-medium">Módulos Escolhidos</span>
                        <span className="material-symbols-outlined text-[16px] ml-auto opacity-0 group-hover:opacity-100 text-gray-400">chevron_right</span>
                    </Link>

                    <Link
                        to="/modules/new"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isNew ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isNew ? 'fill-1' : 'text-gray-400 group-hover:text-gray-600'}`}>add_shopping_cart</span>
                        <span className="text-sm font-medium">Novos Módulos</span>
                        <span className="material-symbols-outlined text-[16px] ml-auto opacity-0 group-hover:opacity-100 text-gray-400">chevron_right</span>
                    </Link>

                    <Link
                        to="/modules/dev"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isDev ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isDev ? 'fill-1' : 'text-gray-400 group-hover:text-gray-600'}`}>construction</span>
                        <span className="text-sm font-medium">Em Desenvolvimento</span>
                        <span className="material-symbols-outlined text-[16px] ml-auto opacity-0 group-hover:opacity-100 text-gray-400">chevron_right</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-16 md:pt-0">
                <Outlet />
            </main>
        </div>
    )
}
