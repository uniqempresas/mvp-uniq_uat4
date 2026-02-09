import { useState } from 'react'
import MobileInput from '../Mobile/MobileInput'
import { useToast } from '../../hooks/useToast'
import Toast from '../Mobile/Toast'

interface TestMobileFormProps {
    isOpen: boolean
    onClose: () => void
}

/**
 * Formulário de TESTE para validar componentes mobile
 * Use este form para testar keyboards, toast e scroll automático
 * em device real antes de aplicar nos formulários principais
 */
export default function TestMobileForm({ isOpen, onClose }: TestMobileFormProps) {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        preco: ''
    })

    const { toast, showSuccess, showError, hideToast } = useToast()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Simula salvamento
        setTimeout(() => {
            showSuccess('Dados salvos com sucesso!')
            setTimeout(() => {
                setFormData({ nome: '', email: '', telefone: '', cpf: '', preco: '' })
                onClose()
            }, 1500)
        }, 500)
    }

    if (!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
                    <div className="p-4 border-b dark:border-slate-700 flex items-center justify-between">
                        <h3 className="font-bold text-lg">🧪 Teste Mobile Components</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg touch-optimized touch-feedback"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <MobileInput
                            type="text"
                            label="Nome"
                            name="nome"
                            value={formData.nome}
                            onChange={(val) => setFormData({ ...formData, nome: val })}
                            placeholder="João da Silva"
                            required
                        />

                        <MobileInput
                            type="email"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={(val) => setFormData({ ...formData, email: val })}
                            placeholder="email@exemplo.com"
                        />

                        <MobileInput
                            type="tel"
                            label="Telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={(val) => setFormData({ ...formData, telefone: val })}
                            placeholder="(00) 00000-0000"
                        />

                        <MobileInput
                            type="cpf"
                            label="CPF"
                            name="cpf"
                            value={formData.cpf}
                            onChange={(val) => setFormData({ ...formData, cpf: val })}
                            placeholder="000.000.000-00"
                            maxLength={14}
                        />

                        <MobileInput
                            type="currency"
                            label="Preço"
                            name="preco"
                            value={formData.preco}
                            onChange={(val) => setFormData({ ...formData, preco: val })}
                            placeholder="R$ 0,00"
                        />

                        <div className="pt-4 space-y-2">
                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium touch-optimized touch-feedback"
                            >
                                Testar Toast Success
                            </button>

                            <button
                                type="button"
                                onClick={() => showError('Teste de mensagem de erro')}
                                className="w-full px-4 py-3 bg-red-500 text-white rounded-lg font-medium touch-optimized touch-feedback"
                            >
                                Testar Toast Error
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg font-medium touch-optimized touch-feedback"
                            >
                                Cancelar
                            </button>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                            <p className="font-bold text-blue-900 dark:text-blue-100 mb-2">📱 O que testar no mobile:</p>
                            <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-xs">
                                <li>✓ Keyboard types (tel, email, numeric)</li>
                                <li>✓ Scroll automático ao focar input</li>
                                <li>✓ Toast aparece e desaparece</li>
                                <li>✓ Touch feedback nos botões</li>
                            </ul>
                        </div>
                    </form>
                </div>
            </div>

            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={hideToast}
            />
        </>
    )
}
