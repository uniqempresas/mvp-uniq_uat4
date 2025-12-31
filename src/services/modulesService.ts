import { supabase } from '../lib/supabase'

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
}

export interface CompanyModule {
    id: string;
    empresa_id: string;
    modulo_id: string;
    status: string;
    data_contratacao: string;
}

export const modulesService = {
    // Get all available system modules
    async getAllModules() {
        const { data, error } = await supabase
            .from('unq_modulos_sistema')
            .select('*')
            .eq('status', 'active')
            .order('nome');

        if (error) throw error;
        return data as Module[];
    },

    // Get current user's company ID
    async getCurrentCompanyId() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario nao autenticado');

        // Try to find user by email since we don't have a direct link guaranteed yet
        const { data, error } = await supabase
            .from('me_usuario')
            .select('empresa_id')
            .eq('email', user.email)
            .single();

        if (error) throw error;
        return data.empresa_id;
    },

    // Get modules owned by a company
    async getCompanyModules(empresaId: string) {
        const { data, error } = await supabase
            .from('unq_empresa_modulos')
            .select('*')
            .eq('empresa_id', empresaId);

        if (error) throw error;
        return data as CompanyModule[];
    },

    // Subscribe to a module
    async subscribeToModule(empresaId: string, moduloId: string) {
        const { data, error } = await supabase
            .from('unq_empresa_modulos')
            .insert({
                empresa_id: empresaId,
                modulo_id: moduloId,
                status: 'active' // For now, auto-activate. In real app, goes to checkout/pending.
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Unsubscribe/Deactivate module
    async unsubscribeFromModule(empresaId: string, moduloId: string) {
        const { error } = await supabase
            .from('unq_empresa_modulos')
            .delete()
            .match({ empresa_id: empresaId, modulo_id: moduloId });

        if (error) throw error;
    }
}
