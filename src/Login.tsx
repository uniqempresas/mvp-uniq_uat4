// import { supabase } from './lib/supabase'

export default function Login() {
    const handleLogin = async () => {
        // Basic Supabase Auth logic could be added here
        console.log("Login clicked")
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

                    <div className="w-full flex flex-col gap-4">
                        <button
                            onClick={handleLogin}
                            className="w-full h-11 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn"
                        >
                            <span>Começar Agora</span>
                            <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-0.5 transition-transform">arrow_forward</span>
                        </button>
                        <button className="w-full h-10 bg-transparent text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg hover:text-primary dark:hover:text-primary transition-colors">
                            Não tem uma conta? <span className="font-bold text-primary">Criar Conta</span>
                        </button>
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
