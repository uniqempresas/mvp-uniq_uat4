import type { UseFormReturn } from 'react-hook-form'
import type { StoreData } from '../../../../services/storeService'
import { useState } from 'react'
import { storeService } from '../../../../services/storeService'

interface Props {
    form: UseFormReturn<StoreData>
}

export default function StoreIdentitySection({ form }: Props) {
    const { register, watch, setValue } = form
    const [uploading, setUploading] = useState(false)
    const logoUrl = watch('logo_url')

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        try {
            setUploading(true)
            const file = e.target.files[0]
            const url = await storeService.uploadStoreAsset(file)
            setValue('logo_url', url, { shouldDirty: true })
        } catch (error) {
            console.error('Error uploading logo:', error)
            alert('Erro ao fazer upload da logo')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Identidade da Loja</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Como sua marca aparece para os compradores.</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                    Perfil Ativo
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Logo Upload */}
                <div className="md:col-span-4 flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer">
                        <label className="cursor-pointer block">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoUpload}
                                disabled={uploading}
                            />
                            <div className={`size-32 rounded-full bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden hover:border-primary transition-colors ${uploading ? 'opacity-50' : ''}`}>
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-gray-400 text-4xl group-hover:text-primary transition-colors">
                                        add_a_photo
                                    </span>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md border border-gray-100 dark:border-gray-600">
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">
                                    edit
                                </span>
                            </div>
                        </label>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Logo da Empresa</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {uploading ? 'Enviando...' : 'JPG, PNG ou GIF. Max 2MB.'}
                        </p>
                    </div>
                </div>

                {/* Basic Inputs */}
                <div className="md:col-span-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome Fantasia</label>
                            <input
                                {...register('nome_fantasia')}
                                className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-primary text-sm shadow-sm transition-all text-gray-900 dark:text-white"
                                placeholder="Ex: Minha Loja"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug (URL)</label>
                            <div className="relative">
                                <input
                                    {...register('slug', {
                                        pattern: {
                                            value: /^[a-z0-9-]+$/,
                                            message: 'Use apenas letras minúsculas, números e hífens'
                                        }
                                    })}
                                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-primary text-sm shadow-sm transition-all pl-2"
                                    type="text"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Identificador único na URL da loja.</p>
                            {form.formState.errors.slug && (
                                <p className="text-xs text-red-500 mt-1">{form.formState.errors.slug.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slogan Curto</label>
                        <input
                            {...register('store_config.slogan' as any)}
                            className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-primary text-sm shadow-sm transition-all text-gray-900 dark:text-white"
                            placeholder="Ex: Inovação para o seu dia a dia"
                            type="text"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descrição da Empresa</label>
                        <textarea
                            {...register('store_config.description' as any)}
                            className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-primary text-sm shadow-sm transition-all text-gray-900 dark:text-white"
                            placeholder="Conte um pouco sobre sua história e missão..."
                            rows={4}
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-xs text-gray-400">
                                {(watch('store_config' as any)?.description?.length || 0)}/500 caracteres
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
