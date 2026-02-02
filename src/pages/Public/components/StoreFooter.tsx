export default function StoreFooter() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-16">
            <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-lg">auto_awesome</span>
                        </div>
                        <span className="text-lg font-extrabold tracking-tight">UNIQ Market</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                        O ecossistema completo para sua jornada de compras online. Segurança, rapidez e as melhores marcas.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="size-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined text-xl">share</span>
                        </a>
                        <a href="#" className="size-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined text-xl">public</span>
                        </a>
                        <a href="#" className="size-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined text-xl">camera</span>
                        </a>
                    </div>
                </div>
                <div>
                    <h5 className="font-bold mb-6">Categorias</h5>
                    <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                        <li><a href="#" className="hover:text-primary transition-colors">Moda</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Eletrônicos</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Casa e Jardim</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Beleza</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-6">Institucional</h5>
                    <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                        <li><a href="#" className="hover:text-primary transition-colors">Sobre a UNIQ</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Trabalhe Conosco</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Venda Conosco</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-6">Ajuda & Suporte</h5>
                    <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                        <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Rastreio de Pedido</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Devoluções</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-[1280px] mx-auto px-6 mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                <p>© 2024 UNIQ Ecosystem. Todos os direitos reservados.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
                    <a href="#" className="hover:text-primary transition-colors">Cookies</a>
                </div>
            </div>
        </footer>
    )
}
