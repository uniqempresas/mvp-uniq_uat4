

interface ModuleCheckoutProps {
    onBack: () => void;
    onConfirm?: () => void;
    moduleName: string;
    price?: string;
}

export default function ModuleCheckout({
    onBack,
    onConfirm,
    moduleName,
    price = "49,90"
}: ModuleCheckoutProps) {
    return (
        <div className="flex-1 overflow-y-auto bg-[#F3F4F6] relative">
            <div className="w-full max-w-[1200px] mx-auto p-6 lg:p-10 flex flex-col min-h-full">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm text-slate-500 mb-6">
                    <button onClick={onBack} className="hover:text-primary transition-colors">Store</button>
                    <span className="material-symbols-outlined text-base mx-2">chevron_right</span>
                    <button onClick={onBack} className="hover:text-primary transition-colors">Módulos</button>
                    <span className="material-symbols-outlined text-base mx-2">chevron_right</span>
                    <span className="text-slate-800 font-medium">Checkout</span>
                </nav>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Finalizar Compra</h1>
                    <p className="text-slate-500 mt-2 text-base">Revise o módulo selecionado e escolha sua forma de pagamento preferida.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Payment Form */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Payment Methods Card */}
                        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 border border-slate-100">
                            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">payments</span>
                                Pagamento
                            </h3>

                            {/* Tabs */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 border-primary bg-emerald-50/50 text-primary font-medium transition-all relative">
                                    <span className="material-symbols-outlined">credit_card</span>
                                    Cartão de Crédito
                                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5">
                                        <span className="material-symbols-outlined text-sm">check</span>
                                    </div>
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-medium transition-all">
                                    <span className="material-symbols-outlined">qr_code_2</span>
                                    Pix
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-medium transition-all">
                                    <span className="material-symbols-outlined">receipt_long</span>
                                    Boleto
                                </button>
                            </div>

                            {/* Form */}
                            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Número do Cartão</label>
                                    <div className="relative">
                                        <input
                                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pl-11 py-3"
                                            placeholder="0000 0000 0000 0000"
                                            type="text"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400">credit_card</span>
                                        </div>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                                            <div className="w-8 h-5 bg-slate-200 rounded text-[8px] flex items-center justify-center text-slate-500 font-bold">MC</div>
                                            <div className="w-8 h-5 bg-slate-200 rounded text-[8px] flex items-center justify-center text-slate-500 font-bold">VISA</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome impresso no cartão</label>
                                    <input
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                                        placeholder="COMO NO CARTÃO"
                                        type="text"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Validade</label>
                                        <input
                                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                                            placeholder="MM/AA"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            CVV
                                            <span className="text-slate-400 ml-1 cursor-help" title="Código de segurança de 3 dígitos no verso do cartão">
                                                <span className="material-symbols-outlined text-[16px] align-middle">help</span>
                                            </span>
                                        </label>
                                        <input
                                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3"
                                            placeholder="123"
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex h-5 items-center">
                                        <input
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                            id="save-card"
                                            name="save-card"
                                            type="checkbox"
                                        />
                                    </div>
                                    <div className="text-sm">
                                        <label className="font-medium text-slate-700" htmlFor="save-card">Salvar cartão para futuras compras</label>
                                        <p className="text-slate-500">Seus dados são protegidos com criptografia de ponta a ponta.</p>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={onBack}
                                className="text-secondary font-medium hover:text-slate-800 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                Voltar
                            </button>
                            <button
                                onClick={onConfirm}
                                className="bg-primary hover:bg-emerald-600 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-200 transition-all transform active:scale-95 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">check_circle</span>
                                Confirmar Aquisição
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-800">Resumo do Pedido</h3>
                                <span className="text-xs font-medium bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded">#ORD-9921</span>
                            </div>
                            <div className="p-6">
                                {/* Product Item */}
                                <div className="flex gap-4 mb-6">
                                    <div className="size-14 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                                        <span className="material-symbols-outlined text-3xl">analytics</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 leading-snug">{moduleName}</h4>
                                        <p className="text-sm text-slate-500 mt-1">Plano Mensal</p>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-6 border-t border-slate-100 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span>R$ {price}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Desconto (Anual)</span>
                                        <span className="text-emerald-600">- R$ 0,00</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Taxas</span>
                                        <span>R$ 0,00</span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex justify-between items-end">
                                        <span className="text-base font-medium text-slate-700 mb-1">Total a pagar</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-slate-900 block">R$ {price}</span>
                                            <span className="text-xs text-slate-400">em até 12x sem juros</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Trust Badges */}
                            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                                    <span className="material-symbols-outlined text-base">lock</span>
                                    Pagamento 100% Seguro
                                </div>
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="bg-secondary/5 rounded-xl border border-secondary/10 p-5">
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-secondary">headset_mic</span>
                                <div>
                                    <h4 className="text-sm font-semibold text-secondary">Precisa de ajuda?</h4>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">Nossa equipe de suporte está disponível para auxiliar no processo de compra.</p>
                                    <button className="text-xs font-semibold text-secondary mt-2 inline-block hover:underline">Falar com consultor</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Small */}
                <div className="mt-auto pt-10 pb-4 text-center">
                    <p className="text-xs text-slate-400">© 2024 UNIQ ERP. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    )
}
