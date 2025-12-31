import React from 'react'

interface ClientDetailsProps {
    onBack: () => void
}

export default function ClientDetails({ onBack }: ClientDetailsProps) {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F3F4F6]">

            <div className="flex-1 overflow-y-auto scroll-smooth">
                <div className="max-w-[1200px] mx-auto p-6 md:p-8 flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <nav className="flex text-sm font-medium text-slate-500">
                        <ol className="flex items-center space-x-2">
                            <li><button onClick={onBack} className="hover:text-primary transition-colors">CRM</button></li>
                            <li><span className="text-gray-400">/</span></li>
                            <li><button onClick={onBack} className="hover:text-primary transition-colors">Clientes</button></li>
                            <li><span className="text-gray-400">/</span></li>
                            <li className="text-slate-900">Silva & Souza Ltda</li>
                        </ol>
                    </nav>

                    {/* Profile Header */}
                    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-5">
                            <div className="size-20 md:size-24 rounded-xl bg-cover bg-center shadow-inner shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnD73tTayLiVKMABjpP__j-W5Oj86mcnIkfyM5nQfa_CGodrzt2aqRKngIyF0Gc4ns_WJ9bv2osQyFeZWzB9ti832oQqlRzt4IlmitJNOncPB_Fd3GqZgOTBTe5gxmr6H3J45ezAHI4Gm5EJFMvAWT5_V3MVidwrFo7K-sQ8w5i2Gk8lW0135SaQtauvh2QTCjSu1lvB7cHBTzLH7OK2rHF0iEoCb9JEKtAXVGjtmf6oyH15yzhZiNbWHxexeuUQemSH-r1Inh0csk')" }}>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Silva & Souza Ltda</h1>
                                    <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide border border-green-200">Ativo</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-2">Varejo de Eletrônicos • São Paulo, SP</p>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> Desde Jan 2021</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">person</span> Gerente: Ana Clara</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none h-10 px-5 rounded-xl bg-slate-700 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                Editar
                            </button>
                            <button className="flex-1 md:flex-none h-10 px-5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary/20">
                                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                Novo Pedido
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Stat 1 */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 text-sm font-medium">Total Gasto (LTV)</p>
                                <span className="p-1.5 rounded-lg bg-green-50 text-green-600 material-symbols-outlined text-[20px]">payments</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mt-2">R$ 45.230,00</p>
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span> +12% vs ano anterior
                            </p>
                        </div>
                        {/* Stat 2 */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 text-sm font-medium">Pedidos Realizados</p>
                                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 material-symbols-outlined text-[20px]">inventory_2</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mt-2">24</p>
                            <p className="text-xs text-slate-400 font-medium mt-1">Último há 15 dias</p>
                        </div>
                        {/* Stat 3 */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 text-sm font-medium">Ticket Médio</p>
                                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 material-symbols-outlined text-[20px]">show_chart</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mt-2">R$ 1.884,50</p>
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span> +5% vs média
                            </p>
                        </div>
                        {/* Stat 4 */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 text-sm font-medium">Risco de Churn</p>
                                <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600 material-symbols-outlined text-[20px]">warning</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mt-2">Baixo</p>
                            <p className="text-xs text-slate-400 font-medium mt-1">Engajamento regular</p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Column Left: Contact & Notes */}
                        <div className="flex flex-col gap-6">
                            {/* Contact Info Card */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-semibold text-slate-900">Dados de Contato</h3>
                                    <button className="text-primary text-sm font-medium hover:underline">Editar</button>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex gap-3 items-start">
                                        <span className="material-symbols-outlined text-slate-400 mt-0.5">mail</span>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">E-mail Principal</p>
                                            <p className="text-sm text-slate-900">contato@silvasouza.com.br</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="material-symbols-outlined text-slate-400 mt-0.5">call</span>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Telefone</p>
                                            <p className="text-sm text-slate-900">(11) 3344-5566</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="material-symbols-outlined text-slate-400 mt-0.5">location_on</span>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Endereço de Faturamento</p>
                                            <p className="text-sm text-slate-900 leading-relaxed">Av. Paulista, 1000, Sala 42<br />Bela Vista, São Paulo - SP</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="material-symbols-outlined text-slate-400 mt-0.5">badge</span>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">CNPJ</p>
                                            <p className="text-sm text-slate-900">12.345.678/0001-90</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Private Notes */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden flex-1">
                                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-semibold text-slate-900">Anotações Internas</h3>
                                </div>
                                <div className="p-5">
                                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-3">
                                        <p className="text-xs text-yellow-800 leading-relaxed">
                                            <strong>Atenção:</strong> Cliente prefere entregas no período da manhã. Sempre confirmar disponibilidade de estoque antes de fechar pedido grande.
                                        </p>
                                    </div>
                                    <textarea className="w-full text-sm border-gray-200 rounded-lg focus:ring-primary focus:border-primary resize-none h-24 bg-gray-50 placeholder-gray-400" placeholder="Adicionar nova nota..."></textarea>
                                    <button className="mt-2 text-sm font-medium text-slate-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors w-full">Salvar Nota</button>
                                </div>
                            </div>
                        </div>

                        {/* Column Right: History & Orders (Spans 2 cols) */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Tabs */}
                            <div className="border-b border-gray-200">
                                <nav aria-label="Tabs" className="-mb-px flex space-x-6 overflow-x-auto">
                                    <button className="border-primary text-primary whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
                                        Visão Geral
                                    </button>
                                    <button className="border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
                                        Histórico de Pedidos
                                    </button>
                                    <button className="border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
                                        Documentos
                                    </button>
                                    <button className="border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm">
                                        Tickets de Suporte
                                    </button>
                                </nav>
                            </div>

                            {/* Recent Orders Table */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-900">Pedidos Recentes</h3>
                                    <a className="text-primary text-sm font-medium hover:underline" href="#">Ver todos</a>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-gray-50 text-slate-500">
                                            <tr>
                                                <th className="px-5 py-3 font-medium" scope="col">ID</th>
                                                <th className="px-5 py-3 font-medium" scope="col">Data</th>
                                                <th className="px-5 py-3 font-medium" scope="col">Valor</th>
                                                <th className="px-5 py-3 font-medium" scope="col">Status</th>
                                                <th className="px-5 py-3 font-medium" scope="col">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-3 font-medium text-slate-900">#4582</td>
                                                <td className="px-5 py-3 text-slate-500">12 Mai 2023</td>
                                                <td className="px-5 py-3 text-slate-900">R$ 2.450,00</td>
                                                <td className="px-5 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Concluído</span></td>
                                                <td className="px-5 py-3">
                                                    <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-3 font-medium text-slate-900">#4570</td>
                                                <td className="px-5 py-3 text-slate-500">02 Mai 2023</td>
                                                <td className="px-5 py-3 text-slate-900">R$ 1.100,00</td>
                                                <td className="px-5 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Concluído</span></td>
                                                <td className="px-5 py-3">
                                                    <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    )
}
