import React, { useState, useEffect } from 'react'
import { crmService, type FunnelStage } from '../../services/crmService'

const COLORS = [
    { label: 'Cinza', value: 'bg-gray-100 text-gray-800' },
    { label: 'Azul', value: 'bg-blue-100 text-blue-800' },
    { label: 'Verde', value: 'bg-green-100 text-green-800' },
    { label: 'Laranja', value: 'bg-orange-100 text-orange-800' },
    { label: 'Vermelho', value: 'bg-red-100 text-red-800' },
    { label: 'Roxo', value: 'bg-purple-100 text-purple-800' },
]

export default function CRMSettings() {
    const [stages, setStages] = useState<FunnelStage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newStageName, setNewStageName] = useState('')
    const [newStageColor, setNewStageColor] = useState(COLORS[0].value)

    const fetchStages = async () => {
        setIsLoading(true)
        try {
            const data = await crmService.getStages()
            setStages(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStages()
    }, [])

    const handleAdd = async () => {
        if (!newStageName.trim()) return
        try {
            await crmService.addStage({
                nome: newStageName,
                cor: newStageColor,
                ordem: 999 // Service handles correct order
            })
            setNewStageName('')
            fetchStages()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja remover esta etapa?')) {
            try {
                await crmService.deleteStage(id)
                fetchStages()
            } catch (error) {
                console.error(error)
            }
        }
    }

    const moveStage = async (index: number, direction: 'up' | 'down') => {
        const newStages = [...stages]
        if (direction === 'up') {
            if (index === 0) return
            [newStages[index], newStages[index - 1]] = [newStages[index - 1], newStages[index]]
        } else {
            if (index === newStages.length - 1) return
            [newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]]
        }

        setStages(newStages) // Optimistic update
        try {
            await crmService.reorderStages(newStages)
        } catch (error) {
            console.error(error)
            fetchStages() // Revert on error
        }
    }

    // Determine color label for display
    const getColorLabel = (colorClass: string) => {
        return COLORS.find(c => c.value === colorClass)?.label || 'Cor'
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#F3F4F6] p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Configurações do CRM</h1>
                    <p className="text-slate-500">Gerencie as etapas do seu funil de vendas</p>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-slate-900">Etapas do Funil</h2>
                        <p className="text-sm text-slate-500">Ordene e personalize as etapas do seu processo de vendas</p>
                    </div>

                    <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                        <div className="flex gap-4">
                            <input
                                className="flex-1 h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                placeholder="Nome da nova etapa"
                                value={newStageName}
                                onChange={e => setNewStageName(e.target.value)}
                            />
                            <select
                                className="h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3 bg-white"
                                value={newStageColor}
                                onChange={e => setNewStageColor(e.target.value)}
                            >
                                {COLORS.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleAdd}
                                className="h-10 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span className="hidden sm:inline">Nova Etapa</span>
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500">Carregando etapas...</div>
                        ) : stages.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">Nenhuma etapa configurada.</div>
                        ) : (
                            stages.map((stage, index) => (
                                <div key={stage.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                                    <div className="flex flex-col gap-1 text-slate-400">
                                        <button
                                            onClick={() => moveStage(index, 'up')}
                                            disabled={index === 0}
                                            className="hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400"
                                        >
                                            <span className="material-symbols-outlined text-[20px] block">arrow_drop_up</span>
                                        </button>
                                        <button
                                            onClick={() => moveStage(index, 'down')}
                                            disabled={index === stages.length - 1}
                                            className="hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400"
                                        >
                                            <span className="material-symbols-outlined text-[20px] block -mt-2">arrow_drop_down</span>
                                        </button>
                                    </div>

                                    <div className="flex-1 font-medium text-slate-700">
                                        {stage.nome}
                                    </div>

                                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${stage.cor}`}>
                                        {getColorLabel(stage.cor)}
                                    </div>

                                    <button
                                        onClick={() => handleDelete(stage.id)}
                                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Origins Section */}
                <OriginsSettings />
            </div>
        </div>
    )
}

function OriginsSettings() {
    const [origins, setOrigins] = useState<{ id: number, nome: string }[]>([])
    const [newItem, setNewItem] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const fetchOrigins = async () => {
        setIsLoading(true)
        try {
            const data = await crmService.getOrigins()
            setOrigins(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrigins()
    }, [])

    const handleAdd = async () => {
        if (!newItem.trim()) return
        try {
            await crmService.addOrigin(newItem)
            setNewItem('')
            fetchOrigins()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Remover origem?')) {
            await crmService.deleteOrigin(id)
            fetchOrigins()
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-slate-900">Origens de Leads</h2>
                <p className="text-sm text-slate-500">Configure as opções de origem para seus contatos</p>
            </div>

            <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                <div className="flex gap-4">
                    <input
                        className="flex-1 h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                        placeholder="Ex: Instagram, Google, Indicação..."
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                    />
                    <button
                        onClick={handleAdd}
                        className="h-10 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="hidden sm:inline">Adicionar</span>
                    </button>
                </div>
            </div>

            <div className="divide-y divide-gray-100">
                {isLoading ? (
                    <div className="p-8 text-center text-slate-500">Carregando...</div>
                ) : origins.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Nenhuma origem cadastrada.</div>
                ) : (
                    origins.map((origin) => (
                        <div key={origin.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                            <div className="flex-1 font-medium text-slate-700 ml-2">
                                {origin.nome}
                            </div>
                            <button
                                onClick={() => handleDelete(origin.id)}
                                className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
