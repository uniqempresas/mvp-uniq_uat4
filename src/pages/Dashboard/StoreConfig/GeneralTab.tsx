import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { storeService } from '../../../services/storeService'
import toast, { Toaster } from 'react-hot-toast'

const schema = z.object({
    slug: z.string()
        .min(3, 'Slug deve ter pelo menos 3 caracteres')
        .regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífens'),
    nome_fantasia: z.string().min(1, 'Nome da loja é obrigatório'),
    description: z.string().optional(),
    whatsapp_contact: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export const GeneralTab: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const slug = watch('slug')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await storeService.getStoreConfig()
            if (data) {
                setValue('slug', data.slug || '')
                setValue('nome_fantasia', data.nome_fantasia || '')
                setValue('description', data.store_config.description || '')
                setValue('whatsapp_contact', data.store_config.whatsapp_contact || '')
            }
        } catch (e) {
            console.error(e)
            toast.error('Erro ao carregar configurações')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data: FormData) => {
        try {
            if (slugAvailable === false) {
                toast.error('Endereço (Slug) indisponível. Escolha outro.')
                return
            }

            await storeService.updateStoreConfig({
                slug: data.slug,
                nome_fantasia: data.nome_fantasia,
                store_config: {
                    description: data.description,
                    whatsapp_contact: data.whatsapp_contact
                }
            })
            toast.success('Configurações salvas com sucesso!')
        } catch (e) {
            console.error(e)
            toast.error('Erro ao salvar configurações')
        }
    }

    const checkSlug = async () => {
        if (slug && slug.length >= 3) {
            const available = await storeService.checkSlugAvailability(slug)
            setSlugAvailable(available)
        }
    }

    if (loading) return <div className="p-4 text-center">Carregando...</div>

    return (
        <div className="max-w-3xl">
            <Toaster />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">URL da Loja</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            uniq.app/c/
                        </span>
                        <input
                            type="text"
                            {...register('slug')}
                            onBlur={checkSlug}
                            className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border ${errors.slug || slugAvailable === false ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} sm:text-sm outline-none`}
                        />
                    </div>
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
                    {slugAvailable === false && <p className="mt-1 text-sm text-red-600">Este endereço já está em uso.</p>}
                    {slugAvailable === true && !errors.slug && <p className="mt-1 text-sm text-green-600">Endereço disponível!</p>}
                    <p className="mt-1 text-xs text-gray-500">Este é o link que seus clientes usarão para acessar sua loja.</p>
                </div>

                {/* Nome */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome da Loja</label>
                    <input
                        type="text"
                        {...register('nome_fantasia')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none"
                    />
                    {errors.nome_fantasia && <p className="mt-1 text-sm text-red-600">{errors.nome_fantasia.message}</p>}
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição (Bio)</label>
                    <div className="mt-1">
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2 outline-none"
                            placeholder="Conte um pouco sobre sua loja..."
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Breve descrição que aparecerá no perfil da sua loja.</p>
                </div>

                {/* Whatsapp */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp para Contato</label>
                    <input
                        type="text"
                        {...register('whatsapp_contact')}
                        placeholder="Ex: 5511999999999"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">Número completo com código do país e DDD (ex: 5511999999999).</p>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm font-medium"
                        disabled={loading || slugAvailable === false}
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    )
}
