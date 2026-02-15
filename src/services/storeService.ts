import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface StoreConfig {
    banner_url?: string
    primary_color?: string

    // Identidade
    slogan?: string
    description?: string // Bio

    // Contato
    support_email?: string
    whatsapp_contact?: string
    website?: string

    // Operacional
    shipping_methods?: string[] // ["Correios", "Retirada", "Transportadora"]
    pix_key?: string

    // Preferências
    notifications?: {
        new_orders: boolean
        questions: boolean
        reports: boolean
    }
}

export interface StoreData {
    slug: string
    logo_url?: string // Logo da empresa
    nome_fantasia: string // Nome da Loja
    store_config: StoreConfig
    appearance?: any // Configurações visuais (banners, cores, etc)
}

export const storeService = {
    async getStoreConfig(): Promise<StoreData | null> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return null

        const { data, error } = await supabase
            .from('me_empresa')
            .select('slug, logo_url, nome_fantasia, store_config, appearance')
            .eq('id', empresaId)
            .single()

        if (error) {
            console.error('Error fetching store config:', error)
            throw error
        }

        return {
            slug: data.slug,
            logo_url: data.logo_url,
            nome_fantasia: data.nome_fantasia,
            store_config: data.store_config || {},
            appearance: data.appearance || {}
        }
    },

    async updateStoreConfig(data: Partial<StoreData>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não encontrada')

        const { store_config, appearance, ...mainFields } = data
        let updates: any = { ...mainFields }

        // Fetch current data to merge JSONB fields
        const { data: currentData } = await supabase
            .from('me_empresa')
            .select('store_config, appearance')
            .eq('id', empresaId)
            .single()

        if (store_config) {
            const currentConfig = currentData?.store_config || {}
            const mergedConfig = { ...currentConfig } as Record<string, any>

            for (const [key, value] of Object.entries(store_config)) {
                if (
                    value !== null &&
                    typeof value === 'object' &&
                    !Array.isArray(value) &&
                    typeof mergedConfig[key] === 'object' &&
                    mergedConfig[key] !== null &&
                    !Array.isArray(mergedConfig[key])
                ) {
                    mergedConfig[key] = { ...mergedConfig[key], ...value }
                } else {
                    mergedConfig[key] = value
                }
            }

            updates.store_config = mergedConfig
        }

        if (appearance) {
            const currentAppearance = currentData?.appearance || {}
            const mergedAppearance = { ...currentAppearance } as Record<string, any>

            for (const [key, value] of Object.entries(appearance)) {
                if (
                    value !== null &&
                    typeof value === 'object' &&
                    !Array.isArray(value) &&
                    typeof mergedAppearance[key] === 'object' &&
                    mergedAppearance[key] !== null &&
                    !Array.isArray(mergedAppearance[key])
                ) {
                    mergedAppearance[key] = { ...mergedAppearance[key], ...value }
                } else {
                    mergedAppearance[key] = value
                }
            }

            updates.appearance = mergedAppearance
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
