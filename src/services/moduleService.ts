import { supabase } from '../lib/supabase'

export type ModuleCode = 'crm' | 'storefront' | 'inventory' | 'team' | 'finance' | 'settings' | 'reports';

export interface ModuleConfig {
    id: string;
    user_id: string;
    module_code: string; // Usando string para flexibilidade compatível com DB
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export const moduleService = {
    async getActiveModules(): Promise<string[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Get user's company and role
        const { data: userData, error: userError } = await supabase
            .from('me_usuario')
            .select('empresa_id, cargo(id, nome_cargo)')
            .eq('id', user.id)
            .single();

        if (userError || !userData?.empresa_id) {
            console.error('Error fetching user data:', userError);
            return [];
        }

        // 1. Get Company's Active Modules (Master Switch)
        const { data: companyModules, error: companyError } = await supabase
            .from('me_modulo_ativo')
            .select('modulo_codigo')
            .eq('empresa_id', userData.empresa_id)
            .eq('ativo', true);

        if (companyError) throw companyError;

        const activeCompanyModuleCodes = companyModules.map((row: any) => row.modulo_codigo);

        // 2. Check if user is Owner (Dono)
        const cargoObj = Array.isArray(userData.cargo) ? userData.cargo[0] : userData.cargo;
        const cargoName = cargoObj?.nome_cargo?.toLowerCase();

        const isOwner = cargoName === 'dono' || cargoName === 'admin';

        if (isOwner) {
            return activeCompanyModuleCodes;
        }

        // 3. If Collaborator, check Role Permissions
        const userCargoId = cargoObj?.id;

        if (!userCargoId) return []; // No role, no access (or default?)

        const { data: roleModules, error: roleError } = await supabase
            .from('me_modulo_cargo')
            .select('modulo_codigo')
            .eq('empresa_id', userData.empresa_id)
            .eq('cargo_id', userCargoId)
            .eq('ativo', true);

        if (roleError) throw roleError;

        const allowedRoleModuleCodes = roleModules.map((row: any) => row.modulo_codigo);

        // Intersection: Module must be Active in Company AND Allowed for Role
        return activeCompanyModuleCodes.filter(code => allowedRoleModuleCodes.includes(code));
    },

    async toggleModule(moduleCode: string, isActive: boolean): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data: userData } = await supabase
            .from('me_usuario')
            .select('empresa_id')
            .eq('id', user.id)
            .single();

        if (!userData?.empresa_id) throw new Error('User has no company');

        // Toggle Company Module (Master Switch)
        const { error } = await supabase
            .from('me_modulo_ativo')
            .upsert({
                empresa_id: userData.empresa_id,
                modulo_codigo: moduleCode,
                ativo: isActive,
                updated_at: new Date().toISOString()
            }, { onConflict: 'empresa_id, modulo_codigo' });

        if (error) throw error;
    },

    // --- Permission Management ---

    async getRolePermissions(cargoId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('me_modulo_cargo')
            .select('modulo_codigo')
            .eq('cargo_id', cargoId)
            .eq('ativo', true);

        if (error) throw error;
        return data.map((row: any) => row.modulo_codigo);
    },

    async toggleRolePermission(cargoId: string, moduleCode: string, isActive: boolean): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data: userData } = await supabase
            .from('me_usuario')
            .select('empresa_id')
            .eq('id', user.id)
            .single();

        if (!userData?.empresa_id) throw new Error('User has no company');

        const { error } = await supabase
            .from('me_modulo_cargo')
            .upsert({
                empresa_id: userData.empresa_id,
                cargo_id: cargoId,
                modulo_codigo: moduleCode,
                ativo: isActive,
                updated_at: new Date().toISOString()
            }, { onConflict: 'empresa_id, cargo_id, modulo_codigo' });

        if (error) throw error;
    },

    // Sincroniza estado inicial se necessário (opcional)
    async ensureDefaults(defaultModules: string[]) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get user's company
        const { data: userData } = await supabase
            .from('me_usuario')
            .select('empresa_id')
            .eq('id', user.id)
            .single();

        if (!userData?.empresa_id) return;

        // Verifica se já tem módulos configurados
        const { count } = await supabase
            .from('me_modulo_ativo')
            .select('*', { count: 'exact', head: true })
            .eq('empresa_id', userData.empresa_id);

        if (count && count > 0) return;

        // Se não tiver, insere defaults
        const inserts = defaultModules.map(code => ({
            empresa_id: userData.empresa_id,
            modulo_codigo: code,
            ativo: true
        }));

        await supabase
            .from('me_modulo_ativo')
            .upsert(inserts, { onConflict: 'empresa_id, modulo_codigo' });
    }
}
