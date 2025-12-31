import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface Product {
    id: string
    nome_produto: string
    descricao?: string
    preco: number
    empresa_id: string
}

export const productService = {
    async getProducts() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('me_produto')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('nome_produto')

        if (error) console.error('Error fetching products:', error)

        return (data || []).map(p => ({
            ...p,
            preco: Number(p.preco || 0),
            preco_venda: Number(p.preco_venda || 0) // legacy
        })) as Product[]
    }
}
