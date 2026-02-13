import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface StoreConfig {
    banner_url?: string
    primary_color?: string
    description?: string // Bio
    whatsapp_contact?: string
}

export interface StoreData {
    slug: string
    avatar_url?: string // Logo
    nome_fantasia: string // Nome da Loja
    store_config: StoreConfig
}

export const storeService = {
    async getStoreConfig(): Promise<StoreData | null> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return null

        const { data, error } = await supabase
            .from('me_empresa')
            .select('slug, avatar_url, nome_fantasia, store_config')
            .eq('id', empresaId)
            .single()

        if (error) {
            console.error('Error fetching store config:', error)
            throw error
        }

        return {
            slug: data.slug,
            avatar_url: data.avatar_url,
            nome_fantasia: data.nome_fantasia,
            store_config: data.store_config || {}
        }
    },

    async updateStoreConfig(data: Partial<StoreData>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não encontrada')

        // Separate flattened fields from store_config
        const { store_config, ...mainFields } = data

        // If store_config is partial, we need to merge it? 
        // Or we assume the frontend sends the whole object?
        // Better to merge if possible, or frontend sends complete info.
        // Let's assume frontend sends strictly what needs to be updated.
        // But store_config is a JSONB column. Updating it partially in SQL is tricky without fetching first or using jsonb_set.
        // For simplicity, if store_config is provided, we might want to fetch existing config and merge, OR frontend sends full config.
        // Given the UI is a form, standard practice is to send the full updated config object or we merge here.

        let updates: any = { ...mainFields }

        if (store_config) {
            // If we want to support partial updates to store_config deeply, we need to fetch first.
            // But let's assume the component invokes getStoreConfig, modifies the object, and sends it back.
            // So we can just save it.
            // However, to be safe against overwriting other future fields in store_config, merging is better.
            // But for now, let's just save what is passed, assuming it's the full config for that section.
            // Wait, if we have checks, we should probably merge.

            // Let's do a merge strategy if store_config is present
            const { data: currentData } = await supabase
                .from('me_empresa')
                .select('store_config')
                .eq('id', empresaId)
                .single()

            const currentConfig = currentData?.store_config || {}
            updates.store_config = { ...currentConfig, ...store_config }
        }

        const { error } = await supabase
            .from('me_empresa')
            .update(updates)
            .eq('id', empresaId)

        if (error) {
            console.error('Error updating store config:', error)
            throw error
        }
    },

    async checkSlugAvailability(slug: string): Promise<boolean> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return false // Should not happen if logged in

        // Check if any company has this slug, excluding current company
        const { data, error } = await supabase
            .from('me_empresa')
            .select('id')
            .eq('slug', slug)
            .neq('id', empresaId)
            .maybeSingle()

        if (error) {
            console.error('Error checking slug:', error)
            return false // Fail safe
        }

        return !data // If data exists, slug is taken. If null, available.
    },

    async toggleProductVisibility(productId: number, isVisible: boolean) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não encontrada')

        const { error } = await supabase
            .from('me_produto')
            .update({ exibir_vitrine: isVisible })
            .eq('id', productId)
            .eq('empresa_id', empresaId) // Security check

        if (error) {
            console.error('Error toggling product visibility:', error)
            throw error
        }
    },

    async uploadStoreAsset(file: File): Promise<string> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não encontrada')

        const fileExt = file.name.split('.').pop()
        const fileName = `${empresaId}_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `store-assets/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('uniq_me_produtos') // Reusing existing bucket as per SPEC logic or new specific one if created?
            // SPEC says: "Bucket uniq_me_produtos (ou novo uniq_loja_assets se possível, senão usar existente)"
            // I'll stick to uniq_me_produtos for now to avoid permission issues if new bucket isn't set up.
            .upload(filePath, file)

        if (uploadError) {
            throw uploadError
        }

        const { data } = supabase.storage
            .from('uniq_me_produtos')
            .getPublicUrl(filePath)

        return data.publicUrl
    }
}
