
interface Props {
    formData: any
    updateFormData: (data: any) => void
    onSubmit: () => void
    onBack: () => void
    loading: boolean
}

export default function Step3Config({ formData, updateFormData, onSubmit, onBack, loading }: Props) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.termsAgreed) {
            alert('Você deve concordar com os Termos de Serviço')
            return
        }
        onSubmit()
    }

    const toggleModule = (moduleKey: string) => {
        updateFormData({
            modules: {
                ...formData.modules,
                [moduleKey]: !formData.modules[moduleKey]
            }
        })
    }

    const modules = [
        { key: 'sales', label: 'Vendas & PDV', icon: 'point_of_sale', default: true },
        { key: 'stock', label: 'Estoque', icon: 'inventory_2', default: true },
        { key: 'finance', label: 'Financeiro', icon: 'account_balance', default: false },
        { key: 'fiscal', label: 'Fiscal', icon: 'receipt_long', default: false },
    ]

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-input-text dark:text-white">Configuração</h2>
                <p className="text-input-text/70 dark:text-gray-300 text-base">Selecione os módulos que deseja utilizar.</p>
            </div>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-input-text dark:text-gray-200">Módulos de Interesse</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {modules.map(mod => (
                            <label key={mod.key} className="flex items-center gap-3 p-3 rounded-xl border border-input-border hover:bg-background-light dark:hover:bg-background-dark/30 cursor-pointer transition-colors group">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox h-5 w-5 rounded border-2 border-input-border text-primary focus:ring-0 focus:ring-offset-0 focus:border-primary checked:bg-primary checked:border-primary bg-transparent transition-all"
                                    checked={formData.modules[mod.key]}
                                    onChange={() => toggleModule(mod.key)}
                                />
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-brand-teal group-hover:text-primary transition-colors">{mod.icon}</span>
                                    <span className="text-sm font-medium text-input-text dark:text-gray-200">{mod.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="custom-checkbox mt-1 h-5 w-5 rounded border-2 border-input-border text-primary focus:ring-0 focus:ring-offset-0 focus:border-primary checked:bg-primary checked:border-primary bg-transparent transition-all"
                            checked={formData.termsAgreed}
                            onChange={(e) => updateFormData({ termsAgreed: e.target.checked })}
                        />
                        <span className="text-sm text-input-text/70 dark:text-gray-300">Concordo com os Termos de Serviço e Política de Privacidade da UNIQ.</span>
                    </label>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-2 border-t border-input-border/50">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={loading}
                        className="flex-1 h-12 rounded-xl border border-transparent text-input-text/70 hover:text-input-text font-bold text-base hover:bg-background-light dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                        Voltar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                        ) : (
                            <>
                                <span>Concluir Configuração</span>
                                <span className="material-symbols-outlined text-sm">check</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
