import { Outlet, Link } from 'react-router-dom'
import { useState } from 'react'
import MainSidebar from '../../components/Sidebar/MainSidebar'
import MobileHeader from '../../components/Mobile/MobileHeader'
import MobileDrawer from '../../components/Mobile/MobileDrawer'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export default function SalesLayout() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const { isMobile } = useBreakpoint()

    const handleContextChange = (context: string) => {
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
                    activeContext="sales"
                    onNavigate={undefined}
                />
            )}

            {/* Desktop Main Sidebar */}
            <MainSidebar activeContext="sales" onContextChange={handleContextChange} />
            
            {/* Context Sidebar - Simplificado para Vendas */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex z-10">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Módulo</h2>
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined">point_of_sale</span>
                        </div>
                        <div>
                            <h1 className="text-gray-900 font-bold leading-tight">Vendas</h1>
                            <p className="text-primary text-xs font-medium">PDV & Caixa</p>
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
                        to="/sales"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-colors group"
                    >
                        <span className="material-symbols-outlined text-[20px] fill-1">point_of_sale</span>
                        <span className="text-sm font-medium">Nova Venda</span>
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
