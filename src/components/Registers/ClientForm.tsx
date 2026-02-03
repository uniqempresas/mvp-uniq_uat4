import React, { useState, useEffect } from 'react'
import type { MeClient, ClientAddress } from '../../services/meClientService'
import { crmService } from '../../services/crmService'
import { formatPhone, formatCEP } from '../../utils/validators'

interface ClientFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (client: Partial<MeClient>) => Promise<void>
    initialData?: MeClient
}

const EmptyAddress: ClientAddress = {
    cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: ''
}

export default function ClientForm({ isOpen, onClose, onSubmit, initialData }: ClientFormProps) {
    if (!isOpen) return null

    const [formData, setFormData] = useState<Partial<MeClient>>({
        nome_cliente: '',
        email: '',
        telefone: '',
        cpf_cnpj: '',
        rg_ie: '',
        endereco: { ...EmptyAddress },
        ativo: true,
        origem: '',
        observacoes: ''
    })

    const [origins, setOrigins] = useState<{ id: number, nome: string }[]>([])

    useEffect(() => {
        // Fetch origins
        crmService.getOrigins().then(setOrigins).catch(console.error)

        if (initialData) {
            setFormData({
                ...initialData,
                endereco: initialData.endereco || { ...EmptyAddress }
            })
        } else {
            setFormData({
                nome_cliente: '',
                email: '',
                telefone: '',
                cpf_cnpj: '',
                rg_ie: '',
                endereco: { ...EmptyAddress },
                ativo: true,
                origem: '',
                observacoes: ''
            })
        }
    }, [initialData, isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name === 'ativo') {
            setFormData(prev => ({ ...prev, ativo: value === 'true' }))
            return
        }

        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value)
        setFormData(prev => ({ ...prev, telefone: formatted }))
    }

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCEP(e.target.value)
        setFormData(prev => ({
            ...prev,
            endereco: {
                ...prev.endereco,
                cep: formatted
            }
        }))
    }

    const handleCepBlur = async () => {
        const cep = formData.endereco?.cep?.replace(/\D/g, '') || ''
        if (cep.length !== 8) return

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()

            if (!data.erro) {
                setFormData(prev => ({
                    ...prev,
                    endereco: {
                        ...prev.endereco,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        uf: data.uf,
                        cep: prev.endereco?.cep // Keep formatted currently in input
                    }
                }))
            }
        } catch (error) {
            console.error('Error fetching CEP:', error)
        }
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            endereco: {
                ...prev.endereco,
                [name]: value
            }
        }))
    }

    // Máscara simples de CPF/CNPJ
    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 14) value = value.slice(0, 14)

        // CPF (11) or CNPJ (14)
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        } else {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2')
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
            value = value.replace(/(\d{4})(\d)/, '$1-$2')
        }

        setFormData(prev => ({ ...prev, cpf_cnpj: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await onSubmit(formData)
            onClose()
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar cliente')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-none">
                    <h3 className="font-semibold text-lg text-slate-900">{initialData ? 'Editar Cliente' : 'Novo Cliente'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="clientForm" onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Dados Principais */}
                        <section className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 border-b pb-2">Dados Principais</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Nome Completo / Razão Social *</label>
                                    <input
                                        required
                                        name="nome_cliente"
                                        value={formData.nome_cliente || ''}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                        placeholder="Ex: João da Silva Ltda"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">CPF / CNPJ</label>
                                    <input
                                        name="cpf_cnpj"
                                        value={formData.cpf_cnpj || ''}
                                        onChange={handleDocumentChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">RG / Inscrição Estadual</label>
                                    <input
                                        name="rg_ie"
                                        value={formData.rg_ie || ''}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                                    <select
                                        name="ativo"
                                        value={String(formData.ativo)}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.value === 'true' }))}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                    >
                                        <option value="true">Ativo</option>
                                        <option value="false">Inativo</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Contato */}
                        <section className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 border-b pb-2">Contato</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                        placeholder="email@exemplo.com"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Telefone</label>
                                    <input
                                        name="telefone"
                                        value={formData.telefone || ''}
                                        onChange={handlePhoneChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Endereço */}
                        <section className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 border-b pb-2">Endereço</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">CEP</label>
                                    <input
                                        name="cep"
                                        value={formData.endereco?.cep || ''}
                                        onChange={handleCepChange}
                                        onBlur={handleCepBlur}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                        placeholder="00000-000"
                                        maxLength={9}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Logradouro</label>
                                    <input
                                        name="logradouro"
                                        value={formData.endereco?.logradouro || ''}
                                        onChange={handleAddressChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                        placeholder="Rua, Avenida..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Número</label>
                                    <input
                                        name="numero"
                                        value={formData.endereco?.numero || ''}
                                        onChange={handleAddressChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Bairro</label>
                                    <input
                                        name="bairro"
                                        value={formData.endereco?.bairro || ''}
                                        onChange={handleAddressChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Cidade</label>
                                    <input
                                        name="cidade"
                                        value={formData.endereco?.cidade || ''}
                                        onChange={handleAddressChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">UF</label>
                                    <input
                                        name="uf"
                                        value={formData.endereco?.uf || ''}
                                        onChange={handleAddressChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                        maxLength={2}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Outros */}
                        <section className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Origem</label>
                                    <select
                                        name="origem"
                                        value={formData.origem || ''}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                    >
                                        <option value="">Selecione...</option>
                                        {origins.map(origin => (
                                            <option key={origin.id} value={origin.nome}>{origin.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Observações</label>
                                    <textarea
                                        name="observacoes"
                                        value={formData.observacoes || ''}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm p-3"
                                    />
                                </div>
                            </div>
                        </section>

                    </form>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-none">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        form="clientForm"
                        type="submit"
                        className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm transition-colors"
                    >
                        Salvar Cliente
                    </button>
                </div>
            </div>
        </div>
    )
}
