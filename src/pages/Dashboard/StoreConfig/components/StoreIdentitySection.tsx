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
        <div className="bg-white dark:bg-[#1a2e1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Identidade Visual</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Defina como sua marca será vista pelos clientes.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                    <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">Loja Ativa</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Logo Upload Section - Modern Soft */}
                <div className="lg:col-span-4 flex flex-col items-center justify-start space-y-4">
                    <div className="relative group w-full max-w-[240px] aspect-square mx-auto">
                        <label className="cursor-pointer block w-full h-full">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoUpload}
                                disabled={uploading}
                            />
                            <div className={`w-full h-full rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5 ${uploading ? 'opacity-50' : ''}`}>
                                {logoUrl ? (
                                    <div className="h-full w-full relative">
                                        <div className="absolute inset-0 bg-black/40 transition-opacity opacity-0 group-hover:opacity-100 flex items-center justify-center z-10 backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-white text-3xl">edit</span>
                                        </div>
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="size-16 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-300 text-3xl group-hover:text-primary transition-colors">
                                                add_photo_alternate
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Upload Logo</p>
                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 2MB)</p>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                {/* Form Fields - Soft & Rounded */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">Nome da Empresa</label>
                            <div className="relative">
                                <input
                                    {...register('nome_fantasia')}
                                    className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none px-4 pl-12 text-sm font-medium transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                    placeholder="Ex: Minha Loja Inc."
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <span className="material-symbols-outlined text-xl">store</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">Endereço Virtual (Slug)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">/c/</span>
                                <input
                                    {...register('slug')}
                                    className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none pl-11 pr-4 text-sm font-medium transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                    placeholder="minha-loja"
                                />
                            </div>
                            {form.formState.errors.slug && (
                                <p className="text-xs text-red-500 font-medium ml-1 mt-1">{form.formState.errors.slug.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">Slogan ou Pitch Curto</label>
                        <div className="relative">
                            <input
                                {...register('store_config.slogan' as any)}
                                className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none px-4 pl-12 text-sm font-medium transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                placeholder="A frase que define seu negócio"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <span className="material-symbols-outlined text-xl">campaign</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">Sobre a Empresa</label>
                        <div className="relative">
                            <textarea
                                {...register('store_config.description' as any)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none p-4 text-sm font-medium transition-all text-gray-900 dark:text-white placeholder:text-gray-400 min-h-[140px] resize-none"
                                placeholder="Conte a história da sua marca, missão e valores..."
                            />
                            <div className="absolute bottom-4 right-4">
                                <span className={`text-xs font-medium ${(watch('store_config' as any)?.description?.length || 0) > 400 ? 'text-amber-500' : 'text-gray-400'}`}>
                                    {(watch('store_config' as any)?.description?.length || 0)}/500
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
