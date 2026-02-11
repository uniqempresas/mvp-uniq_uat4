import { supabase } from '../lib/supabase'

export type ModuleCode = 'crm' | 'storefront' | 'inventory' | 'team' | 'finance' | 'settings' | 'reports';

export interface ModuleConfig {
    id: string;
    empresa_id: string;
    modulo_codigo: ModuleCode;
    ativo: boolean;
    created_at?: string;
    updated_at?: string;
}

export const moduleService = {
    async getActiveModules(empresaId: string): Promise<ModuleConfig[]> {
        const { data, error } = await supabase
            .from('me_modulo_ativo')
            .select('*')
            .eq('empresa_id', empresaId);

        if (error) {
            console.error('Error fetching modules:', error);
            throw error;
        }

        return data || [];
    },

    async toggleModule(empresaId: string, moduloCodigo: string, ativo: boolean): Promise<ModuleConfig | null> {
        // Try to update first
        const { data, error } = await supabase
            .from('me_modulo_ativo')
            .upsert({
                empresa_id: empresaId,
                modulo_codigo: moduloCodigo,
                ativo: ativo,
                updated_at: new Date().toISOString()
            }, { onConflict: 'empresa_id, modulo_codigo' })
            .select()
            .single();

        if (error) {
            console.error(`Error toggling module ${moduloCodigo}:`, error);
            throw error;
        }

        return data;
    },

    // Helper to initialize default modules for a new company (if needed)
    async initializeDefaults(empresaId: string) {
        const defaultModules: ModuleCode[] = ['finance', 'settings'];
        // Note: finance and settings might be always active and not even in DB, 
        // but if we want them togglable or tracked, we insert them. 
        // For now, let's assume we only track OPTIONAL modules or track all.
        // Let's track all key modules to be safe.

        const inserts = defaultModules.map(code => ({
            empresa_id: empresaId,
            modulo_codigo: code,
            ativo: true
        }));

        const { error } = await supabase
            .from('me_modulo_ativo')
            .upsert(inserts, { onConflict: 'empresa_id, modulo_codigo' });

        if (error) console.error('Error init modules:', error);
    }
}
