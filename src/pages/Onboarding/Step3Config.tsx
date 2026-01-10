import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
    formData: any
    updateFormData: (data: any) => void
    onSubmit: () => void
    onBack: () => void
    loading: boolean
}

interface SystemModule {
    id: string
    nome: string
    icone: string
    descricao: string
}

export default function Step3Config({ formData, updateFormData, onSubmit, onBack, loading }: Props) {
    const [systemModules, setSystemModules] = useState<SystemModule[]>([])
    const [isLoadingModules, setIsLoadingModules] = useState(true)

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const { data, error } = await supabase
                    .from('unq_modulos_sistema')
                    .select('*')
                    .eq('status', 'active')
                    .order('nome')

                if (error) throw error
                setSystemModules(data || [])
            } catch (error) {
                console.error('Error fetching modules:', error)
            } finally {
                setIsLoadingModules(false)
            }
        }

        fetchModules()
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.termsAgreed) {
            alert('Você deve concordar com os Termos de Serviço')
            return
        }
        onSubmit()
    }

    const toggleModule = (moduleId: string) => {
        // Safe access
        const modules = formData?.modules || {}
        const currentVal = modules[moduleId]

        updateFormData({
            modules: {
                ...modules,
                [moduleId]: !currentVal
            }
        })
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-input-text dark:text-white">Configuração</h2>
                <p className="text-input-text/70 dark:text-gray-300 text-base">Selecione os módulos que deseja utilizar.</p>
            </div>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-input-text dark:text-gray-200">Módulos de Interesse</label>

                    {isLoadingModules ? (
                        <div className="flex items-center justify-center py-8">
                            <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {systemModules.map(mod => {
                                // We use the ID as the key. 
                                // Note: Previous hardcoded keys (sales, stock) won't match IDs.
                                // It's expected that the user starts with an empty selection or we'd need to map them.
                                // For now, we rely on the ID.
                                const isSelected = !!(formData?.modules?.[mod.id])

                                return (
                                    <label key={mod.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all group ${isSelected ? 'border-primary bg-primary/5' : 'border-input-border hover:bg-background-light dark:hover:bg-background-dark/30'}`}>
                                        <div className="mt-1">
                                            <input
                                                type="checkbox"
                                                className="custom-checkbox h-5 w-5 rounded border-2 border-input-border text-primary focus:ring-0 focus:ring-offset-0 focus:border-primary checked:bg-primary checked:border-primary bg-transparent transition-all"
                                                checked={isSelected}
                                                onChange={() => toggleModule(mod.id)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-brand-teal text-[20px]">{mod.icone || 'extension'}</span>
                                                <span className="text-sm font-bold text-input-text dark:text-gray-200">{mod.nome}</span>
                                            </div>
                                            {mod.descricao && (
                                                <p className="text-xs text-input-text/60 dark:text-gray-400 leading-snug">{mod.descricao}</p>
                                            )}
                                        </div>
                                    </label>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="custom-checkbox mt-1 h-5 w-5 rounded border-2 border-input-border text-primary focus:ring-0 focus:ring-offset-0 focus:border-primary checked:bg-primary checked:border-primary bg-transparent transition-all"
                            checked={formData.termsAgreed}
                            onChange={(e) => updateFormData({ termsAgreed: e.target.checked })}
                        />
                        <span className="text-sm text-input-text/70 dark:text-gray-400">
                            Concordo com os Termos de Serviço e Política de Privacidade da UNIQ.
                        </span>
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
