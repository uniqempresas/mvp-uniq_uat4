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

        const { data, error } = await supabase
            .from('me_modulo_ativo')
            .select('module_code')
            .eq('user_id', user.id)
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching modules:', error);
            throw error;
        }

        return data.map((row: any) => row.module_code);
    },

    async toggleModule(moduleCode: string, isActive: boolean): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('me_modulo_ativo')
            .upsert({
                user_id: user.id,
                module_code: moduleCode,
                is_active: isActive,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, module_code' });

        if (error) {
            console.error(`Error toggling module ${moduleCode}:`, error);
            throw error;
        }
    },

    // Sincroniza estado inicial se necessário (opcional)
    async ensureDefaults(defaultModules: string[]) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Verifica se já tem módulos configurados
        const { count } = await supabase
            .from('me_modulo_ativo')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (count && count > 0) return;

        // Se não tiver, insere defaults
        const inserts = defaultModules.map(code => ({
            user_id: user.id,
            module_code: code,
            is_active: true
        }));

        await supabase
            .from('me_modulo_ativo')
            .upsert(inserts, { onConflict: 'user_id, module_code' });
    }
}
