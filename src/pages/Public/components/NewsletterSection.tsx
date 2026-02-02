export default function NewsletterSection() {
    return (
        <section className="mt-16 mb-8 bg-white dark:bg-gray-800 rounded-xl p-10 text-center border border-gray-100 dark:border-gray-700 mx-4 md:mx-0 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-primary mb-4">mail</span>
            <h3 className="text-3xl font-bold mb-2">Fique por dentro das novidades</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                Cadastre seu e-mail para receber cupons exclusivos e alertas de promoções em primeira mão.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                    className="flex-1 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-900 border-none focus:ring-2 focus:ring-primary/50 text-sm outline-none"
                    placeholder="Seu melhor e-mail"
                    type="email"
                />
                <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    Assinar
                </button>
            </div>
        </section>
    )
}
