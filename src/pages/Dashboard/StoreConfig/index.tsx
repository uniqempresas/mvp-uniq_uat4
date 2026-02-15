import { useState, useEffect } from 'react'
import GeneralTab from './GeneralTab'
import { ProductsTab } from './ProductsTab'
import AppearanceTab from './components/AppearanceTab'
import BannerManager from './components/BannerManager'
import { Link } from 'react-router-dom'
import { storeService } from '../../../services/storeService'
import DashboardLayout from '../../../components/Layout/DashboardLayout'

export default function StoreConfig() {
    const [activeTab, setActiveTab] = useState('general')
    const [storeConfig, setStoreConfig] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeContext] = useState('storefront') //  Força contexto storefront para exibir submenu

    // Carregar store_config
    const loadStoreConfig = async () => {
        try {
            const config = await storeService.getStoreConfig()
            setStoreConfig(config)
        } catch (error) {
            console.error('Error loading store config:', error)
        } finally {
            setLoading(false)
        }
    }

    // Carregar ao montar
    useEffect(() => {
        loadStoreConfig()
    }, [])

    // Sincronizar activeTab quando clicar no submenu
    const handleNavigate = (view: string) => {
        setActiveTab(view)
    }

    return (
        <DashboardLayout
            activeContext={activeContext}
            setActiveContext={() => { }} // StoreConfig sempre usa contexto 'storefront'
            onNavigate={handleNavigate}
        >
            <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-32 bg-gray-50 dark:bg-background-dark min-h-screen">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-secondary dark:text-white tracking-tight">Configurações de Perfil</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie as informações públicas e operacionais da sua empresa no marketplace.</p>
                        </div>
                        <div className="flex gap-3">
                            {/* Link para loja pública - construído dinamicamente com slug */}
                            <Link to={storeConfig?.slug ? `/c/${storeConfig.slug}` : '/'} target="_blank" className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                                Ver perfil público
                            </Link>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
                        <nav className="-mb-px flex gap-8 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'general'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                    }`}
                            >
                                Informações Básicas
                            </button>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'products'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                    }`}
                            >
                                Produtos & Vitrine
                            </button>
                            <button
                                onClick={() => setActiveTab('branding')}
                                disabled
                                className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-400 cursor-not-allowed opacity-60"
                                title="Em breve"
                            >
                                Branding <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1 rounded ml-1">Em breve</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('appearance')}
                                className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'appearance'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                    }`}
                            >
                                Aparência
                            </button>
                            <button
                                onClick={() => setActiveTab('banners')}
                                className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'banners'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                    }`}
                            >
                                Banners & Hero
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    {activeTab === 'general' && <GeneralTab />}
                    {activeTab === 'products' && <ProductsTab />}
                    {activeTab === 'appearance' && !loading && (
                        <AppearanceTab storeConfig={storeConfig} onUpdate={loadStoreConfig} />
                    )}
                    {activeTab === 'banners' && !loading && (
                        <BannerManager storeConfig={storeConfig} onUpdate={loadStoreConfig} />
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
