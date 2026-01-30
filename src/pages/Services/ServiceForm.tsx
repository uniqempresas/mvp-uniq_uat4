import { useState, useEffect } from 'react'
import { serviceService, type Service, type ServiceImage } from '../../services/serviceService'
import { categoryService, type Category, type Subcategory } from '../../services/categoryService'
import CategoryManagerModal from '../../components/Catalog/CategoryManagerModal'

interface ServiceFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit?: (data: any) => Promise<void>
    initialData?: Service
    onSuccess?: () => void
}

export default function ServiceForm({ isOpen, onClose, initialData, onSuccess }: ServiceFormProps) {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])

    // Modal de Categorias
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [categoryModalInitialId, setCategoryModalInitialId] = useState<number | undefined>(undefined)

    const [formData, setFormData] = useState<Partial<Service>>({
        nome: '',
        descricao: '',
        categoria_id: undefined,
        subcategoria_id: undefined,
        preco: 0,
        duracao: undefined,
        ativo: true,
        imagens: []
    })

    // Init Logic
    useEffect(() => {
        if (isOpen) {
            loadCategories()
            if (initialData) {
                setFormData({
                    ...initialData,
                    imagens: initialData.imagens || []
                })
                if (initialData.categoria_id) {
                    loadSubcategories(initialData.categoria_id)
                }
            } else {
                setFormData({
                    nome: '',
                    descricao: '',
                    categoria_id: undefined,
                    subcategoria_id: undefined,
                    preco: 0,
                    duracao: undefined,
                    ativo: true,
                    imagens: []
                })
                setSubcategories([])
            }
        }
    }, [isOpen, initialData])

    // Load Data
    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategories()
            setCategories(data)
        } catch (error) {
            console.error('Erro ao carregar categorias', error)
        }
    }

    const loadSubcategories = async (catId: number) => {
        try {
            const data = await categoryService.getSubcategories(catId)
            setSubcategories(data)
        } catch (error) {
            console.error('Erro ao carregar subcategorias', error)
        }
    }

    // Handlers
    const handleChange = (field: keyof Service, value: any) => {
        let finalValue = value
        if (field === 'categoria_id') {
            finalValue = value === '' ? undefined : Number(value)
            setFormData(prev => ({ ...prev, [field]: finalValue, subcategoria_id: undefined }))
            if (finalValue) loadSubcategories(finalValue)
            else setSubcategories([])
            return
        }
        if (field === 'subcategoria_id') {
            finalValue = value === '' ? undefined : Number(value)
        }

        setFormData(prev => ({ ...prev, [field]: finalValue }))
    }

    const handleImageUpload = async (file: File) => {
        try {
            setLoading(true)
            const url = await serviceService.uploadServiceImage(file)
            setFormData(prev => {
                const currentImages = prev.imagens || []
                const newImage: ServiceImage = {
                    imagem_url: url,
                    ordem_exibicao: currentImages.length
                }
                const newImages = [...currentImages, newImage]
                return {
                    ...prev,
                    imagens: newImages,
                    foto_url: newImages[0]?.imagem_url // Atualiza capa
                }
            })
        } catch (error) {
            console.error(error)
            alert('Erro ao fazer upload da imagem')
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveImage = (index: number) => {
        setFormData(prev => {
            const currentImages = [...(prev.imagens || [])]
            currentImages.splice(index, 1)
            const reordered = currentImages.map((img, idx) => ({ ...img, ordem_exibicao: idx }))
            return {
                ...prev,
                imagens: reordered,
                foto_url: reordered[0]?.imagem_url
            }
        })
    }

    const handleSubmit = async () => {
        if (!formData.nome) {
            alert('Nome é obrigatório')
            return
        }

        setLoading(true)
        try {
            if (initialData?.id) {
                await serviceService.updateService(initialData.id, formData, formData.imagens || [])
            } else {
                await serviceService.createService(formData, formData.imagens || [])
            }
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar serviço')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {initialData ? 'Editar Serviço' : 'Novo Serviço'}
                        </h2>
                        <p className="text-sm text-slate-500">Preencha as informações do serviço</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-slate-400 transition-colors">
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>
                    </div>
                </div>

                {/* Content - 2 Columns Layout */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Coluna Principal (2/3) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Card: Info Básica */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">feed</span>
                                    Informações Básicas
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do Serviço <span className="text-red-500">*</span></label>
                                        <input
                                            value={formData.nome}
                                            onChange={(e) => handleChange('nome', e.target.value)}
                                            className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm px-4 outline-none transition-all placeholder:text-gray-400"
                                            placeholder="Ex: Consultoria Estratégica"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição</label>
                                        <div className="relative">
                                            <textarea
                                                value={formData.descricao || ''}
                                                onChange={(e) => handleChange('descricao', e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm p-4 outline-none transition-all resize-none"
                                                placeholder="Descreva detalhadamente o serviço..."
                                            />
                                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                                {formData.descricao?.length || 0}/2000
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Categoria */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Categoria</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={formData.categoria_id || ''}
                                                    onChange={(e) => handleChange('categoria_id', e.target.value)}
                                                    className="flex-1 h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm px-3 outline-none cursor-pointer"
                                                >
                                                    <option value="">Selecione...</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome_categoria}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => { setCategoryModalInitialId(undefined); setIsCategoryModalOpen(true) }}
                                                    className="size-11 flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-slate-600 rounded-lg flex items-center justify-center transition-colors"
                                                    title="Gerenciar Categorias"
                                                >
                                                    <span className="material-symbols-outlined">create_new_folder</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subcategoria */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Subcategoria</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={formData.subcategoria_id || ''}
                                                    onChange={(e) => handleChange('subcategoria_id', e.target.value)}
                                                    disabled={!formData.categoria_id}
                                                    className="flex-1 h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm px-3 outline-none cursor-pointer disabled:opacity-50"
                                                >
                                                    <option value="">Selecione...</option>
                                                    {subcategories.map(sub => (
                                                        <option key={sub.id_subcategoria} value={sub.id_subcategoria}>{sub.nome_subcategoria}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        if (!formData.categoria_id) return alert('Selecione uma categoria primeiro')
                                                        setCategoryModalInitialId(formData.categoria_id)
                                                        setIsCategoryModalOpen(true)
                                                    }}
                                                    disabled={!formData.categoria_id}
                                                    className="size-11 flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-slate-600 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                                                    title="Gerenciar Subcategorias"
                                                >
                                                    <span className="material-symbols-outlined">create_new_folder</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card: Preços e Duração */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">payments</span>
                                    Valores e Tempo
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Preço (R$) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.preco}
                                                onChange={(e) => handleChange('preco', parseFloat(e.target.value) || 0)}
                                                className="w-full h-11 pl-10 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm font-medium outline-none transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Duração Estimada (min)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="5"
                                                value={formData.duracao || ''}
                                                onChange={(e) => handleChange('duracao', e.target.value ? parseInt(e.target.value) : undefined)}
                                                className="w-full h-11 pl-10 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm outline-none transition-all"
                                                placeholder="Ex: 60"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coluna Lateral (1/3) */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Card: Mídia */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">image</span>
                                    Fotos ({formData.imagens?.length || 0})
                                </h3>

                                <div className="w-full aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group relative overflow-hidden mb-4">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => {
                                            if (e.target.files) Array.from(e.target.files).forEach(handleImageUpload)
                                        }}
                                    />
                                    <div className="size-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-gray-400 text-3xl group-hover:text-primary">cloud_upload</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">Clique ou arraste</p>
                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG até 5MB</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {formData.imagens?.map((img, idx) => (
                                        <div key={idx} className="aspect-square rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative group">
                                            <img src={img.imagem_url} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                                                <button
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="p-1 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                                </button>
                                            </div>
                                            {idx === 0 && (
                                                <span className="absolute top-1 left-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">CAPA</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card: Status */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">toggle_on</span>
                                    Status
                                </h3>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className={`size-10 rounded-full flex items-center justify-center ${formData.ativo ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                                        <span className="material-symbols-outlined">{formData.ativo ? 'check_circle' : 'do_not_disturb_on'}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">Serviço Ativo</p>
                                        <p className="text-xs text-slate-500">{formData.ativo ? 'Visível no catálogo' : 'Oculto do catálogo'}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.ativo}
                                            onChange={(e) => handleChange('ativo', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-4 z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl font-semibold bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        {loading ? 'Salvando...' : 'Salvar Serviço'}
                    </button>
                </div>
            </div>

            {/* Category Manager Modal Modal */}
            <CategoryManagerModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                initialCategory={categoryModalInitialId}
            />
        </div>
    )
}
