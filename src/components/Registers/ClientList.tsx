import { useState, useEffect } from 'react'
import { meClientService, type MeClient } from '../../services/meClientService'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import MobileCard from '../Mobile/MobileCard'
import ClientForm from './ClientForm'
import ClientDetails from './ClientDetails'

export default function ClientList() {
    const [clients, setClients] = useState<MeClient[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingClient, setEditingClient] = useState<MeClient | undefined>(undefined)
    const [selectedClient, setSelectedClient] = useState<MeClient | null>(null) // For Details View

    const fetchClients = async () => {
        setIsLoading(true)
        try {
            const data = await meClientService.getClients()
            setClients(data)
        } catch (error) {
            console.error('Error fetching clients:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    const handleCreate = async (clientData: any) => {
        await meClientService.createClient(clientData)
        fetchClients()
    }

    const handleUpdate = async (clientData: any) => {
        if (editingClient) {
            await meClientService.updateClient(editingClient.id, clientData)
            fetchClients()
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            await meClientService.deleteClient(id)
            fetchClients()
        }
    }

    const openEdit = (client: MeClient, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingClient(client)
        setIsFormOpen(true)
    }

    const openDetails = (client: MeClient) => {
        setSelectedClient(client)
    }

    // Render Details View if a client is selected
    if (selectedClient) {
        return <ClientDetails client={selectedClient} onBack={() => setSelectedClient(null)} />
    }

    const { isMobile } = useBreakpoint()

    const renderMobileCard = (client: MeClient) => (
        <MobileCard
            key={client.id}
            avatar={
                client.foto_url ? (
                    client.foto_url
                ) : (
                    <div className="text-lg font-bold text-gray-500">
                        {client.nome_cliente?.charAt(0)}
                    </div>
                )
            }
            title={client.nome_cliente}
            subtitle={client.cpf_cnpj}
            badge={
                client.ativo
                    ? { label: 'Ativo', color: 'green' }
                    : { label: 'Inativo', color: 'red' }
            }
            fields={[
                { label: 'Email', value: client.email || '-', icon: 'mail' },
                { label: 'Telefone', value: client.telefone || '-', icon: 'call' }
            ]}
            actions={[
                {
                    icon: 'edit',
                    onClick: (e) => openEdit(client, e),
                    color: 'blue',
                    title: 'Editar'
                },
                {
                    icon: 'delete',
                    onClick: (e) => handleDelete(client.id, e),
                    color: 'red',
                    title: 'Excluir'
                }
            ]}
            onClick={() => openDetails(client)}
        />
    )

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F3F4F6]">
            {/* Header */}
            <header className="flex-none px-8 py-6 pb-2">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-gray-900 font-medium">Clientes</span>
                </nav>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Lista de Clientes</h1>
                        <p className="text-slate-500 mt-1">Gerencie os clientes da sua empresa (Minha Empresa).</p>
                    </div>
                    <button
                        onClick={() => { setEditingClient(undefined); setIsFormOpen(true) }}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-primary/30 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Novo Cliente
                    </button>
                </div>
            </header>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
                {/* Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    {/* Filters... (Simplified for now) */}
                    <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
                        <div className="relative w-full sm:max-w-md">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
                            <input className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400" placeholder="Buscar por nome..." type="text" />
                        </div>
                    </div>

                    {isMobile ? (
                        // Mobile Card Layout
                        <div className="p-4 grid gap-4">
                            {isLoading ? (
                                <div className="py-12 text-center text-slate-500">Carregando...</div>
                            ) : clients.length === 0 ? (
                                <div className="py-12 text-center text-slate-500">Nenhum cliente cadastrado.</div>
                            ) : (
                                clients.map(renderMobileCard)
                            )}
                        </div>
                    ) : (
                        // Desktop Table Layout
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente / Empresa</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contato</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Documento</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">Carregando...</td></tr>
                                    ) : clients.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum cliente cadastrado.</td></tr>
                                    ) : (
                                        clients.map(client => (
                                            <tr
                                                key={client.id}
                                                onClick={() => openDetails(client)}
                                                className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="size-10 rounded-full bg-gray-200 bg-cover bg-center shrink-0 border border-gray-200 flex items-center justify-center text-gray-500 font-bold"
                                                            style={client.foto_url ? { backgroundImage: `url('${client.foto_url}')` } : {}}
                                                        >
                                                            {!client.foto_url && client.nome_cliente?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 text-sm">{client.nome_cliente}</p>
                                                            {client.cpf_cnpj && <p className="text-xs text-slate-500">{client.cpf_cnpj}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        {client.email && (
                                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                <span className="material-symbols-outlined text-[14px]">mail</span> {client.email}
                                                            </div>
                                                        )}
                                                        {client.telefone && (
                                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                <span className="material-symbols-outlined text-[14px]">call</span> {client.telefone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-600 font-medium">{client.cpf_cnpj || '-'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${client.ativo ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                                        <span className={`size-1.5 rounded-full ${client.ativo ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                        {client.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={(e) => openEdit(client, e)}
                                                            className="text-slate-400 hover:text-primary transition-colors p-1 rounded-lg hover:bg-gray-100" title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(client.id, e)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-gray-100" title="Excluir"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ClientForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={editingClient ? handleUpdate : handleCreate}
                initialData={editingClient}
            />
        </div >
    )
}
