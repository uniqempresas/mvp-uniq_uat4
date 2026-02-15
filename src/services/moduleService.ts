import { supabase } from '../lib/supabase'

export type ModuleCode = 'crm' | 'storefront' | 'inventory' | 'team' | 'finance' | 'settings' | 'reports' | 'dashboard' | 'modules';

export interface Module {
    id: string;
    nome: string;
    descricao: string | null;
    preco_mensal: number;
    preco_anual: number;
    categoria: string | null;
    imagem_url: string | null;
    icone: string | null;
    funcionalidades: any;
    versao: string;
    status: string;
    codigo?: string;
}

export interface CompanyModule {
    id: string;
    empresa_id: string;
    modulo_id: string;
    status: string;
    data_contratacao?: string;
}

export interface ModuleConfig {
    id: string;
    empresa_id: string;
    modulo_id: string;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
}

export const moduleService = {
    async getActiveModules(): Promise<string[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.warn('getActiveModules: No user session found');
            return [];
        }

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

        // 1. Get Company's Active Modules from NEW table
        const { data: companyModules, error: companyError } = await supabase
            .from('unq_empresa_modulos')
            .select('unq_modulos_sistema(codigo)')
            .eq('empresa_id', userData.empresa_id)
            .eq('status', 'active');

        if (companyError) {
            console.error('Error fetching company modules:', companyError);
            return [];
        }

        // Flatten the relationship result to get array of codes
        const activeCompanyModuleCodes = companyModules
            .map((row: any) => row.unq_modulos_sistema?.codigo)
            .filter(Boolean);

        // 2. Check if user is Owner (Dono)
        const cargoObj = Array.isArray(userData.cargo) ? userData.cargo[0] : userData.cargo;
        const cargoName = cargoObj?.nome_cargo?.toLowerCase();

        const isOwner = cargoName === 'dono' || cargoName === 'admin' || cargoName === 'proprietario' || cargoName === 'proprietário';

        if (isOwner) {
            return activeCompanyModuleCodes;
        }

        // 3. If Collaborator, check Role Permissions
        // Important: me_modulo_cargo still uses strings for codes. 
        // We might want to migrate this too, but for now we keep it compatible.
        const userCargoId = cargoObj?.id;

        if (!userCargoId) return [];

        const { data: roleModules, error: roleError } = await supabase
            .from('me_modulo_cargo')
            .select('modulo_codigo')
            .eq('empresa_id', userData.empresa_id)
            .eq('cargo_id', userCargoId)
            .eq('ativo', true);

        if (roleError) {
            console.error('Error fetching role permissions:', roleError);
            return activeCompanyModuleCodes; // Fallback to company modules? Or empty?
        }

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

        // Find the module ID for this code
        const { data: moduleData, error: moduleError } = await supabase
            .from('unq_modulos_sistema')
            .select('id')
            .eq('codigo', moduleCode)
            .single();

        if (moduleError || !moduleData) throw new Error(`Module code '${moduleCode}' not found in system.`);

        if (isActive) {
            // Upsert activation
            const { error } = await supabase
                .from('unq_empresa_modulos')
                .upsert({
                    empresa_id: userData.empresa_id,
                    modulo_id: moduleData.id,
                    status: 'active'
                }, { onConflict: 'empresa_id, modulo_id' });

            if (error) throw error;
        } else {
            // Deactivate (we can delete or set status to 'inactive')
            // Using delete to keep it consistent with modulesService.unsubscribe
            const { error } = await supabase
                .from('unq_empresa_modulos')
                .delete()
                .match({ empresa_id: userData.empresa_id, modulo_id: moduleData.id });

            if (error) throw error;
        }
    },

    // --- Permission Management (Still using old codes for now, which is fine) ---

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

    // --- New Methods Consolidated from modulesService.ts ---

    async getAllModules(): Promise<Module[]> {
        const { data, error } = await supabase
            .from('unq_modulos_sistema')
            .select('*')
            .order('nome');

        if (error) throw error;
        return data as Module[];
    },

    async getCurrentCompanyId() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario nao autenticado');

        const { data, error } = await supabase
            .from('me_usuario')
            .select('empresa_id')
            .eq('email', user.email)
            .single();

        if (error) throw error;
        return data.empresa_id;
    },

    async getCompanyModules(empresaId: string): Promise<CompanyModule[]> {
        const { data, error } = await supabase
            .from('unq_empresa_modulos')
            .select('*')
            .eq('empresa_id', empresaId);

        if (error) throw error;
        return data as CompanyModule[];
    },

    async subscribeToModule(empresaId: string, moduloId: string) {
        const { data, error } = await supabase
            .from('unq_empresa_modulos')
            .upsert({
                empresa_id: empresaId,
                modulo_id: moduloId,
                status: 'active'
            }, { onConflict: 'empresa_id, modulo_id' });

        if (error) throw error;
        return data;
    },

    async unsubscribeFromModule(empresaId: string, moduloId: string) {
        const { error } = await supabase
            .from('unq_empresa_modulos')
            .delete()
            .match({ empresa_id: empresaId, modulo_id: moduloId });

        if (error) throw error;
    },

    async ensureDefaults(defaultModules: string[]) {
        // ... (keep as is)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userData } = await supabase
            .from('me_usuario')
            .select('empresa_id')
            .eq('id', user.id)
            .single();

        if (!userData?.empresa_id) return;

        // Check if already has modules
        const { count } = await supabase
            .from('unq_empresa_modulos')
            .select('*', { count: 'exact', head: true })
            .eq('empresa_id', userData.empresa_id);

        if (count && count > 0) return;

        // Find IDs for default codes
        const { data: systemModules } = await supabase
            .from('unq_modulos_sistema')
            .select('id, codigo')
            .in('codigo', defaultModules);

        if (!systemModules) return;

        const inserts = systemModules.map(m => ({
            empresa_id: userData.empresa_id,
            modulo_id: m.id,
            status: 'active'
        }));

        await supabase
            .from('unq_empresa_modulos')
            .upsert(inserts, { onConflict: 'empresa_id, modulo_id' });
    }
}
