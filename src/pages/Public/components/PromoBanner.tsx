export default function PromoBanner() {
    return (
        <section className="mt-16 bg-background-dark text-white rounded-xl overflow-hidden flex flex-col md:flex-row items-center relative mx-4 md:mx-0">
            <div className="p-8 md:p-12 md:w-1/2 relative z-10">
                <h3 className="text-3xl font-bold mb-4">Quer vender no UNIQ?</h3>
                <p className="text-gray-400 text-lg mb-8">
                    Traga sua marca para o nosso marketplace e alcance milhares de novos clientes diariamente.
                </p>
                <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/20">
                    Seja um Vendedor
                </button>
            </div>
            <div
                className="md:w-1/2 h-64 md:h-auto min-h-[300px] w-full bg-cover bg-center opacity-50 relative"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-background-dark/90 md:to-background-dark"></div>
            </div>
        </section>
    )
}
