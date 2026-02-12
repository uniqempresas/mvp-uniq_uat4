
import { useEffect, useState } from 'react';
import { useModules } from '../../contexts/ModuleContext';
import { moduleService, type ModuleCode } from '../../services/moduleService';
import { supabase } from '../../lib/supabase';

// Definição dos módulos disponíveis
const AVAILABLE_MODULES: { code: ModuleCode; name: string; description: string; icon: string; comingSoon?: boolean }[] = [
    {
        code: 'crm',
        name: 'CRM - Gestão de Clientes',
        description: 'Gerencie seu funil de vendas, leads e oportunidades.',
        icon: 'handshake'
    },
    {
        code: 'finance',
        name: 'Financeiro',
        description: 'Controle contas a pagar, receber e fluxo de caixa.',
        icon: 'payments'
    },
    {
        code: 'storefront',
        name: 'Loja Virtual',
        description: 'Sua vitrine online para vendas diretas.',
        icon: 'storefront'
    },
    {
        code: 'inventory',
        name: 'Estoque',
        description: 'Controle de entrada e saída de mercadorias.',
        icon: 'inventory_2',
        comingSoon: true
    },
    {
        code: 'team',
        name: 'Gestão de Equipe',
        description: 'Controle de colaboradores e permissões.',
        icon: 'groups',
        comingSoon: true
    },
    {
        code: 'reports',
        name: 'Relatórios Avançados',
        description: 'Métricas detalhadas para análise de negócio.',
        icon: 'analytics',
        comingSoon: true
    },
];

interface Role {
    id: string;
    nome_cargo: string;
}

export default function ModulesPage() {
    const { isModuleActive, toggleModule, isLoading: isModulesLoading } = useModules();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('company'); // 'company' or role_id
    const [rolePermissions, setRolePermissions] = useState<string[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);

    // Fetch User Role
    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('me_usuario')
                    .select('cargo(nome_cargo)')
                    .eq('id', user.id)
                    .single();

                const cargoObj = Array.isArray(data?.cargo) ? data.cargo[0] : data?.cargo;
                if (cargoObj?.nome_cargo) {
                    setUserRole(cargoObj.nome_cargo.toLowerCase());
                }
            }
        };
        fetchUserRole();
    }, []);

    const isOwner = userRole === 'dono' || userRole === 'admin';

    // Fetch Roles (only if owner)
    useEffect(() => {
        if (isOwner) {
            const fetchRoles = async () => {
                const { data } = await supabase
                    .from('me_cargo')
                    .select('id, nome_cargo')
                    .order('nome_cargo');

                if (data) setRoles(data);
            };
            fetchRoles();
        }
    }, [isOwner]);

    // Fetch Permissions when selected role changes
    useEffect(() => {
        if (selectedRole !== 'company' && isOwner) {
            setLoadingPermissions(true);
            moduleService.getRolePermissions(selectedRole)
                .then(setRolePermissions)
                .catch(console.error)
                .finally(() => setLoadingPermissions(false));
        }
    }, [selectedRole, isOwner]);

    const handleToggle = async (code: string, active: boolean) => {
        try {
            if (selectedRole === 'company') {
                await toggleModule(code, active);
            } else {
                await moduleService.toggleRolePermission(selectedRole, code, active);
                // Update local state
                setRolePermissions(prev =>
                    active ? [...prev, code] : prev.filter(c => c !== code)
                );
            }
        } catch (error) {
            alert('Erro ao alterar módulo. Tente novamente.');
        }
    };

    if (isModulesLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-slate-50 overflow-auto">
            <header className="flex items-center justify-between border-b bg-white px-8 py-4 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Meus Módulos</h1>
                    <p className="text-sm text-slate-500">Ative ou desative funcionalidades conforme sua necessidade</p>
                </div>

                {isOwner && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">Configurar para:</span>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="rounded-lg border-slate-200 text-sm focus:border-primary focus:ring-primary"
                        >
                            <option value="company">Toda a Empresa (Master)</option>
                            <optgroup label="Cargos">
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.nome_cargo}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>
                )}
            </header>

            <main className="p-8">
                {selectedRole !== 'company' && isOwner && (
                    <div className="mb-6 rounded-lg bg-blue-50 p-4 border border-blue-100 text-blue-800 text-sm">
                        <strong className="block mb-1">Configurando Permissões: {roles.find(r => r.id === selectedRole)?.nome_cargo}</strong>
                        Os colaboradores com este cargo só terão acesso aos módulos marcados abaixo, desde que eles também estejam ativos na empresa.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {AVAILABLE_MODULES.map((module) => {
                        // Logic display:
                        // If configuring Company: Show activeModules
                        // If configuring Role: Show rolePermissions
                        // If NOT Owner (Collaborator view): Show activeModules (which are already filtered by service)

                        const isActive = selectedRole === 'company' || !isOwner
                            ? isModuleActive(module.code)
                            : rolePermissions.includes(module.code);

                        const isLoading = selectedRole !== 'company' && loadingPermissions;

                        return (
                            <div
                                key={module.code}
                                className={`relative flex flex-col rounded-xl border p-6 transition-all shadow-sm
                                    ${module.comingSoon ? 'opacity-70 bg-slate-50' : 'bg-white hover:shadow-md'}
                                    ${isActive ? 'border-primary/20 ring-1 ring-primary/20' : 'border-slate-200'}
                                    ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                                `}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg 
                                        ${isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}
                                    `}>
                                        <span className="material-symbols-outlined text-2xl">{module.icon}</span>
                                    </div>

                                    {!module.comingSoon && (
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            {/* Disable input if user is NOT owner (Collaborator view is Read-Only) */}
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={isActive}
                                                disabled={!isOwner}
                                                onChange={(e) => handleToggle(module.code, e.target.checked)}
                                            />
                                            <div className={`peer h-6 w-11 rounded-full bg-slate-200 
                                                after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] 
                                                ${!isOwner ? 'opacity-60 cursor-not-allowed' : ''}
                                                peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30`}></div>
                                        </label>
                                    )}
                                </div>

                                <h3 className="mb-2 text-lg font-semibold text-slate-900">{module.name}</h3>
                                <p className="text-sm text-slate-500 mb-4 flex-grow">{module.description}</p>

                                {module.comingSoon && (
                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                            Em breve
                                        </span>
                                    </div>
                                )}

                                {isActive && !module.comingSoon && (
                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                            {selectedRole === 'company' || !isOwner ? 'Ativo' : 'Permitido'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
