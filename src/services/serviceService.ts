import { supabase } from '../lib/supabase'
import { authService } from './authService'
import { mockServices, USE_MOCK_SERVICES, type Service } from '../mocks/services'

// Tipos
export interface ServiceImage {
    id?: string
    servico_id?: number
    imagem_url: string
    ordem_exibicao: number
}

// Alterando Service para corresponder ao novo plano
// Mantemos compatibilidade com o que já existe onde possível
export interface Service {
    id: number
    empresa_id: string
    nome: string
    descricao?: string
    // Agora usamos IDs para categorias
    categoria_id?: number
    subcategoria_id?: number
    // Campos legados de string (manter por compatibilidade ou remover se migrar tudo)
    categoria?: string

    preco: number
    duracao?: number // minutos
    ativo: boolean
    created_at?: string
    updated_at?: string

    // Novos campos de mídia
    foto_url?: string
    imagens?: ServiceImage[]
}

// Estado local para mock data
let localMockServices: Service[] = [...mockServices]

export const serviceService = {
    async getServices(): Promise<Service[]> {
        if (USE_MOCK_SERVICES) {
            console.log('🎭 Usando MOCK DATA para serviços')
            return localMockServices
        }

        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data: services, error } = await supabase
            .from('me_servico')
            .select(`
        *,
        imagens:me_servico_imagem(*)
      `)
            .eq('empresa_id', empresaId)
            .order('nome')

        if (error) throw error

        // Mapear retorno para garantir array de imagens
        return (services || []).map(s => ({
            ...s,
            imagens: (s.imagens || []).sort((a: any, b: any) => a.ordem_exibicao - b.ordem_exibicao),
            foto_url: s.imagens?.[0]?.imagem_url || s.foto_url
        })) as Service[]
    },

    async getServiceById(id: number): Promise<Service | null> {
        if (USE_MOCK_SERVICES) {
            return localMockServices.find(s => s.id === id) || null
        }

        const { data, error } = await supabase
            .from('me_servico')
            .select(`
        *,
        imagens:me_servico_imagem(*)
      `)
            .eq('id', id)
            .single()

        if (error) throw error

        return {
            ...data,
            imagens: (data.imagens || []).sort((a: any, b: any) => a.ordem_exibicao - b.ordem_exibicao)
        } as Service
    },

    async createService(serviceData: any, images: ServiceImage[] = []): Promise<Service> {
        // serviceData pode vir com ou sem imagens, tratamos aqui
        const { imagens: _, ...dataToSave } = serviceData

        if (USE_MOCK_SERVICES) {
            const newService: Service = {
                ...dataToSave,
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

        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        // 1. Criar Serviço
        const { data: service, error } = await supabase
            .from('me_servico')
            .insert([{ ...dataToSave, empresa_id: empresaId }])
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

        return service as Service
    },

    async updateService(id: number, updates: any, images: ServiceImage[] = []): Promise<Service> {
        const { imagens: _, ...dataToUpdate } = updates

        if (USE_MOCK_SERVICES) {
            const index = localMockServices.findIndex(s => s.id === id)
            if (index === -1) throw new Error('Serviço não encontrado')

            localMockServices[index] = {
                ...localMockServices[index],
                ...dataToUpdate,
                imagens: images,
                foto_url: images.length > 0 ? images[0].imagem_url : undefined,
                updated_at: new Date().toISOString()
            }
            console.log('✅ Serviço atualizado (mock):', localMockServices[index])
            return localMockServices[index]
        }

        // 1. Atualizar Serviço
        const { data: service, error } = await supabase
            .from('me_servico')
            .update(dataToUpdate)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        // 2. Atualizar Imagens (Simplificado: Deleta tudo e recria)
        // Em produção idealmente faria diff, mas para MVP ok
        await supabase.from('me_servico_imagem').delete().eq('servico_id', id)

        if (images.length > 0) {
            const imagesToInsert = images.map((img, idx) => ({
                servico_id: id,
                imagem_url: img.imagem_url,
                ordem_exibicao: idx,
                empresa_id: service.empresa_id
            }))
            await supabase.from('me_servico_imagem').insert(imagesToInsert)
        }

        return service as Service
    },

    async deleteService(id: number): Promise<void> {
        if (USE_MOCK_SERVICES) {
            localMockServices = localMockServices.filter(s => s.id !== id)
            console.log('🗑️ Serviço excluído (mock), ID:', id)
            return
        }

        // Supabase faz cascade delete se configurado, ou deletamos imagens antes
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

        const startUpload = Date.now()
        const fileExt = file.name.split('.').pop()
        const fileName = `${startUpload}-${Math.random()}.${fileExt}`
        const filePath = `services/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('company-assets')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('company-assets').getPublicUrl(filePath)
        return data.publicUrl
    }
}
