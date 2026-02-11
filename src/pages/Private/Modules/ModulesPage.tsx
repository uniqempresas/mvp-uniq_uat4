import React from 'react';
import { useModules } from '../../../contexts/ModuleContext';
import { type ModuleCode } from '../../../services/moduleService';
import MainSidebar from '../../../components/Sidebar/MainSidebar';

interface ModuleCardProps {
    title: string;
    description: string;
    icon: string;
    isActive: boolean;
    isCore?: boolean;
    onToggle: (active: boolean) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon, isActive, isCore, onToggle }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${isActive ? 'border-primary/50' : 'border-gray-200 dark:border-gray-700'} p-6 transition-all hover:shadow-md`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                {!isCore && (
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isActive}
                            onChange={(e) => onToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                )}
                {isCore && (
                    <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded">Essencial</span>
                )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    );
};

export default function ModulesPage() {
    const { isModuleActive, toggleModule, isLoading } = useModules();

    const modules = [
        {
            code: 'crm' as ModuleCode,
            title: 'CRM e Vendas',
            description: 'Gestão de pipeline, oportunidades, funil de vendas e acompanhamento de clientes.',
            icon: 'point_of_sale',
            isCore: false
        },
        {
            code: 'storefront' as ModuleCode,
            title: 'Loja Virtual',
            description: 'Seu catálogo online público para receber pedidos via WhatsApp.',
            icon: 'storefront',
            isCore: false
        },
        {
            code: 'inventory' as ModuleCode,
            title: 'Controle de Estoque',
            description: 'Gestão de produtos, movimentações e alerta de estoque baixo.',
            icon: 'inventory_2',
            isCore: false
        },
        {
            code: 'finance' as ModuleCode,
            title: 'Financeiro',
            description: 'Contas a pagar, receber, fluxo de caixa e DRE gerencial.',
            icon: 'attach_money',
            isCore: true
        },
        {
            code: 'team' as ModuleCode,
            title: 'Equipe e Acessos',
            description: 'Gerencie colaboradores e suas permissões de acesso.',
            icon: 'group',
            isCore: false
        },
        {
            code: 'reports' as ModuleCode,
            title: 'Relatórios Avançados',
            description: 'Análises detalhadas e insights para tomada de decisão.',
            icon: 'analytics',
            isCore: false
        }
    ];

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Carregando módulos...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-background-dark">
            <MainSidebar activeContext="modules" onContextChange={() => { }} />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Meus Módulos</h1>
                        <p className="text-gray-500 dark:text-gray-400">Ative ou desative funcionalidades conforme a necessidade do seu negócio.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map(mod => (
                            <ModuleCard
                                key={mod.code}
                                {...mod}
                                isActive={isModuleActive(mod.code)}
                                onToggle={(active) => toggleModule(mod.code, active)}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
