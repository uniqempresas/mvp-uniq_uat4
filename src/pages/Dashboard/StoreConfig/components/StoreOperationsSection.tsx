import type { UseFormReturn } from 'react-hook-form'
import type { StoreData } from '../../../../services/storeService'

interface Props {
    form: UseFormReturn<StoreData>
}

export default function StoreOperationsSection({ form }: Props) {
    const { register } = form

    return (
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Operacional</h2>
            <p className="text-sm text-gray-500 mb-6">Configurações de logística e recebimentos.</p>

            <div className="space-y-6">
                <div className="flex items-start justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-primary/30 transition-colors">
                    <div className="flex gap-4">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-900 dark:text-white">
                            <span className="material-symbols-outlined">local_shipping</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Método de Envio Padrão</h3>
                            <p className="text-xs text-gray-500 mt-1">Selecione como seus produtos serão despachados.</p>
                        </div>
                    </div>
                    {/* For MVP we just pick one mainly, or we could handle array. 
                        Design shows a single select. SPEC says string[]. 
                        Let's treat it as a single string for now or mapped to array [value] 
                     */}
                    {/* Temporarily simple select mapping to array logic could be complex in UI. 
                         Let's assume single selection for MVP based on UI design */}
                    <select
                        {...register('store_config.shipping_methods.0' as any)}
                        className="rounded-lg border-gray-200 dark:border-gray-700 text-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="Correios (PAC/Sedex)">Correios (PAC/Sedex)</option>
                        <option value="Transportadora Própria">Transportadora Própria</option>
                        <option value="Retirada na Loja">Retirada na Loja</option>
                    </select>
                </div>

                <div className="flex items-start justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-primary/30 transition-colors">
                    <div className="flex gap-4">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-900 dark:text-white">
                            <span className="material-symbols-outlined">account_balance</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Chave PIX (Padrão)</h3>
                            <p className="text-xs text-gray-500 mt-1">Chave para recebimento rápido de pedidos.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            {...register('store_config.pix_key' as any)}
                            className="text-sm border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-48 lg:w-64"
                            placeholder="Chave PIX"
                            type="text"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
