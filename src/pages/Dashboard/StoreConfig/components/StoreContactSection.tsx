import type { UseFormReturn } from 'react-hook-form'
import type { StoreData } from '../../../../services/storeService'

interface Props {
    form: UseFormReturn<StoreData>
}

export default function StoreContactSection({ form }: Props) {
    const { register } = form

    return (
        <div className="bg-white dark:bg-[#1a2e1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 transition-all duration-300">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Canais de Atendimento</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Facilite o contato dos seus clientes com sua loja.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">Email de Suporte</label>
                        <div className="relative group">
                            <input
                                {...register('store_config.support_email' as any)}
                                className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none px-4 pl-12 text-sm font-medium transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                placeholder="suporte@sualoja.com"
                                type="email"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-xl">mail</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">WhatsApp / Telefone</label>
                        <div className="relative group">
                            <input
                                {...register('store_config.whatsapp_contact' as any)}
                                className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none px-4 pl-12 text-sm font-medium transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                placeholder="(11) 99999-9999"
                                type="tel"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-xl">call</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">Website Oficial</label>
                        <div className="relative group">
                            <input
                                {...register('store_config.website' as any)}
                                className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none px-4 pl-12 text-sm font-medium transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                placeholder="https://www.sualoja.com.br"
                                type="url"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-xl">language</span>
                            </div>
                        </div>
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                            <span className="material-symbols-outlined text-blue-500 text-lg">info</span>
                            <p className="text-xs text-blue-600 dark:text-blue-300 font-medium pt-0.5">
                                Utilize <strong>https://</strong> para garantir a segurança e confiança dos seus clientes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
