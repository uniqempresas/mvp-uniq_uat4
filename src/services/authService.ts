import { supabase } from '../lib/supabase'

export const authService = {
    async getEmpresaId(): Promise<string | null> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        // Try to get from me_usuario
        const { data: userData } = await supabase
            .from('me_usuario')
            .select('empresa_id')
            .eq('id', user.id)
            .single()

        if (userData?.empresa_id) {
            return userData.empresa_id
        }

        // Fallback or Handle error
        // For development safety, assuming the known test company if linked to the known test user
        if (user.email === 'luiz.padaria@gmail' || user.email?.includes('padaria')) {
            return '61616cfa-dc60-418c-a21d-7aa6a915964a'
        }

        return null
    },

    async getEmpresaSlug(): Promise<string | null> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        // Try to get from me_usuario -> me_empresa
        const { data: userData } = await supabase
            .from('me_usuario')
            .select('empresa:me_empresa(slug)')
            .eq('id', user.id)
            .single()

        if (userData?.empresa) {
            const empresa = Array.isArray(userData.empresa) ? userData.empresa[0] : userData.empresa
            return empresa?.slug
        }

        // Fallback for development
        if (user.email === 'luiz.padaria@gmail.com' || user.email?.includes('padaria')) {
            return 'padaria-henriqueta'
        }

        return null
    },

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    }
}
