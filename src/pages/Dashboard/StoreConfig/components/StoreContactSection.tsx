import type { UseFormReturn } from 'react-hook-form'
import type { StoreData } from '../../../../services/storeService'

interface Props {
    form: UseFormReturn<StoreData>
}

export default function StoreContactSection({ form }: Props) {
    const { register } = form

    return (
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Contato & Suporte</h2>
            <p className="text-sm text-gray-500 mb-6">Informações visíveis para compradores em caso de dúvidas.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email de Suporte</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">mail</span>
                        <input
                            {...register('store_config.support_email' as any)}
                            className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-primary text-sm shadow-sm transition-all pl-10 text-gray-900 dark:text-white"
                            placeholder="suporte@empresa.com"
                            type="email"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Telefone / WhatsApp</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">call</span>
                        <input
                            {...register('store_config.whatsapp_contact' as any)}
                            className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-primary text-sm shadow-sm transition-all pl-10 text-gray-900 dark:text-white"
                            placeholder="(00) 00000-0000"
                            type="tel"
                        />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Website</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">language</span>
                        <input
                            {...register('store_config.website' as any)}
                            className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-primary text-sm shadow-sm transition-all pl-10 text-gray-900 dark:text-white"
                            placeholder="https://www.suaempresa.com.br"
                            type="url"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
