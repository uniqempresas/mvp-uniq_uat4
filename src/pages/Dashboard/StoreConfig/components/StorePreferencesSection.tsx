import type { UseFormReturn } from 'react-hook-form'
import type { StoreData } from '../../../../services/storeService'

interface Props {
    form: UseFormReturn<StoreData>
}

export default function StorePreferencesSection({ form }: Props) {
    const { register } = form

    return (
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 mb-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Preferências de Notificação</h2>
            <p className="text-sm text-gray-500 mb-6">Controle quando e como você será alertado.</p>

            <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                <div className="flex items-center justify-between py-2">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Novos Pedidos</p>
                        <p className="text-xs text-gray-500">Receba um alerta quando uma nova compra for realizada.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('store_config.notifications.new_orders' as any)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between py-2 pt-4">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Perguntas de Clientes</p>
                        <p className="text-xs text-gray-500">Notificações sobre dúvidas nos produtos.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('store_config.notifications.questions' as any)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between py-2 pt-4">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Relatórios Semanais</p>
                        <p className="text-xs text-gray-500">Resumo de desempenho por email.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('store_config.notifications.reports' as any)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </div>
    )
}
