import { supabase } from '../lib/supabase'
import type { Product } from './productService'
import { USE_MOCK_DATA, mockCompany, mockProducts, mockCategories } from '../mocks/storefront'

export interface PublicCompany {
    id: string
    nome_fantasia: string
    telefone: string
    email?: string
    slug: string
    logo_url?: string
    store_config?: StoreConfig
}

export interface StoreConfig {
    appearance?: {
        theme?: {
            primary_color?: string
            secondary_color?: string
            font_family?: string
            border_radius?: string
        }
        hero?: {
            type?: 'carousel' | 'static'
            autoplay?: boolean
            interval?: number
            banners?: Banner[]
        }
        home_layout?: LayoutBlock[]
    }
    whatsapp?: {
        custom_message?: string
        include_link?: boolean
        include_price?: boolean
    }
}

export interface Banner {
    id: string
    desktop_url: string
    mobile_url?: string
    title?: string
    subtitle?: string
    link_type?: 'product' | 'category' | 'external'
    link_value?: string
    button_text?: string
    button_color?: string
    text_color?: string
    button_position?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center-center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

export interface LayoutBlock {
    id: string
    active: boolean
    order: number
}

export interface PublicProduct extends Product {
    // Basic product info, images, and variations
}

export interface Category {
    id_categoria: string
    nome_categoria: string
}

export interface HierarchicalCategory extends Category {
    subcategories: Category[]
}

export const publicService = {
    async getCompanyBySlug(slug: string): Promise<PublicCompany | null> {
        if (USE_MOCK_DATA) {
            console.log('🎭 Usando MOCK DATA para empresa')
            return mockCompany.slug === slug ? mockCompany : null
        }

        const { data, error } = await supabase
            .from('me_empresa')
            .select('id, nome_fantasia, telefone, email, slug, logo_url, store_config, appearance')
            .eq('slug', slug)
            .single()

        if (error) {
            console.error('Error fetching company by slug:', error)
            return null
        }

        // Mesclar campo 'appearance' do banco dentro de store_config.appearance
        // para manter compatibilidade com o Storefront que lê store_config.appearance
        const { appearance, ...rest } = data as any
        return {
            ...rest,
            store_config: {
                ...(rest.store_config || {}),
                appearance: appearance || (rest.store_config as any)?.appearance || {}
            }
        } as PublicCompany
    },

    async getPublicProducts(empresaId: string): Promise<PublicProduct[]> {
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
        if (USE_MOCK_DATA) {
            console.log('🎭 Usando MOCK DATA para categorias')
            return mockCategories
        }

        const { data, error } = await supabase
            .from('me_categoria')
            .select('id_categoria, nome_categoria')
            .eq('empresa_id', empresaId)
            .order('nome_categoria')

        if (error) {
            console.error('Error fetching categories:', error)
            return []
        }

        return data || []
    },

    async getHierarchicalCategories(empresaId: string): Promise<HierarchicalCategory[]> {
        if (USE_MOCK_DATA) {
            console.log('🎭 Usando MOCK DATA para categorias hierárquicas')
            return mockCategories.map(c => ({ ...c, subcategories: [] }))
        }

        const { data, error } = await supabase
            .from('me_categoria')
            .select('id_categoria, nome_categoria')
            .eq('empresa_id', empresaId)
            .order('nome_categoria')

        if (error) {
            console.error('Error fetching hierarchical categories:', error)
            return []
        }

        return (data || []).map((cat: any) => ({
            ...cat,
            subcategories: []
        }))
    },

    getWhatsAppLink(phone: string, text: string) {
        const cleanPhone = phone.replace(/\D/g, '')
        const encodedText = encodeURIComponent(text)
        return `https://wa.me/55${cleanPhone}?text=${encodedText}`
    }
}

/**
 * Constrói mensagem de WhatsApp a partir do template customizado do parceiro.
 * Tags suportadas: [NOME], [PRECO], [LINK], [SAUDACAO]
 * Se não houver template, retorna mensagem padrão.
 */
export function buildWhatsAppMessage(
    template: string | undefined,
    context: {
        productName?: string
        price?: number
        productUrl?: string
        variation?: string
    }
): string {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

    if (!template) {
        const varText = context.variation ? ` - ${context.variation}` : ''
        const priceText = context.price
            ? `\nR$ ${context.price.toFixed(2).replace('.', ',')}`
            : ''
        return `${greeting}! Gostaria de pedir:\n\n*${context.productName || 'produto'}${varText}*${priceText}`
    }

    return template
        .replace(/\[NOME\]/g, context.productName || '')
        .replace(/\[PRECO\]/g, context.price
            ? `R$ ${context.price.toFixed(2).replace('.', ',')}`
            : '')
        .replace(/\[LINK\]/g, context.productUrl || '')
        .replace(/\[SAUDACAO\]/g, greeting)
}
