import type { MeClient } from '../../services/meClientService'

interface ClientDetailsProps {
    client: MeClient
    onBack: () => void
}

export default function ClientDetails({ client, onBack }: ClientDetailsProps) {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F3F4F6]">

            <div className="flex-1 overflow-y-auto scroll-smooth">
                <div className="max-w-[1200px] mx-auto p-6 md:p-8 flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <nav className="flex text-sm font-medium text-slate-500">
                        <ol className="flex items-center space-x-2">
                            <li><button onClick={onBack} className="hover:text-primary transition-colors">Cadastros</button></li>
                            <li><span className="text-gray-400">/</span></li>
                            <li><button onClick={onBack} className="hover:text-primary transition-colors">Clientes</button></li>
                            <li><span className="text-gray-400">/</span></li>
                            <li className="text-slate-900">{client.nome_cliente}</li>
                        </ol>
                    </nav>

                    {/* Profile Header */}
                    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-5">
                            <div
                                className="size-20 md:size-24 rounded-xl bg-gray-200 bg-cover bg-center shadow-inner shrink-0 flex items-center justify-center text-3xl font-bold text-gray-500"
                                style={client.foto_url ? { backgroundImage: `url('${client.foto_url}')` } : {}}
                            >
                                {!client.foto_url && client.nome_cliente.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{client.nome_cliente}</h1>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${client.ativo ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                                        }`}>
                                        {client.ativo ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mb-2">{client.origem ? `Origem: ${client.origem}` : 'Sem origem definida'}</p>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> Desde {new Date(client.created_at || Date.now()).toLocaleDateString()}</span>
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

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Column Left: Contact & Notes */}
                        <div className="flex flex-col gap-6">
                            {/* Contact Info Card */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-semibold text-slate-900">Dados de Contato</h3>
                                </div>
                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex gap-3 items-start">
                                        <span className="material-symbols-outlined text-slate-400 mt-0.5">mail</span>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">E-mail</p>
                                            <p className="text-sm text-slate-900 break-all">{client.email || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="material-symbols-outlined text-slate-400 mt-0.5">call</span>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Telefone</p>
                                            <p className="text-sm text-slate-900">{client.telefone || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="material-symbols-outlined text-slate-400 mt-0.5">location_on</span>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Endereço</p>
                                            {client.endereco ? (
                                                <p className="text-sm text-slate-900 leading-relaxed">
                                                    {client.endereco.logradouro}, {client.endereco.numero} {client.endereco.complemento}<br />
                                                    {client.endereco.bairro} - {client.endereco.cidade}/{client.endereco.uf}<br />
                                                    CEP: {client.endereco.cep}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-slate-900">-</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="material-symbols-outlined text-slate-400 mt-0.5">badge</span>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">CPF / CNPJ (Doc)</p>
                                            <p className="text-sm text-slate-900">{client.cpf_cnpj || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Observacoes */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden flex-1">
                                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="font-semibold text-slate-900">Observações</h3>
                                </div>
                                <div className="p-5">
                                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{client.observacoes || 'Nenhuma observação.'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Column Right: Placeholders for Orders/History */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center border-dashed border-2 border-gray-200">
                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">history</span>
                                <h3 className="text-lg font-medium text-gray-500">Histórico de Pedidos</h3>
                                <p className="text-sm text-gray-400">Em breve...</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    )
}
