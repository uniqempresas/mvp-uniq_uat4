export default function HeroSection() {
    return (
        <section className="relative rounded-xl overflow-hidden mb-12 h-[420px] bg-gradient-to-br from-primary to-primary-hover group mx-4 md:mx-0">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative h-full flex flex-col justify-center px-6 md:px-12 text-white max-w-2xl">
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-4 w-fit">
                    Coleção Primavera 2024
                </span>
                <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6">
                    Renove seu estilo com ofertas exclusivas.
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 font-medium">
                    Até 60% de desconto em marcas selecionadas e frete grátis para todo o país.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-white text-primary px-8 py-4 rounded-full font-extrabold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                        Ver Ofertas
                    </button>
                    <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-extrabold text-lg hover:bg-white hover:text-primary transition-all">
                        Saiba mais
                    </button>
                </div>
            </div>

            {/* Decorative image element - Visible only on large screens */}
            <div
                className="absolute right-0 top-0 h-full w-1/2 bg-cover bg-center hidden lg:block mask-linear-fade"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop')",
                    maskImage: 'linear-gradient(to right, transparent, black 20%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%)'
                }}
            />
        </section>
    )
}
