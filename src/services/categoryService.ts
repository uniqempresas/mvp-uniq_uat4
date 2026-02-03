import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface Category {
    id_categoria: number
    nome_categoria: string // Renamed from nome
    empresa_id: string
}

export interface Subcategory {
    id_subcategoria: number
    nome_subcategoria: string
    id_categoria: number
    empresa_id: string
}

export const categoryService = {
    // Categories
    async getCategories() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('me_categoria')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('nome_categoria')

        if (error) throw error

        // Map DB (id_categoria) -> Frontend (id_categoria)
        // Note: DB returns 'id_categoria' directly, not 'id'
        return (data || []).map((cat: any) => ({
            id_categoria: Number(cat.id_categoria),
            nome_categoria: cat.nome_categoria,
            empresa_id: cat.empresa_id
        })) as Category[]
    },

    async createCategory(nome_categoria: string) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não encontrada')

        const { data, error } = await supabase
            .from('me_categoria')
            .insert([{ nome_categoria, empresa_id: empresaId }])
            .select()
            .single()

        if (error) throw error

        return {
            id_categoria: Number(data.id_categoria),
            nome_categoria: data.nome_categoria,
            empresa_id: data.empresa_id
        } as Category
    },

    async updateCategory(id: number, nome_categoria: string) {
        const { error } = await supabase
            .from('me_categoria')
            .update({ nome_categoria })
            .eq('id_categoria', id)

        if (error) throw error
    },

    async deleteCategory(id: number) {
        const { error } = await supabase
            .from('me_categoria')
            .delete()
            .eq('id_categoria', id)

        if (error) throw error
    },

    // Subcategories
    async getSubcategories(categoryId: number) {
        const { data, error } = await supabase
            .from('me_subcategoria')
            .select('*')
            .eq('id_categoria', categoryId)
            .order('nome_subcategoria')

        if (error) throw error

        // Map DB (id_subcategoria) -> Frontend (id_subcategoria)
        return (data || []).map((sub: any) => ({
            id_subcategoria: Number(sub.id_subcategoria),
            nome_subcategoria: sub.nome_subcategoria,
            id_categoria: Number(sub.id_categoria),
            empresa_id: sub.empresa_id
        })) as Subcategory[]
    },

    async createSubcategory(categoryId: number, nome_subcategoria: string) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não encontrada')

        const { data, error } = await supabase
            .from('me_subcategoria')
            .insert([{ nome_subcategoria, categoria_id: categoryId, empresa_id: empresaId }])
            .select()
            .single()

        if (error) throw error

        return {
            id_subcategoria: data.id,
            nome_subcategoria: data.nome_subcategoria,
            id_categoria: data.categoria_id,
            empresa_id: data.empresa_id
        } as Subcategory
    },

    async updateSubcategory(id: number, nome_subcategoria: string) {
        const { error } = await supabase
            .from('me_subcategoria')
            .update({ nome_subcategoria })
            .eq('id', id) // Use 'id' column

        if (error) throw error
    },

    async deleteSubcategory(id: number) {
        const { error } = await supabase
            .from('me_subcategoria')
            .delete()
            .eq('id', id) // Use 'id' column

        if (error) throw error
    }
}
