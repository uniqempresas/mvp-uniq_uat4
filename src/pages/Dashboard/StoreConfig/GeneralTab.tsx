import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { storeService, type StoreData } from '../../../services/storeService'
import StoreIdentitySection from './components/StoreIdentitySection'
import StoreContactSection from './components/StoreContactSection'
import StoreOperationsSection from './components/StoreOperationsSection'
import StorePreferencesSection from './components/StorePreferencesSection'
import toast from 'react-hot-toast'

export default function GeneralTab() {
    const [loading, setLoading] = useState(true)
    const form = useForm<StoreData>({
        defaultValues: {
            store_config: {
                shipping_methods: ['Correios (PAC/Sedex)'], // Default
                notifications: {
                    new_orders: true,
                    questions: true,
                    reports: false
                }
            }
        }
    })
    const { handleSubmit, reset } = form

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const data = await storeService.getStoreConfig()
            if (data) {
                // Ensure default values for deep objects if they are missing
                const config = data.store_config || {}
                const notifications = config.notifications || {
                    new_orders: true,
                    questions: true,
                    reports: false
                }
                const shipping = config.shipping_methods || ['Correios (PAC/Sedex)']

                reset({
                    ...data,
                    store_config: {
                        ...config,
                        shipping_methods: shipping,
                        notifications: notifications
                    }
                })
            }
        } catch (error) {
            console.error('Error loading store config:', error)
            toast.error('Erro ao carregar configurações')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data: StoreData) => {
        try {
            const loadingToast = toast.loading('Salvando alterações...')

            // Clean up: ensure empty strings are null if needed, 
            // but StoreData types are mostly string | undefined. 
            // Send everything.
            await storeService.updateStoreConfig(data)

            toast.dismiss(loadingToast)
            toast.success('Configurações salvas com sucesso!')
        } catch (error) {
            console.error('Error saving store config:', error)
            toast.error('Erro ao salvar configurações')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-32 relative">
            <div className="space-y-8">
                <StoreIdentitySection form={form} />
                <StoreContactSection form={form} />
                <StoreOperationsSection form={form} />
                <StorePreferencesSection form={form} />
            </div>

            {/* Sticky Footer - Modern Soft */}
            <div className="fixed bottom-0 left-0 right-0 md:left-20 bg-white/80 dark:bg-[#1a2e1f]/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 p-6 z-20 flex justify-end gap-4 px-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button
                    type="button"
                    className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    onClick={() => loadData()}
                >
                    Descartar Alterações
                </button>
                <button
                    type="submit"
                    className="px-8 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2 transform active:scale-[0.98]"
                >
                    <span className="material-symbols-outlined text-xl">check</span>
                    Salvar Alterações
                </button>
            </div>
        </form>
    )
}
