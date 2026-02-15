import { useState, useEffect } from 'react'
import ModuleDetails from './ModuleDetails'
import ModuleCheckout from './ModuleCheckout'
import { moduleService } from '../../../services/moduleService'
import type { Module, CompanyModule } from '../../../services/moduleService'

export default function ModuleStore() {
    // Current View State: 'list' | 'details' | 'checkout'
    const [view, setView] = useState<'list' | 'details' | 'checkout'>('list')
    const [selectedModule, setSelectedModule] = useState<Module | null>(null)

    // Data State
    const [modules, setModules] = useState<Module[]>([])
    const [myModules, setMyModules] = useState<CompanyModule[]>([])
    const [loading, setLoading] = useState(true)
    const [empresaId, setEmpresaId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState('Disponíveis')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [allModules, empId] = await Promise.all([
                moduleService.getAllModules(),
                moduleService.getCurrentCompanyId()
            ])
            setModules(allModules)
            setEmpresaId(empId)

            if (empId) {
                const owned = await moduleService.getCompanyModules(empId)
                setMyModules(owned)
            }
        } catch (error) {
            console.error('Erro ao carregar modulos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleModuleSelect = (module: Module) => {
        setSelectedModule(module)
        setView('details')
    }

    const isModuleActive = (moduleId: string) => {
        return myModules.some(m => m.modulo_id === moduleId && m.status === 'active')
    }

    const handlePurchaseSuccess = async () => {
        // Reload data to reflect new purchase
        if (empresaId) {
            const owned = await moduleService.getCompanyModules(empresaId)
            setMyModules(owned)
        }
        setView('details')
        // Optional: Show success toast
    }

    // Filter modules based on tab
    const filteredModules = modules.filter(m => {
        const isActive = isModuleActive(m.id)

        if (activeTab === 'Meus Módulos') return isActive
        if (activeTab === 'Disponíveis') return !isActive && m.status !== 'dev'
        if (activeTab === 'Em Breve') return m.status === 'dev'

        return true
    })

    if (view === 'checkout' && selectedModule) {
        return <ModuleCheckout
            onBack={() => setView('details')}
            onConfirm={async () => {
                if (empresaId && selectedModule) {
                    try {
                        await moduleService.subscribeToModule(empresaId, selectedModule.id)
                        await handlePurchaseSuccess()
                    } catch (e) {
                        console.error("Erro ao comprar", e)
                        alert("Erro ao processar compra")
                    }
                }
            }}
            moduleName={selectedModule.nome}
            price={selectedModule.preco_mensal.toString().replace('.', ',')}
        />
    }

    if (view === 'details' && selectedModule) {
        return <ModuleDetails
            onBack={() => {
                setView('list')
                setSelectedModule(null)
            }}
            onCheckout={() => setView('checkout')}
            onDeactivate={async () => {
                if (empresaId && selectedModule) {
                    try {
                        await moduleService.unsubscribeFromModule(empresaId, selectedModule.id)
                        await handlePurchaseSuccess() // Reloads data
                    } catch (e) {
                        console.error("Erro ao cancelar", e)
                        alert("Erro ao cancelar assinatura")
                    }
                }
            }}
            module={selectedModule}
            isOwned={isModuleActive(selectedModule.id)}
        />
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F3F4F6]">
            {/* Top Header */}
            <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
                <div>
                    <nav className="text-sm mb-1 text-slate-400 flex items-center gap-2">
                        <span>Configurações</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-slate-600 font-medium">Loja de Módulos</span>
                    </nav>
                    <h1 className="text-xl font-bold text-slate-800">Módulo Store</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative w-64">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                        <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 text-slate-700 placeholder:text-slate-400 transition-shadow outline-none" placeholder="Buscar módulos..." type="text" />
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <button className="relative p-2 text-slate-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>
            </header>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">
                    {/* Hero / Banner */}
                    <div className="bg-gradient-to-r from-secondary to-[#1b3a47] rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-2xl font-bold mb-2">Potencialize seu negócio com novos recursos</h2>
                            <p className="text-slate-200 mb-6 font-light">Ative módulos adicionais conforme sua empresa cresce. Alguns recursos podem alterar o valor da sua mensalidade.</p>
                            <button className="bg-white text-secondary px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors shadow-sm inline-flex items-center gap-2">
                                Ver planos
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                        {/* Abstract decoration */}
                        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 0%, transparent 70%)' }}></div>
                        <span className="material-symbols-outlined absolute -right-6 -bottom-12 text-[200px] text-white opacity-5 rotate-12 select-none">store</span>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['Meus Módulos', 'Disponíveis', 'Em Breve'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm whitespace-nowrap border transition-colors ${activeTab === tab ? 'bg-primary text-white border-primary shadow-primary/20' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-100'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Modules Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <span className="material-symbols-outlined animate-spin text-4xl text-slate-300">progress_activity</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredModules.map(module => {
                                const isActive = isModuleActive(module.id)
                                return (
                                    <div
                                        key={module.id}
                                        onClick={() => handleModuleSelect(module)}
                                        className="bg-white rounded-[12px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col h-full group cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                <span className="material-symbols-outlined text-3xl">{module.icone || 'extension'}</span>
                                            </div>
                                            {isActive ? (
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Ativo</span>
                                            ) : (
                                                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Inativo</span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">{module.nome}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                            {module.descricao}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-xs text-slate-400 font-medium">
                                                {isActive ? `Versão ${module.versao}` : `R$ ${module.preco_mensal.toString().replace('.', ',')}/mês`}
                                            </span>
                                            <button className={`px-4 py-2 rounded-[12px] text-sm font-semibold transition-colors shadow-sm ${isActive ? 'bg-secondary text-white hover:bg-[#1a3a47] shadow-secondary/20' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'}`}>
                                                {isActive ? 'Gerenciar' : 'Ativar'}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
