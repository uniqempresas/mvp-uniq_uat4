import type { Category } from '../../../services/publicService'

interface StoreFooterProps {
    companyName: string
    logoUrl?: string
    telefone?: string
    email?: string
    categories?: Category[]
}

export default function StoreFooter({
    companyName,
    logoUrl,
    telefone,
    email,
    categories = []
}: StoreFooterProps) {
    const initial = companyName.charAt(0).toUpperCase()
    const year = new Date().getFullYear()
    const whatsappUrl = telefone ? `https://wa.me/${telefone.replace(/\D/g, '')}` : '#'

    return (
        <footer className="bg-slate-900 text-gray-300 pt-16 pb-8">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-12 border-b border-slate-800">
                    {/* Coluna 1 — Dados do Parceiro */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-5">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={`Logo ${companyName}`}
                                    className="h-10 w-10 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-black text-lg">
                                    {initial}
                                </div>
                            )}
                            <span className="text-lg font-bold text-white">{companyName}</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Loja oficial gerenciada pela plataforma UNIQ Empresas.
                        </p>
                        <div className="flex gap-3">
                            {telefone && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="size-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-all text-gray-400"
                                    title="WhatsApp"
                                >
                                    <span className="material-symbols-outlined text-lg">chat</span>
                                </a>
                            )}
                            {email && (
                                <a
                                    href={`mailto:${email}`}
                                    className="size-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all text-gray-400"
                                    title="E-mail"
                                >
                                    <span className="material-symbols-outlined text-lg">mail</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Coluna 2 — Categorias dinâmicas */}
                    <div>
                        <h5 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Categorias</h5>
                        <ul className="space-y-3 text-sm">
                            {categories.length > 0 ? (
                                categories.slice(0, 6).map(cat => (
                                    <li key={String(cat.id_categoria)}>
                                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                            {cat.nome_categoria}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500 text-sm italic">Nenhuma categoria</li>
                            )}
                        </ul>
                    </div>

                    {/* Coluna 3 — A Loja */}
                    <div>
                        <h5 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">A Loja</h5>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Todos os Produtos</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Promoções</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Sobre Nós</a></li>
                            {telefone && (
                                <li>
                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                        Contato via WhatsApp
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Coluna 4 — UNIQ Engajamento */}
                    <div>
                        <h5 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">UNIQ Empresas</h5>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Crie sua Loja Online</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Conheça a Plataforma</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Planos e Preços</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© {year} {companyName}. Loja gerenciada por <span className="text-primary font-semibold">UNIQ Empresas</span>.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
                        <a href="#" className="hover:text-primary transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
