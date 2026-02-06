import { useState, useEffect } from 'react'
import { meCollaboratorService, type Collaborator } from '../../services/meCollaboratorService'
import { supabase } from '../../lib/supabase'

interface CollaboratorFormProps {
    initialData?: Collaborator
    empresaId: string
    onSuccess: () => void
    onCancel: () => void
}

export default function CollaboratorForm({ initialData, empresaId, onSuccess, onCancel }: CollaboratorFormProps) {
    const [loading, setLoading] = useState(false)
    const [cargos, setCargos] = useState<{ id: number, nome: string }[]>([])

    const [formData, setFormData] = useState<Partial<Collaborator>>({
        nome_usuario: '',
        email: '',
        telefone: '',
        cargo_id: null,
        role: 'colaborador',
        ativo: true,
        aceita_agendamento: false
    })

    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        }
        fetchCargos()
    }, [initialData])

    const fetchCargos = async () => {
        const { data } = await supabase
            .from('me_cargo')
            .select('id, nome')
            .eq('ativo', true)

        if (data) setCargos(data)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
        setFormData((prev: Partial<Collaborator>) => ({ ...prev, [e.target.name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (initialData?.id) {
                // Update
                await meCollaboratorService.update(initialData.id, formData)
            } else {
                // Create
                await meCollaboratorService.create({ ...formData, empresa_id: empresaId })
            }
            onSuccess()
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Nome */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo *</label>
                    <input
                        type="text"
                        name="nome_usuario"
                        required
                        value={formData.nome_usuario || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="Ex: João Silva"
                    />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">E-mail Corporativo *</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="joao@empresa.com"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">⚠️ <strong>Atenção:</strong> Este cadastro não cria login automático. É apenas para gestão de RH.</p>
                </div>

                {/* Telefone */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Telefone / WhatsApp</label>
                    <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        placeholder="(00) 00000-0000"
                    />
                </div>

                {/* Cargo */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cargo</label>
                    <select
                        name="cargo_id"
                        value={formData.cargo_id || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    >
                        <option value="">Selecione um cargo...</option>
                        {cargos.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                </div>

                {/* Role / Permissão */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nível de Acesso</label>
                    <select
                        name="role"
                        value={formData.role || 'colaborador'}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    >
                        <option value="colaborador">Colaborador (Padrão)</option>
                        <option value="vendedor">Vendedor (Acesso a Loja)</option>
                        <option value="admin">Administrador (Acesso Total)</option>
                        <option value="dono">Dono (Proprietário)</option>
                    </select>
                </div>

                {/* Configurações */}
                <div className="md:col-span-2 pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="aceita_agendamento"
                            checked={formData.aceita_agendamento || false}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-slate-700">Aparece na Agenda (Prestador de Serviço)</span>
                    </label>
                </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 text-slate-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-sm"
                >
                    {loading ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                            Salvando...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            {initialData ? 'Atualizar' : 'Cadastrar'}
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
