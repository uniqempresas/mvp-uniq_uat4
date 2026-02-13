import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/dashboard')
            }
        })
    }, [navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            // Login successful
            console.log("Logged in:", data.user)
            // alert('Login realizado com sucesso!') 
            navigate('/dashboard')

        } catch (err: any) {
            console.error("Login failed:", err)
            setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.')
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

                    <div className="w-full aspect-[16/9] mb-8 rounded-lg bg-gradient-to-b from-green-50 to-white dark:from-gray-800 dark:to-gray-900 border border-green-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 rounded-full bg-primary/10 blur-xl"></div>

                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center border-4 border-white dark:border-gray-700 relative z-10 overflow-hidden">
                                <img alt="Avatar da Mel" className="w-full h-full object-cover" src="/avatar.png" />
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-20 -translate-y-10 w-8 h-8 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-700 animate-bounce" style={{ animationDuration: '3s' }}>
                                <span className="material-symbols-outlined text-gray-400 text-sm">pie_chart</span>
                            </div>

                            <div className="absolute top-1/2 right-1/2 translate-x-20 translate-y-6 w-8 h-8 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-700 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}>
                                <span className="material-symbols-outlined text-gray-400 text-sm">groups</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                        Bem-vindo ao UNIQ!
                    </h1>

                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[360px] mx-auto mb-8">
                        O ecossistema completo para gerenciar e expandir sua micro ou pequena empresa. Simplifique seu dia a dia.
                    </p>

                    <div className="w-full">
                        <form className="flex flex-col gap-4 text-left" onSubmit={handleLogin}>
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

                            <div>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Senha</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full h-11 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                        <span className="material-symbols-outlined text-xl">lock</span>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-1">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/forgot-password')}
                                        className="text-xs text-primary hover:underline font-medium"
                                    >
                                        Esqueci minha senha
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex flex-col gap-3 mt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                                    ) : (
                                        <>
                                            <span>Entrar</span>
                                            <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-0.5 transition-transform">login</span>
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/onboarding')}
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                                    >
                                        Não tem uma conta? <span className="text-primary font-bold">Criar agora</span>
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
                    <div className="flex gap-4 text-xs text-gray-400">
                        <a className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors" href="#">Termos</a>
                        <span className="w-1 h-1 bg-gray-300 rounded-full my-auto"></span>
                        <a className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors" href="#">Privacidade</a>
                        <span className="w-1 h-1 bg-gray-300 rounded-full my-auto"></span>
                        <a className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors" href="#">Ajuda</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
