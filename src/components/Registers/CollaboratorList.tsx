import { useState, useEffect } from 'react'
import { meCollaboratorService, type Collaborator } from '../../services/meCollaboratorService'
import { supabase } from '../../lib/supabase'
import CollaboratorForm from './CollaboratorForm'

interface CollaboratorListProps {
    onNavigate?: (view: string) => void
}

export default function CollaboratorList({ onNavigate }: CollaboratorListProps) {
    const [user, setUser] = useState<any>(null)
    const [collaborators, setCollaborators] = useState<Collaborator[]>([])
    const [filteredCollaborators, setFilteredCollaborators] = useState<Collaborator[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | undefined>(undefined)

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [empresaId, setEmpresaId] = useState<string>('')

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user))
    }, [])

    useEffect(() => {
        const fetchMyCompany = async () => {
            if (user) {
                const { data } = await import('../../lib/supabase').then(m => m.supabase
                    .from('me_usuario')
                    .select('empresa_id')
                    .eq('id', user.id)
                    .single()
                )
                if (data) setEmpresaId(data.empresa_id)
            }
        }
        fetchMyCompany()
    }, [user])

    useEffect(() => {
        loadCollaborators()
    }, [empresaId])

    useEffect(() => {
        let result = collaborators
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase()
            result = result.filter(c =>
                (c.nome_usuario && c.nome_usuario.toLowerCase().includes(term)) ||
                c.email.toLowerCase().includes(term) ||
                (c.cargo_nome && c.cargo_nome.toLowerCase().includes(term))
            )
        }
        setFilteredCollaborators(result)
    }, [searchTerm, collaborators])

    const loadCollaborators = async () => {
        if (!empresaId) return
        try {
            setLoading(true)
            const data = await meCollaboratorService.list(empresaId)
            setCollaborators(data)
            setFilteredCollaborators(data)
        } catch (error) {
            console.error('Erro ao carregar colaboradores:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddNew = () => {
        setSelectedCollaborator(undefined)
        setShowForm(true)
    }

    const handleEdit = (collab: Collaborator) => {
        setSelectedCollaborator(collab)
        setShowForm(true)
    }

    const handleSuccess = () => {
        setShowForm(false)
        loadCollaborators()
    }

    // Se estiver mostrando o formulário, renderiza ele (com layout simples ou preserva o wrapper?)
    // Para manter consistência com ServiceList, idealmente seria um Modal, mas vamos renderizar no corpo por enquanto
    // mas com o mesmo estilo de fundo se possível.
    if (showForm) {
        return (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F3F4F6] p-8">
                <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeIn">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                        {selectedCollaborator ? 'Editar Colaborador' : 'Novo Colaborador'}
                    </h3>
                    <CollaboratorForm
                        empresaId={empresaId}
                        initialData={selectedCollaborator}
                        onSuccess={handleSuccess}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F3F4F6]">
            {/* Header */}
            <header className="flex-none px-8 py-6 pb-2">
                <nav className="flex items-center text-sm font-medium text-slate-500 mb-4">
                    <a className="hover:text-primary transition-colors cursor-pointer" onClick={() => onNavigate?.('home')}>
                        Minha Empresa
                    </a>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-primary font-semibold">Colaboradores</span>
                </nav>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Time & Acesso</h1>
                        <p className="text-slate-500">Gerencie sua equipe e permissões de acesso.</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-primary/30 transition-all active:scale-95 hover:shadow-md"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Novo Colaborador
                    </button>
                </div>
            </header>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">

                    {/* Filters */}
                    <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-white">
                        <div className="relative w-full lg:max-w-md group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                                placeholder="Buscar por nome, email ou cargo..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-gray-400 font-medium px-2 whitespace-nowrap">
                            {filteredCollaborators.length} membros
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Colaborador</th>
                                    <th className="px-6 py-4">Cargo</th>
                                    <th className="px-6 py-4">Nível de Acesso</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading && !empresaId ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                                            <p>Carregando equipe...</p>
                                        </div>
                                    </td></tr>
                                ) : filteredCollaborators.length === 0 ? (
                                    <tr><td colSpan={5} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-4xl text-slate-300">group_off</span>
                                            <p>{searchTerm ? 'Ninguém encontrado com esse nome.' : 'Nenhum colaborador cadastrado ainda.'}</p>
                                        </div>
                                    </td></tr>
                                ) : (
                                    filteredCollaborators.map(collab => (
                                        <tr key={collab.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                        {collab.nome_usuario?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 text-sm">{collab.nome_usuario || 'Sem nome'}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{collab.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">
                                                    {collab.cargo_nome || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                                    ${collab.role === 'dono' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                        collab.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                    {collab.role?.toUpperCase() || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${collab.ativo
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200'
                                                    }`}>
                                                    <span className={`size-1.5 rounded-full ${collab.ativo ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                                    {collab.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(collab)}
                                                        className="text-slate-400 hover:text-primary hover:bg-primary/5 transition-all p-2 rounded-lg"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
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
        </div>
    )
}
