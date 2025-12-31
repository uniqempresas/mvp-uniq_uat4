import React, { useState, useEffect } from 'react'
import type { Client } from '../../services/clientService'
import { crmService } from '../../services/crmService'

interface ClientFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (client: Omit<Client, 'id' | 'created_at' | 'empresa_id'>) => Promise<void>
    initialData?: Client
}

export default function ClientForm({ isOpen, onClose, onSubmit, initialData }: ClientFormProps) {
    if (!isOpen) return null

    const [formData, setFormData] = useState<Partial<Client>>({
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        empresa_nome: '',
        status: 'Novo', // Default
        foto_url: '',
    })

    const [origins, setOrigins] = useState<{ id: number, nome: string }[]>([])

    useEffect(() => {
        // Fetch origins
        crmService.getOrigins().then(setOrigins).catch(console.error)

        if (initialData) {
            setFormData(initialData)
        } else {
            setFormData({
                nome: '',
                email: '',
                telefone: '',
                cargo: '',
                empresa_nome: '',
                status: 'Novo',
                foto_url: '',
                origem: ''
            })
        }
    }, [initialData, isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === 'telefone') {
            // Remove non-digits
            let numbers = value.replace(/\D/g, '')

            // Limit to 13 digits (55 + 2 area + 9 phone)
            if (numbers.length > 13) numbers = numbers.slice(0, 13)

            // Auto-prepend 55 for new inputs if sensible or requested
            // But strict masking for now:
            // Simple mask logic: +55 (XX) XXXXX-XXXX

            // Strip 55 if present to mask the rest cleanly, then re-add
            let localNumbers = numbers
            if (localNumbers.startsWith('55')) {
                localNumbers = localNumbers.substring(2)
            }

            // Mask local part: (XX) XXXXX-XXXX
            let maskedLocal = localNumbers
            if (localNumbers.length > 2) {
                maskedLocal = `(${localNumbers.substring(0, 2)}) ${localNumbers.substring(2)}`
            }
            if (localNumbers.length > 7) {
                maskedLocal = `(${localNumbers.substring(0, 2)}) ${localNumbers.substring(2, 7)}-${localNumbers.substring(7, 11)}`
            }

            setFormData(prev => ({ ...prev, [name]: `+55 ${maskedLocal}` }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await onSubmit(formData as any)
            onClose()
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar cliente')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-lg text-slate-900">{initialData ? 'Editar Cliente' : 'Novo Cliente'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <label className="text-sm font-medium text-slate-700">Nome Completo *</label>
                            <input
                                required
                                name="nome"
                                value={formData.nome || ''}
                                onChange={handleChange}
                                className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                placeholder="Ex: João da Silva"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                placeholder="joao@email.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Telefone</label>
                            <input
                                name="telefone"
                                value={formData.telefone || ''}
                                onChange={handleChange}
                                className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Empresa</label>
                            <input
                                name="empresa_nome"
                                value={formData.empresa_nome || ''}
                                onChange={handleChange}
                                className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                placeholder="Empresa S.A."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Cargo</label>
                            <input
                                name="cargo"
                                value={formData.cargo || ''}
                                onChange={handleChange}
                                className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                placeholder="Diretor"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Status</label>
                        <select
                            name="status"
                            value={formData.status || 'Novo'}
                            onChange={handleChange}
                            className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                        >
                            <option value="Novo">Novo</option>
                            <option value="Ativo">Ativo</option>
                            <option value="Negociação">Negociação</option>
                            <option value="Inativo">Inativo</option>
                            <option value="Churn">Churn</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Origem</label>
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
                        <label className="text-sm font-medium text-slate-700">Foto URL</label>
                        <input
                            name="foto_url"
                            value={formData.foto_url || ''}
                            onChange={handleChange}
                            className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm transition-colors"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
