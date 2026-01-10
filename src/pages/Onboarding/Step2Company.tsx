import { formatCpfCnpj, formatPhone, formatCep } from '../../utils/format'

interface Props {
    formData: any
    updateFormData: (data: any) => void
    onNext: () => void
    onBack: () => void
}

export default function Step2Company({ formData, updateFormData, onNext, onBack }: Props) {
    const handleCepBlur = async () => {
        const cep = formData.address.cep.replace(/\D/g, '')
        if (cep.length !== 8) return

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()

            if (!data.erro) {
                updateFormData({
                    address: {
                        ...formData.address,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        uf: data.uf,
                        ibge: data.ibge,
                        // Keep user-entered number/complement if any
                        numero: formData.address.numero,
                        complemento: formData.address.complemento
                    }
                })
            } else {
                alert('CEP não encontrado.')
            }
        } catch (error) {
            console.error('Error fetching CEP:', error)
            alert('Erro ao buscar CEP. Preencha o endereço manualmente.')
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.companyName || !formData.cnpj || !formData.phone) {
            alert('Preencha os campos obrigatórios (Nome, CNPJ, Telefone)')
            return
        }
        if (!formData.address.cep || !formData.address.logradouro || !formData.address.numero) {
            alert('Preencha o endereço completo (CEP, rua, número)')
            return
        }
        onNext()
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-input-text dark:text-white">Dados da Empresa</h2>
                <p className="text-input-text/70 dark:text-gray-300 text-base">Detalhes do negócio para personalizar seu dashboard.</p>
            </div>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-input-text dark:text-gray-200">Nome da Empresa</label>
                    <div className="relative">
                        <input
                            className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Ex: Minha Loja Ltda"
                            type="text"
                            value={formData.companyName}
                            onChange={e => updateFormData({ companyName: e.target.value })}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-input-placeholder">
                            <span className="material-symbols-outlined text-xl">store</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-input-text dark:text-gray-200">CNPJ</label>
                        <div className="relative">
                            <input
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="00.000.000/0000-00"
                                type="text"
                                value={formData.cnpj}
                                onChange={e => updateFormData({ cnpj: formatCpfCnpj(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-input-text dark:text-gray-200">Telefone</label>
                        <div className="relative">
                            <input
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="(00) 00000-0000"
                                type="text"
                                value={formData.phone}
                                onChange={e => updateFormData({ phone: formatPhone(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-input-text dark:text-gray-200">Ramo de Atuação</label>
                        <div className="relative">
                            <select
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white px-4 py-3 text-base appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
                                value={formData.segment}
                                onChange={e => updateFormData({ segment: e.target.value })}
                            >
                                <option disabled value="">Selecione</option>
                                <option value="retail">Varejo</option>
                                <option value="service">Serviços</option>
                                <option value="industry">Indústria</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-input-text pointer-events-none">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-input-text dark:text-gray-200">Nº de Funcionários</label>
                        <div className="relative">
                            <select
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white px-4 py-3 text-base appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
                                value={formData.employees}
                                onChange={e => updateFormData({ employees: e.target.value })}
                            >
                                <option disabled value="">Selecione</option>
                                <option value="1-5">1-5</option>
                                <option value="6-20">6-20</option>
                                <option value="21-50">21-50</option>
                                <option value="50+">50+</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-input-text pointer-events-none">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4 pt-2 border-t border-input-border/50">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-input-text dark:text-gray-200">CEP</label>
                        <div className="relative">
                            <input
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="00000-000"
                                type="text"
                                value={formData.address.cep}
                                onChange={e => updateFormData({ address: { ...formData.address, cep: formatCep(e.target.value) } })}
                                onBlur={handleCepBlur}
                            />
                            {/* Optional: Add spinner if loading */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="sm:col-span-2 flex flex-col gap-2">
                            <label className="text-sm font-semibold text-input-text dark:text-gray-200">Logradouro</label>
                            <input
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text/70 dark:text-gray-400 px-4 py-3 text-base focus:outline-none"
                                placeholder="Endereço"
                                type="text"
                                value={formData.address.logradouro}
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-input-text dark:text-gray-200">Número</label>
                            <input
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="Nº"
                                type="text"
                                value={formData.address.numero}
                                onChange={e => updateFormData({ address: { ...formData.address, numero: e.target.value } })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-input-text dark:text-gray-200">Complemento</label>
                            <input
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="Apto, Bloco, etc."
                                type="text"
                                value={formData.address.complemento}
                                onChange={e => updateFormData({ address: { ...formData.address, complemento: e.target.value } })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-input-text dark:text-gray-200">Bairro</label>
                            <input
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text/70 dark:text-gray-400 px-4 py-3 text-base focus:outline-none"
                                placeholder="Bairro"
                                type="text"
                                value={formData.address.bairro}
                                onChange={e => updateFormData({ address: { ...formData.address, bairro: e.target.value } })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="sm:col-span-2 flex flex-col gap-2">
                            <label className="text-sm font-semibold text-input-text dark:text-gray-200">Cidade</label>
                            <input
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text/70 dark:text-gray-400 px-4 py-3 text-base focus:outline-none"
                                placeholder="Cidade"
                                type="text"
                                value={formData.address.cidade}
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-input-text dark:text-gray-200">UF</label>
                            <input
                                className="w-full h-12 rounded-xl border border-input-border bg-background-light dark:bg-background-dark/50 text-input-text/70 dark:text-gray-400 px-4 py-3 text-base focus:outline-none"
                                placeholder="UF"
                                type="text"
                                value={formData.address.uf}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-2 border-t border-input-border/50">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 h-12 rounded-xl border border-transparent text-input-text/70 hover:text-input-text font-bold text-base hover:bg-background-light dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
                    >
                        Voltar
                    </button>
                    <button className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
                        <span>Próximo Passo</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
