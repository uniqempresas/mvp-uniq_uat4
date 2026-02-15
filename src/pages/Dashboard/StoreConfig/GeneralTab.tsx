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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24 relative">
            <StoreIdentitySection form={form} />
            <StoreContactSection form={form} />
            <StoreOperationsSection form={form} />
            <StorePreferencesSection form={form} />

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 md:left-20 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 p-4 z-10 flex justify-end gap-3 px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                    type="button"
                    className="px-6 py-2.5 rounded-lg border border-secondary dark:border-gray-600 text-secondary dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => loadData()} // Reset functionality
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-md shadow-primary/20 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">save</span>
                    Salvar Alterações
                </button>
            </div>
        </form>
    )
}
