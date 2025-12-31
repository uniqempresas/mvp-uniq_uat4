import type { Module } from '../../../services/modulesService';

interface ModuleDetailsProps {
    onBack: () => void;
    onCheckout: () => void;
    onDeactivate?: () => void;
    module?: Module | null;
    isOwned?: boolean;
}

export default function ModuleDetails({ onBack, onCheckout, onDeactivate, module, isOwned = false }: ModuleDetailsProps) {
    if (!module) return null;

    const benefits = module.funcionalidades || [];

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-y-auto bg-[#F3F4F6] scroll-smooth">
            {/* Breadcrumbs & Top Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <nav className="text-xs font-medium text-slate-400 flex items-center gap-2 mb-1">
                            <span className="cursor-pointer hover:text-primary transition-colors" onClick={onBack}>Loja</span>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <span className="text-slate-600">{module.nome}</span>
                        </nav>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            {module.nome}
                            {isOwned && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">ATIVO</span>}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto w-full p-8 pb-24">

                {/* Hero Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0 border border-blue-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                            <span className="material-symbols-outlined text-4xl text-blue-600">{module.icone || 'extension'}</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">{module.descricao}</h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-6 font-light">
                                Este módulo expande as capacidades do sistema permitindo um gerenciamento profissional.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium border border-slate-200 inline-flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base text-slate-400">update</span>
                                    Atualizações Grátis
                                </span>
                                <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium border border-slate-200 inline-flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base text-slate-400">support</span>
                                    Suporte Prioritário
                                </span>
                            </div>
                        </div>

                        {/* Price Card */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 w-full md:w-auto min-w-[240px] shadow-sm">
                            <p className="text-sm text-slate-500 font-medium mb-1">Investimento mensal</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-sm text-slate-400 font-medium self-start mt-2">R$</span>
                                <span className="text-4xl font-bold text-slate-800 tracking-tight">{module.preco_mensal.toString().replace('.', ',')}</span>
                                <span className="text-slate-400 font-medium">/mês</span>
                            </div>

                            {!isOwned ? (
                                <button
                                    onClick={onCheckout}
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <span>Adicionar ao Plano</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (confirm('Tem certeza que deseja desativar este módulo?')) {
                                            if (onDeactivate) onDeactivate();
                                        }
                                    }}
                                    className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <span>Desativar Módulo</span>
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            )}

                            {!isOwned && <p className="text-xs text-center text-slate-400 mt-3">Cancelamento a qualquer momento</p>}
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-secondary rounded-full"></span>
                    Principais Funcionalidades
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {benefits.map((feature: string, index: number) => (
                        <div key={index} className="bg-white p-5 rounded-xl text-left border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 mb-4 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                <span className="material-symbols-outlined">check</span>
                            </div>
                            <h4 className="font-semibold text-slate-800 mb-2 text-lg">{feature}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Funcionalidade disponível no pacote {module.nome}. Aumente sua produtividade com este recurso.
                            </p>
                        </div>
                    ))}
                </div>

                {/* FAQ / Info */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex gap-4 items-start">
                    <span className="material-symbols-outlined text-blue-600 text-2xl shrink-0 mt-1">info</span>
                    <div>
                        <h4 className="font-bold text-blue-800 mb-1">Como funciona a ativação?</h4>
                        <p className="text-blue-700/80 text-sm leading-relaxed">
                            Ao confirmar a contratação, o módulo é liberado instantaneamente para todos os usuários da sua empresa.
                            O valor será adicionado na sua próxima fatura proporcionalmente aos dias de uso.
                        </p>
                    </div>
                </div>

            </div>

            {/* Bottom Sticky Action Bar (Mobile Only or explicit CTA) */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-slate-200 p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
                <div>
                    <span className="text-xs text-slate-500 block">Total mensal</span>
                    <span className="text-lg font-bold text-slate-800">R$ {module.preco_mensal.toString().replace('.', ',')}</span>
                </div>
                {!isOwned ? (
                    <button
                        onClick={onCheckout}
                        className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg shadow-lg"
                    >
                        Contratar
                    </button>
                ) : (
                    <button className="bg-slate-100 text-slate-500 font-bold py-2.5 px-6 rounded-lg cursor-not-allowed">
                        Ativo
                    </button>
                )}
            </div>
        </div>
    )
}
