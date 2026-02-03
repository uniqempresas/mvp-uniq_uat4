import React, { useState, useEffect } from 'react'
import type { Client } from '../../services/clientService'

interface ClientFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (client: Partial<Client>) => Promise<void>
    initialData?: Client
}

export default function ClientForm({ isOpen, onClose, onSubmit, initialData }: ClientFormProps) {
    if (!isOpen) return null

    const [formData, setFormData] = useState<Partial<Client>>({
        nome: '',
        email: '',
        telefone: '',
        status: 'novo',
        observacoes: ''
    })

    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        } else {
            setFormData({
                nome: '',
                email: '',
                telefone: '',
                status: 'novo',
                observacoes: ''
            })
        }
    }, [initialData, isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await onSubmit(formData)
            onClose()
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar lead')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-lg text-slate-900">{initialData ? 'Editar Lead' : 'Novo Lead'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Nome</label>
                        <input
                            required
                            name="nome"
                            value={formData.nome || ''}
                            onChange={handleChange}
                            className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Telefone</label>
                        <input
                            name="telefone"
                            value={formData.telefone || ''}
                            onChange={handleChange}
                            className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                        <select
                            name="status"
                            value={formData.status || 'novo'}
                            onChange={handleChange}
                            className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                        >
                            <option value="novo">Novo</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="convertido">Convertido</option>
                            <option value="perdido">Perdido</option>
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

                    <div className="flex justify-end gap-3 mt-4">
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
