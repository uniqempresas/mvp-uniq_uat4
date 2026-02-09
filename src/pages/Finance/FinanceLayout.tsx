import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import MainSidebar from '../../components/Sidebar/MainSidebar'
import MobileHeader from '../../components/Mobile/MobileHeader'
import MobileDrawer from '../../components/Mobile/MobileDrawer'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export default function FinanceLayout() {
    const location = useLocation()
    const isPayable = location.pathname.includes('payable')
    const isReceivable = location.pathname.includes('receivable')
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const { isMobile } = useBreakpoint()

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
                    activeContext="finance"
                    onNavigate={undefined}
                />
            )}

            {/* Desktop Main Sidebar */}
            <MainSidebar activeContext="finance" onContextChange={handleContextChange} />
            {/* Context Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex z-10">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Módulo</h2>
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                            <span className="material-symbols-outlined">account_balance</span>
                        </div>
                        <div>
                            <h1 className="text-gray-900 font-bold leading-tight">Financeiro</h1>
                            <p className="text-primary text-xs font-medium">Fluxo de Caixa</p>
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
                        to="/finance"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${!isPayable && !isReceivable ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${!isPayable && !isReceivable ? 'fill-1' : 'text-gray-400 group-hover:text-gray-600'}`}>dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                        <span className="material-symbols-outlined text-[16px] ml-auto opacity-0 group-hover:opacity-100 text-gray-400">chevron_right</span>
                    </Link>

                    <Link
                        to="/finance/payable"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isPayable ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isPayable ? 'fill-1' : 'text-gray-400 group-hover:text-gray-600'}`}>payments</span>
                        <span className="text-sm font-medium">Contas a Pagar</span>
                        {/* Badge could be added here */}
                        <span className="material-symbols-outlined text-[16px] ml-auto opacity-0 group-hover:opacity-100 text-gray-400">chevron_right</span>
                    </Link>

                    <Link
                        to="/finance/receivable"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isReceivable ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isReceivable ? 'fill-1' : 'text-gray-400 group-hover:text-gray-600'}`}>request_quote</span>
                        <span className="text-sm font-medium">Contas a Receber</span>
                        <span className="material-symbols-outlined text-[16px] ml-auto opacity-0 group-hover:opacity-100 text-gray-400">chevron_right</span>
                    </Link>

                    <div className="my-2 border-t border-gray-100"></div>

                    <Link
                        to="/finance/accounts"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${location.pathname.includes('accounts') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${location.pathname.includes('accounts') ? 'fill-1' : 'text-gray-400 group-hover:text-gray-600'}`}>account_balance_wallet</span>
                        <span className="text-sm font-medium">Contas</span>
                        <span className="material-symbols-outlined text-[16px] ml-auto opacity-0 group-hover:opacity-100 text-gray-400">chevron_right</span>
                    </Link>

                    <Link
                        to="/finance/categories"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${location.pathname.includes('categories') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${location.pathname.includes('categories') ? 'fill-1' : 'text-gray-400 group-hover:text-gray-600'}`}>category</span>
                        <span className="text-sm font-medium">Categorias</span>
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
