import { supabase } from '../lib/supabase'
import type { Product } from './productService'
import { USE_MOCK_DATA, mockCompany, mockProducts, mockCategories } from '../mocks/storefront'

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

export interface Category {
    id: string
    nome_categoria: string
}

export const publicService = {
    async getCompanyBySlug(slug: string): Promise<PublicCompany | null> {
        // Usar mock data se configurado
        if (USE_MOCK_DATA) {
            console.log('🎭 Usando MOCK DATA para empresa')
            return mockCompany.slug === slug ? mockCompany : null
        }

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
        // Usar mock data se configurado
        if (USE_MOCK_DATA) {
            console.log('🎭 Usando MOCK DATA para produtos')
            return mockProducts.filter(p => p.empresa_id === empresaId)
        }

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

    async getCategories(empresaId: string): Promise<Category[]> {
        // Usar mock data se configurado
        if (USE_MOCK_DATA) {
            console.log('🎭 Usando MOCK DATA para categorias')
            return mockCategories
        }

        const { data, error } = await supabase
            .from('me_categoria')
            .select('id, nome_categoria')
            .eq('empresa_id', empresaId)
            .eq('ativo', true)
            .order('nome_categoria')

        if (error) {
            console.error('Error fetching categories:', error)
            return []
        }

        return data || []
    },

    getWhatsAppLink(phone: string, text: string) {
        const cleanPhone = phone.replace(/\D/g, '')
        const encodedText = encodeURIComponent(text)
        return `https://wa.me/55${cleanPhone}?text=${encodedText}`
    }
}
