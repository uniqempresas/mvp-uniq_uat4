import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/update-password'
            })

            if (error) throw error

            setMessage('Verifique seu email para redefinir sua senha.')
        } catch (err: any) {
            console.error("Reset password failed:", err)
            setError(err.message || 'Erro ao solicitar recuperação de senha.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div>
            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 z-10 relative">
                <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm w-full max-w-[480px] p-8 sm:p-10 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-card">
                    <div className="flex items-center gap-2.5 mb-8">
                        <div className="w-auto h-8 flex items-center justify-center">
                            <img src="/logo.png" alt="UNIQ Logo" className="h-8 object-contain" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                        Recuperar Senha
                    </h1>

                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[360px] mx-auto mb-8">
                        Insira seu e-mail para receber um link de redefinição de senha.
                    </p>

                    <div className="w-full">
                        <form className="flex flex-col gap-4 text-left" onSubmit={handleResetPassword}>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">E-mail</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full h-11 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="seu@email.com"
                                    />
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                        <span className="material-symbols-outlined text-xl">mail</span>
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900/50 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                                     <span className="material-symbols-outlined text-lg">check_circle</span>
                                     <span>{message}</span>
                                </div>
                            )}

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex flex-col gap-3 mt-2">
                                <button
                                    type="submit"
                                    disabled={loading || !!message}
                                    className="w-full h-11 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                                    ) : (
                                        <>
                                            <span>Enviar Link</span>
                                            <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-0.5 transition-transform">send</span>
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                                    >
                                        Voltar para o Login
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

             <footer className="py-6 text-center z-10">
                <div className="flex flex-col gap-2 items-center justify-center">
                    <p className="text-gray-400 text-xs">© 2024 UNIQ. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    )
}
