import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface ProductVariation {
    id?: string
    produto_pai_id?: number
    sku: string
    preco_varejo: number
    preco_custo: number
    estoque_atual: number
    atributos: Record<string, string>
    foto_url?: string
}

export interface Product {
    id: number
    empresa_id: string
    nome_produto: string
    descricao?: string
    codigo_barras?: string // Added
    preco: number // Preço base ou do produto simples
    preco_varejo?: number
    preco_custo?: number
    estoque_atual: number
    sku?: string
    foto_url?: string // Added for main product image
    categoria_id?: number
    subcategoria_id?: number
    tipo: 'simples' | 'variavel'
    opcoes_config?: string[] // ex: ["Cor", "Tamanho"] stored as jsonb array
    variacoes?: ProductVariation[]
    ativo?: boolean
}

export const productService = {
    async getProducts() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data: products, error } = await supabase
            .from('me_produto')
            .select(`
                *,
                variacoes:me_produto_variacao(*)
            `)
            .eq('empresa_id', empresaId)
            .order('nome_produto')

        if (error) {
            console.error('Error fetching products:', error)
            throw error
        }

        return (products || []).map(p => ({
            ...p,
            preco: Number(p.preco || 0),
            // Ensure variacoes is always an array
            variacoes: p.variacoes || []
        })) as Product[]
    },

    async getProductById(id: number) {
        const { data, error } = await supabase
            .from('me_produto')
            .select(`
                *,
                variacoes:me_produto_variacao(*)
            `)
            .eq('id', id)
            .single()

        if (error) throw error

        return {
            ...data,
            preco: Number(data.preco || 0),
            variacoes: data.variacoes || []
        } as Product
    },

    async createProduct(product: Partial<Product>, variations: ProductVariation[] = []) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não encontrada')

        // 1. Create Parent Product
        const { data: parentData, error: parentError } = await supabase
            .from('me_produto')
            .insert([{
                ...product,
                empresa_id: empresaId,
                tipo: variations.length > 0 ? 'variavel' : 'simples'
            }])
            .select()
            .single()

        if (parentError) throw parentError

        // 2. Create Variations if any
        if (variations.length > 0 && parentData) {
            const variationsToInsert = variations.map(v => ({
                ...v,
                produto_pai_id: parentData.id
            }))

            const { error: varError } = await supabase
                .from('me_produto_variacao')
                .insert(variationsToInsert)

            if (varError) {
                // If variations fail, ideally we should rollback (delete parent), 
                // but for MVP we'll throw error. 
                // TODO: Implement transaction or cleanup.
                console.error('Error inserting variations:', varError)
                throw varError
            }
        }

        return parentData
    },

    async updateProduct(id: number, product: Partial<Product>, variations: ProductVariation[]) {
        // Remove 'variacoes' from the update payload as it's not a column
        const { variacoes, ...productData } = product

        const { error: productError } = await supabase
            .from('me_produto')
            .update(productData)
            .eq('id', id)

        if (productError) throw productError

        // Strategy: Delete all existing variations and re-insert current ones
        // This handles additions, updates (by recreating), and deletions effectively for MVP.

        // 1. Delete all existing
        const { error: deleteError } = await supabase
            .from('me_produto_variacao')
            .delete()
            .eq('produto_pai_id', id)

        if (deleteError) throw deleteError

        // 2. Insert current list
        if (variations.length > 0) {
            const variationsToInsert = variations.map(v => {
                // Remove ID to force new insertion (or keep if we want to try to preserve, but re-insert is safer for sync)
                // Actually, if we keep ID we might hit issues if we just deleted them? 
                // Hard delete means old IDs are gone. We should insert as new lines.
                // But if we want to preserve IDs for other relations (like sales), we should ideally UPSERT + DELETE missing.
                // User suggested "delete all and save again", which implies new IDs. Let's do that for now as it's robust.
                const { id: _, ...variationData } = v
                return {
                    ...variationData,
                    produto_pai_id: id
                }
            })

            const { error: insertError } = await supabase
                .from('me_produto_variacao')
                .insert(variationsToInsert)

            if (insertError) throw insertError
        }
    },

    async deleteProduct(id: number) {
        const { error } = await supabase
            .from('me_produto')
            .delete()
            .eq('id', id)
        if (error) throw error
    },

    async uploadProductImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('uniq_me_produtos')
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
