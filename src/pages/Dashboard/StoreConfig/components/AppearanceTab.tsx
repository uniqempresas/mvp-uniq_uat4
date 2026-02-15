import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { storeService } from '../../../../services/storeService'

interface ThemeConfig {
    primary_color: string
    secondary_color: string
    font_family?: string
    border_radius?: string
}

interface AppearanceForm {
    theme: ThemeConfig
}

export default function AppearanceTab({ storeConfig, onUpdate }: { storeConfig: any, onUpdate: () => void }) {
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, watch, reset } = useForm<AppearanceForm>({
        defaultValues: {
            theme: {
                primary_color: storeConfig?.appearance?.theme?.primary_color || '#10b77f',
                secondary_color: storeConfig?.appearance?.theme?.secondary_color || '#244E5F',
                font_family: storeConfig?.appearance?.theme?.font_family || 'Plus Jakarta Sans',
                border_radius: storeConfig?.appearance?.theme?.border_radius || '1rem'
            }
        }
    })

    // Sincronizar formulário quando storeConfig carregar ou mudar
    useEffect(() => {
        if (storeConfig?.appearance?.theme) {
            reset({
                theme: {
                    primary_color: storeConfig.appearance.theme.primary_color || '#10b77f',
                    secondary_color: storeConfig.appearance.theme.secondary_color || '#0d1117',
                    font_family: storeConfig.appearance.theme.font_family || 'Inter, sans-serif',
                    border_radius: storeConfig.appearance.theme.border_radius || '1rem'
                }
            })
        }
    }, [storeConfig, reset])

    const primaryColor = watch('theme.primary_color')
    const secondaryColor = watch('theme.secondary_color')

    const onSubmit = async (data: AppearanceForm) => {
        setLoading(true)
        try {
            const updatedConfig = {
                ...storeConfig,
                appearance: {
                    ...storeConfig?.appearance,
                    theme: data.theme
                }
            }

            await storeService.updateStoreConfig(updatedConfig)
            onUpdate()
            alert('Configurações salvas!')
        } catch (error) {
            console.error('Error:', error)
            alert('Erro ao salvar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Aparência da Loja</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl">
                    <h3 className="font-bold mb-4">Preview</h3>
                    <div
                        className="p-8 rounded-xl"
                        style={{ backgroundColor: primaryColor, color: 'white' }}
                    >
                        <h4 className="text-3xl font-bold mb-2">Sua Loja</h4>
                        <button
                            type="button"
                            className="px-6 py-3 rounded-full font-bold"
                            style={{ backgroundColor: secondaryColor }}
                        >
                            Ver Produtos
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl">
                    <h3 className="font-bold mb-4">Cores</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2">Cor Primária</label>
                            <input
                                type="color"
                                {...register('theme.primary_color')}
                                className="size-12 rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Cor Secundária</label>
                            <input
                                type="color"
                                {...register('theme.secondary_color')}
                                className="size-12 rounded"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
                >
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </form>
        </div>
    )
}
