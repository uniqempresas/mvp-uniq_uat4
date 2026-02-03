import { useState, useEffect } from 'react'
import { clientService, type Client } from '../../services/clientService'
import ClientForm from './ClientForm'

export default function ClientList() {
    const [clients, setClients] = useState<Client[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingClient, setEditingClient] = useState<Client | undefined>(undefined)

    const fetchClients = async () => {
        setIsLoading(true)
        try {
            const data = await clientService.getClients()
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
        await clientService.createClient(clientData)
        fetchClients()
    }

    const handleUpdate = async (clientData: any) => {
        if (editingClient) {
            await clientService.updateClient(editingClient.id, clientData)
            fetchClients()
        }
    }

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm('Tem certeza que deseja excluir este lead?')) {
            await clientService.deleteClient(id)
            fetchClients()
        }
    }

    const openEdit = (client: Client) => {
        setEditingClient(client)
        setIsFormOpen(true)
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F3F4F6]">
            {/* Header */}
            <header className="flex-none px-8 py-6 pb-2">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <a className="hover:text-primary transition-colors" href="#">CRM</a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-gray-900 font-medium">Leads & Clientes</span>
                </nav>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads</h1>
                        <p className="text-slate-500 mt-1">Gerencie seus potenciais clientes.</p>
                    </div>
                    <button
                        onClick={() => { setEditingClient(undefined); setIsFormOpen(true) }}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-primary/30 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Novo Lead
                    </button>
                </div>
            </header>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefone</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Carregando...</td></tr>
                                ) : clients.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum lead encontrado.</td></tr>
                                ) : (
                                    clients.map(client => (
                                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{client.nome}</td>
                                            <td className="px-6 py-4 text-slate-600">{client.email || '-'}</td>
                                            <td className="px-6 py-4 text-slate-600">{client.telefone || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 capitalize">
                                                    {client.status?.replace('_', ' ') || 'Novo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => openEdit(client)}
                                                        className="text-slate-400 hover:text-primary transition-colors p-1" title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(client.id, e)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Excluir"
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
                </div>
            </div>

            <ClientForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={editingClient ? handleUpdate : handleCreate}
                initialData={editingClient}
            />
        </div>
    )
}
