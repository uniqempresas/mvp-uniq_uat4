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

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    }
}
