import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GeneralTab } from './GeneralTab'
import { ProductsTab } from './ProductsTab'
import { storeService } from '../../../services/storeService'
import MainSidebar from '../../../components/Sidebar/MainSidebar'
import MobileHeader from '../../../components/Mobile/MobileHeader'
import MobileDrawer from '../../../components/Mobile/MobileDrawer'
import { useBreakpoint } from '../../../hooks/useBreakpoint'

export default function StoreConfig() {
    const [activeTab, setActiveTab] = useState<'general' | 'products'>('general')
    const [storeSlug, setStoreSlug] = useState<string>('')
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const { isMobile } = useBreakpoint()
    const navigate = useNavigate()

    useEffect(() => {
        storeService.getStoreConfig().then(data => {
            if (data?.slug) setStoreSlug(data.slug)
        })
    }, [])

    const handleContextChange = (context: string) => {
        if (context === 'dashboard') navigate('/dashboard')
        if (context === 'crm') navigate('/crm')
        if (context === 'finance') navigate('/finance')
        // storefront is active
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Header */}
            {isMobile && <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />}

            {/* Mobile Drawer */}
            {isMobile && (
                <MobileDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    activeContext="storefront"
                    onContextChange={handleContextChange}
                    onNavigate={() => { }}
                />
            )}

            {/* Desktop Sidebar */}
            <MainSidebar activeContext="storefront" onContextChange={handleContextChange} />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative pt-16 md:pt-0">
                <main className="flex-1 overflow-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="md:flex md:items-center md:justify-between mb-8">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Loja Virtual (Vitrine)
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Configure a aparência e os produtos da sua loja online.
                                </p>
                            </div>
                            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                                {storeSlug && (
                                    <a
                                        href={`/c/${storeSlug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Visualizar Loja
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('general')}
                                    className={`${activeTab === 'general'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150`}
                                >
                                    Configurações Gerais
                                </button>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className={`${activeTab === 'products'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150`}
                                >
                                    Produtos na Vitrine
                                </button>
                            </nav>
                        </div>

                        <div className="mt-6">
                            {activeTab === 'general' ? <GeneralTab /> : <ProductsTab />}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
