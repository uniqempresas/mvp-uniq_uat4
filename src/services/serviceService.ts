import { supabase } from '../lib/supabase'
import { authService } from './authService'
import { mockServices, USE_MOCK_SERVICES } from '../mocks/services'

// Tipos
export interface ServiceImage {
    id?: string
    servico_id?: number
    imagem_url: string
    ordem_exibicao: number
    empresa_id?: string
}

// Service Interface (Front-end model)
export interface Service {
    id: number
    empresa_id: string
    nome: string // Mapeia para nome_servico
    descricao?: string
    categoria_id?: number
    subcategoria_id?: number
    categoria?: string // Legado/Visual only
    preco: number
    duracao?: number // Mapeia para duracao_minutos
    ativo: boolean
    created_at?: string
    updated_at?: string

    // Novos campos de mídia
    foto_url?: string
    imagens?: ServiceImage[]
}

// Database Interface (Back-end model)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ServiceDB {
    id: number
    empresa_id: string
    nome_servico: string
    descricao?: string
    categoria_id?: number
    subcategoria_id?: number // Se existir no banco
    preco: number
    duracao_minutos?: number
    ativo: boolean
    created_at?: string
    updated_at?: string
    imagens?: { imagem_url: string; ordem_exibicao: number }[]
}

// Cast para Service para compatibilidade com mocks, ajustando campos se necessário
let localMockServices: Service[] = mockServices.map((s: any) => ({
    ...s,
    categoria_id: undefined,
    subcategoria_id: undefined
})) as Service[]

