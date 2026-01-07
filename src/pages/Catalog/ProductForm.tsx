

export default function ProductForm() {
    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-main-bg">
            {/* Header */}
            <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm">
                    <a className="text-text-secondary hover:text-primary transition-colors" href="#">Home</a>
                    <span className="text-gray-300">/</span>
                    <a className="text-text-secondary hover:text-primary transition-colors" href="#">Catálogo</a>
                    <span className="text-gray-300">/</span>
                    <span className="text-text-main font-medium">Novo Produto</span>
                </div>
                {/* Top Right Actions (Notifications, Search) */}
                <div className="flex items-center gap-4">
                    <button className="text-text-secondary hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <button className="text-text-secondary hover:text-text-main transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </header>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Page Heading & Actions */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Novo Produto</h1>
                            <p className="text-slate-500 text-sm md:max-w-xl">Preencha as informações detalhadas do produto para disponibilizá-lo em seus canais de venda.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-6 h-10 rounded-lg border border-transparent text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2">
                                Cancelar
                            </button>
                            <button className="px-6 h-10 rounded-lg border border-transparent text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-all shadow-md shadow-emerald-200 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">check</span>
                                Salvar Produto
                            </button>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Card: Informações Básicas */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">feed</span>
                                    Informações Básicas
                                </h3>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Nome do Produto <span className="text-red-500">*</span></span>
                                            <input className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none px-3" placeholder="Ex: Camiseta Básica Algodão UNIQ" type="text" />
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Categoria</span>
                                            <select className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm transition-all text-slate-700 outline-none px-3">
                                                <option>Selecione uma categoria</option>
                                                <option>Vestuário</option>
                                                <option>Eletrônicos</option>
                                                <option>Acessórios</option>
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Marca / Fabricante</span>
                                            <input className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none px-3" placeholder="Ex: UNIQ Wear" type="text" />
                                        </label>
                                    </div>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">Descrição Detalhada</span>
                                        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                                            {/* Toolbar simulated */}
                                            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                                                <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                                                <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                                                <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                                                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                                <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><span className="material-symbols-outlined text-[18px]">link</span></button>
                                            </div>
                                            <textarea className="w-full border-0 focus:ring-0 text-sm p-4 h-32 resize-none outline-none" placeholder="Descreva as características principais do produto..."></textarea>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 text-right">0/2000 caracteres</p>
                                    </label>
                                </div>
                            </div>

                            {/* Card: Preços e Estoque */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">payments</span>
                                    Preços & Estoque
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">Preço de Venda</span>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                                            <input className="w-full h-11 pl-10 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm font-medium placeholder:text-gray-400 transition-all outline-none" placeholder="0,00" type="number" />
                                        </div>
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">Preço de Custo</span>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                                            <input className="w-full h-11 pl-10 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none" placeholder="0,00" type="number" />
                                        </div>
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">Preço Promocional</span>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                                            <input className="w-full h-11 pl-10 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none" placeholder="0,00" type="number" />
                                        </div>
                                    </label>
                                </div>
                                <div className="w-full h-px bg-gray-100 my-6"></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">Estoque Atual</span>
                                        <input className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none px-3" placeholder="0" type="number" />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">Estoque Mínimo (Alerta)</span>
                                        <input className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none px-3" placeholder="5" type="number" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Media & Organization */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Card: Imagem do Produto */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">image</span>
                                    Mídia
                                </h3>
                                <div className="w-full aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group/upload relative overflow-hidden">
                                    <input className="absolute inset-0 opacity-0 cursor-pointer z-10" type="file" />
                                    <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover/upload:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-gray-400 text-3xl group-hover/upload:text-primary">cloud_upload</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">Clique ou arraste</p>
                                    <p className="text-xs text-slate-500 mt-1">PNG, JPG até 5MB</p>
                                </div>
                                <div className="mt-4 grid grid-cols-4 gap-2">
                                    <div className="aspect-square rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition-all">
                                        <span className="material-symbols-outlined text-gray-400 text-xl">plus_one</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card: Codificação */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">qr_code</span>
                                    Codificação
                                </h3>
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">SKU (Código Interno)</span>
                                        <input className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all uppercase outline-none px-3" placeholder="PRD-0001" type="text" />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">GTIN / EAN</span>
                                        <div className="flex gap-2">
                                            <input className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none px-3" placeholder="789..." type="text" />
                                            <button className="size-11 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors" title="Gerar código">
                                                <span className="material-symbols-outlined">autorenew</span>
                                            </button>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Card: Status e Visibilidade */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">visibility</span>
                                    Visibilidade
                                </h3>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-700">Produto Ativo</span>
                                        <span className="text-xs text-slate-500">Disponível para venda</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input defaultChecked={true} className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-700">Destaque</span>
                                        <span className="text-xs text-slate-500">Exibir na home do catálogo</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Spacer for bottom padding */}
                    <div className="h-8"></div>
                </div>
            </div>
        </div>
    )
}
