import { supabase } from '../lib/supabase'
import type { Product } from './productService'

export interface PublicCompany {
    id: string
    nome_fantasia: string
    telefone: string
    slug: string
    avatar_url?: string
}

export interface PublicProduct extends Product {
    // Basic product info, images, and variations
}

export const publicService = {
    async getCompanyBySlug(slug: string): Promise<PublicCompany | null> {
        const { data, error } = await supabase
            .from('me_empresa')
            .select('id, nome_fantasia, telefone, slug')
            .eq('slug', slug)
            .single()

        if (error) {
            console.error('Error fetching company by slug:', error)
            return null
        }
        return data
    },

    async getPublicProducts(empresaId: string): Promise<PublicProduct[]> {
        const { data, error } = await supabase
            .from('me_produto')
            .select(`
                *,
                variacoes:me_produto_variacao(*),
                imagens:me_produto_imagem(*)
            `)
            .eq('empresa_id', empresaId)
            .eq('ativo', true)
            .eq('exibir_vitrine', true)
            .order('nome_produto')

        if (error) {
            console.error('Error fetching public products:', error)
            throw error
        }

        return (data || []).map(p => ({
            ...p,
            preco: Number(p.preco || 0),
            variacoes: (p.variacoes || []).map((v: any) => ({
                ...v,
                preco: Number(v.preco || 0),
                preco_varejo: Number(v.preco_varejo || 0)
            })),
            imagens: (p.imagens || []).sort((a: any, b: any) => a.ordem_exibicao - b.ordem_exibicao)
        })) as PublicProduct[]
    },

    getWhatsAppLink(phone: string, text: string) {
        const cleanPhone = phone.replace(/\D/g, '')
        const encodedText = encodeURIComponent(text)
        return `https://wa.me/55${cleanPhone}?text=${encodedText}`
    }
}
