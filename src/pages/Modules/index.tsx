import React from 'react'
import { MAIN_NAV_ITEMS } from '../../config/menu'
import { useModules } from '../../contexts/ModuleContext'
import ModuleCard from '../../components/Cards/ModuleCard'

export default function ModulesPage() {
    const { isModuleActive, toggleModule } = useModules()

    // Filtrar apenas itens que são módulos (tem moduleCode)
    const modules = MAIN_NAV_ITEMS.filter(item => item.moduleCode)

    return (
        <div className="flex-1 overflow-auto bg-slate-900 text-white p-6 sm:p-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Meus Módulos</h1>
                    <p className="text-white/60">
                        Gerencie as funcionalidades ativas na sua área de trabalho.
                        Desative módulos que você não utiliza para simplificar sua navegação.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules.map(module => (
                        <ModuleCard
                            key={module.id}
                            label={module.label}
                            icon={module.icon}
                            isActive={isModuleActive(module.moduleCode!)}
                            onToggle={() => toggleModule(module.moduleCode!, !isModuleActive(module.moduleCode!))}
                            description={getModuleDescription(module.moduleCode!)}
                        />
                    ))}
                </div>

                {modules.length === 0 && (
                    <div className="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <span className="material-symbols-outlined text-4xl mb-4 block">info</span>
                        <p>Nenhum módulo configurável encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function getModuleDescription(code: string): string {
    switch (code) {
        case 'crm': return 'Gestão de relacionamento com clientes e oportunidades.'
        case 'storefront': return 'Personalize sua vitrine online e catálogo digital.'
        case 'finance': return 'Controle de fluxo de caixa, contas a pagar e receber.'
        case 'inventory': return 'Gestão de estoque, entradas e saídas de produtos.'
        case 'team': return 'Gerencie colaboradores, permissões e acessos.'
        case 'reports': return 'Dashboards e relatórios analíticos do negócio.'
        default: return 'Funcionalidade adicional do sistema.'
    }
}