export const serviceService = {
    async getServices(): Promise<Service[]> {
        if (USE_MOCK_SERVICES) {
            console.log('🎭 Usando MOCK DATA para serviços')
            return localMockServices
        }

        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data: servicesDB, error } = await supabase
            .from('me_servico')
            .select(`
                *,
                imagens:me_servico_imagem(*)
            `)
            .eq('empresa_id', empresaId)
            .order('nome_servico')

        if (error) throw error

        // Map DB to Frontend
        return (servicesDB || []).map((s: ServiceDB) => ({
            id: s.id,
            empresa_id: s.empresa_id,
            nome: s.nome_servico,
            descricao: s.descricao,
            categoria_id: s.categoria_id,
            subcategoria_id: s.subcategoria_id, // Check DB structure below
            preco: Number(s.preco),
            duracao: s.duracao_minutos,
            ativo: s.ativo,
            created_at: s.created_at,
            updated_at: s.updated_at,
            imagens: (s.imagens || []).sort((a: any, b: any) => a.ordem_exibicao - b.ordem_exibicao),
            foto_url: s.imagens?.[0]?.imagem_url
        })) as Service[]
    },

    async getServiceById(id: number): Promise<Service | null> {
        if (USE_MOCK_SERVICES) {
            return localMockServices.find(s => s.id === id) || null
        }

        const { data: s, error } = await supabase
            .from('me_servico')
            .select(`
                *,
                imagens:me_servico_imagem(*)
            `)
            .eq('id', id)
            .single()

        if (error) throw error

        return {
            id: s.id,
            empresa_id: s.empresa_id,
            nome: s.nome_servico,
            descricao: s.descricao,
            categoria_id: s.categoria_id,
            preco: Number(s.preco),
            duracao: s.duracao_minutos,
            ativo: s.ativo,
            created_at: s.created_at,
            updated_at: s.updated_at,
            imagens: (s.imagens || []).sort((a: any, b: any) => a.ordem_exibicao - b.ordem_exibicao),
            foto_url: s.imagens?.[0]?.imagem_url
        } as Service
    },

    async createService(serviceData: Partial<Service>, images: ServiceImage[] = []): Promise<Service> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        if (USE_MOCK_SERVICES) {
            const newService: Service = {
                ...serviceData as Service,
                id: Math.max(...localMockServices.map(s => s.id), 0) + 1,
                empresa_id: 'mock-empresa-1',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                imagens: images,
                foto_url: images.length > 0 ? images[0].imagem_url : undefined
            }
            localMockServices.push(newService)
            console.log('✅ Serviço criado (mock):', newService)
            return newService
        }

        // Map Frontend to DB
        const dbData = {
            empresa_id: empresaId,
            nome_servico: serviceData.nome,
            descricao: serviceData.descricao,
            categoria_id: serviceData.categoria_id,
            // subcategoria_id: serviceData.subcategoria_id, // Uncomment if column exists
            preco: serviceData.preco,
            duracao_minutos: serviceData.duracao,
            ativo: serviceData.ativo !== undefined ? serviceData.ativo : true
        }

        // 1. Criar Serviço
        const { data: service, error } = await supabase
            .from('me_servico')
            .insert([dbData])
            .select()
            .single()

        if (error) throw error

        // 2. Salvar Imagens
        if (images.length > 0) {
            const imagesToInsert = images.map((img, idx) => ({
                servico_id: service.id,
                imagem_url: img.imagem_url,
                ordem_exibicao: idx,
                empresa_id: empresaId
            }))

            await supabase.from('me_servico_imagem').insert(imagesToInsert)
        }

        return await this.getServiceById(service.id) as Service
    },

    async updateService(id: number, updates: Partial<Service>, images: ServiceImage[] = []): Promise<Service> {
        if (USE_MOCK_SERVICES) {
            const index = localMockServices.findIndex(s => s.id === id)
            if (index === -1) throw new Error('Serviço não encontrado')

            localMockServices[index] = {
                ...localMockServices[index],
                ...updates,
                imagens: images,
                foto_url: images.length > 0 ? images[0].imagem_url : undefined,
                updated_at: new Date().toISOString()
            }
            console.log('✅ Serviço atualizado (mock):', localMockServices[index])
            return localMockServices[index]
        }

        // Map Frontend to DB
        const dbUpdates: any = {}
        if (updates.nome !== undefined) dbUpdates.nome_servico = updates.nome
        if (updates.descricao !== undefined) dbUpdates.descricao = updates.descricao
        if (updates.categoria_id !== undefined) dbUpdates.categoria_id = updates.categoria_id
        if (updates.preco !== undefined) dbUpdates.preco = updates.preco
        if (updates.duracao !== undefined) dbUpdates.duracao_minutos = updates.duracao
        if (updates.ativo !== undefined) dbUpdates.ativo = updates.ativo

        dbUpdates.updated_at = new Date().toISOString()

        // 1. Atualizar Serviço
        const { error } = await supabase
            .from('me_servico')
            .update(dbUpdates)
            .eq('id', id)

        if (error) throw error

        // 2. Atualizar Imagens (Deleta e recria)
        await supabase.from('me_servico_imagem').delete().eq('servico_id', id)

        if (images.length > 0) {
            const { data: currentService } = await supabase.from('me_servico').select('empresa_id').eq('id', id).single()

            if (currentService) {
                const imagesToInsert = images.map((img, idx) => ({
                    servico_id: id,
                    imagem_url: img.imagem_url,
                    ordem_exibicao: idx,
                    empresa_id: currentService.empresa_id
                }))
                await supabase.from('me_servico_imagem').insert(imagesToInsert)
            }
        }

        return await this.getServiceById(id) as Service
    },

    async deleteService(id: number): Promise<void> {
        if (USE_MOCK_SERVICES) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            localMockServices = localMockServices.filter(s => s.id !== id)
            console.log('🗑️ Serviço excluído (mock), ID:', id)
            return
        }

        // Cascade delete cuida das imagens se configurado, mas por segurança deletamos manual
        await supabase.from('me_servico_imagem').delete().eq('servico_id', id)

        const { error } = await supabase
            .from('me_servico')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    async uploadServiceImage(file: File): Promise<string> {
        if (USE_MOCK_SERVICES) {
            // Simular upload e retornar URL fake (ou object URL)
            return new Promise((resolve) => {
                setTimeout(() => {
                    const fakeUrl = URL.createObjectURL(file)
                    resolve(fakeUrl)
                }, 1000)
            })
        }

        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const startUpload = Date.now()
        const fileExt = file.name.split('.').pop()
        const fileName = `${startUpload}-${Math.random()}.${fileExt}`
        const filePath = `${empresaId}/services/${fileName}` // Organizar por empresa folder

        const { error: uploadError } = await supabase.storage
            .from('company-assets')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('company-assets').getPublicUrl(filePath)
        return data.publicUrl
    }
}
