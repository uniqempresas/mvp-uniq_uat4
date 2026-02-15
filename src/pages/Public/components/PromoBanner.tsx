export default function PromoBanner() {
    return (
        <section className="mt-16 rounded-xl overflow-hidden relative mx-4 md:mx-0">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-primary/30 flex flex-col md:flex-row items-center">
                <div className="p-8 md:p-12 md:w-2/3 relative z-10">
                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                        UNIQ Empresas
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Quer sua própria loja online?
                    </h3>
                    <p className="text-gray-400 text-base md:text-lg mb-8 max-w-lg">
                        Com a UNIQ Empresas você cria sua loja digital em minutos. Catálogo de produtos, pedidos via WhatsApp e tudo personalizado com a sua marca.
                    </p>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                    >
                        Criar Minha Loja
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </a>
                </div>

                {/* Decorative side */}
                <div className="md:w-1/3 h-48 md:h-auto md:min-h-[280px] w-full relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900/80 md:block hidden"></div>
                    <div className="text-center relative z-10 p-8">
                        <div className="size-20 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-primary">storefront</span>
                        </div>
                        <p className="text-gray-300 text-sm font-medium">Mais de 100 lojas já confiam na UNIQ</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
