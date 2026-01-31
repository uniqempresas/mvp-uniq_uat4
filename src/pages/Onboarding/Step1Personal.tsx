import { useState } from 'react'
import { formatCPF, validateCPF, validateEmail, validatePassword } from '../../utils/validators'
import { ValidationMessages } from '../../utils/errorMessages'

interface Props {
    formData: any
    updateFormData: (data: any) => void
    onNext: () => void
}

export default function Step1Personal({ formData, updateFormData, onNext }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: Record<string, string> = {}

        // Validar campos obrigatórios
        if (!formData.fullName?.trim()) {
            newErrors.fullName = ValidationMessages.FIELD_REQUIRED
        }

        if (!formData.email?.trim()) {
            newErrors.email = ValidationMessages.FIELD_REQUIRED
        } else if (!validateEmail(formData.email)) {
            newErrors.email = ValidationMessages.EMAIL_INVALID
        }

        if (!formData.cpf?.trim()) {
            newErrors.cpf = ValidationMessages.FIELD_REQUIRED
        } else if (!validateCPF(formData.cpf)) {
            newErrors.cpf = ValidationMessages.CPF_INVALID
        }

        if (!formData.password) {
            newErrors.password = ValidationMessages.FIELD_REQUIRED
        } else {
            const passwordValidation = validatePassword(formData.password)
            if (!passwordValidation.valid) {
                newErrors.password = passwordValidation.message || ValidationMessages.PASSWORD_WEAK
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = ValidationMessages.FIELD_REQUIRED
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = ValidationMessages.PASSWORD_MISMATCH
        }

        // Se houver erros, exibe e para
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            // Scroll para o primeiro erro
            const firstErrorField = Object.keys(newErrors)[0]
            const element = document.querySelector(`[name="${firstErrorField}"]`)
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }

        // Limpa erros e avança
        setErrors({})
        onNext()
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-input-text dark:text-white">Criar sua Conta</h2>
                <p className="text-input-text/70 dark:text-gray-300 text-base">Informe seus dados pessoais para começar.</p>
            </div>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-input-text dark:text-gray-200">Nome Completo</label>
                    <div className="relative">
                        <input
                            name="fullName"
                            className={`w-full h-12 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-input-border'} bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                            placeholder="Seu nome completo"
                            type="text"
                            value={formData.fullName}
                            onChange={e => { updateFormData({ fullName: e.target.value }); setErrors(prev => ({ ...prev, fullName: '' })) }}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-input-placeholder">
                            <span className="material-symbols-outlined text-xl">badge</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-input-text dark:text-gray-200">E-mail</label>
                        <div className="relative">
                            <input
                                name="email"
                                className={`w-full h-12 rounded-xl border ${errors.email ? 'border-red-500' : 'border-input-border'} bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                                placeholder="seu@email.com"
                                type="email"
                                value={formData.email}
                                onChange={e => { updateFormData({ email: e.target.value }); setErrors(prev => ({ ...prev, email: '' })) }}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1 absolute -bottom-6">{errors.email}</p>}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-input-placeholder">
                                <span className="material-symbols-outlined text-xl">mail</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-input-text dark:text-gray-200">CPF</label>
                        <div className="relative">
                            <input
                                name="cpf"
                                className={`w-full h-12 rounded-xl border ${errors.cpf ? 'border-red-500' : 'border-input-border'} bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                                placeholder="000.000.000-00"
                                type="text"
                                value={formData.cpf}
                                onChange={e => { updateFormData({ cpf: formatCPF(e.target.value) }); setErrors(prev => ({ ...prev, cpf: '' })) }}
                                maxLength={14}
                            />
                            {errors.cpf && <p className="text-red-500 text-sm mt-1 absolute -bottom-6">{errors.cpf}</p>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-input-text dark:text-gray-200">Senha</label>
                        <div className="relative">
                            <input
                                name="password"
                                className={`w-full h-12 rounded-xl border ${errors.password ? 'border-red-500' : 'border-input-border'} bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                                placeholder="••••••••"
                                type="password"
                                value={formData.password}
                                onChange={e => { updateFormData({ password: e.target.value }); setErrors(prev => ({ ...prev, password: '', confirmPassword: '' })) }}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1 absolute -bottom-6">{errors.password}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-input-text dark:text-gray-200">Confirmar Senha</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                className={`w-full h-12 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-input-border'} bg-background-light dark:bg-background-dark/50 text-input-text dark:text-white placeholder:text-input-placeholder px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                                placeholder="••••••••"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={e => { updateFormData({ confirmPassword: e.target.value }); setErrors(prev => ({ ...prev, confirmPassword: '' })) }}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 absolute -bottom-6">{errors.confirmPassword}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-2">
                    <button className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
                        <span>Próximo Passo</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
