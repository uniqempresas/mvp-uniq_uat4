import { useState, useEffect } from 'react'
import { productService, type Product, type ProductVariation, type ProductImage } from '../../services/productService'
import { categoryService, type Category, type Subcategory } from '../../services/categoryService'
import CategoryManagerModal from '../../components/Catalog/CategoryManagerModal'

interface ProductFormProps {
    onNavigate?: (view: string) => void
    productId?: number
}

// Helper for money mask
const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value)
}



const generateSKU = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomLetters = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')
    const randomNumbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${randomLetters}-${randomNumbers}`
}

const generateEAN = () => {
    let ean = '789'
    for (let i = 0; i < 9; i++) {
        ean += Math.floor(Math.random() * 10)
    }

    let sum = 0
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(ean[i])
        // EAN-13 check digit: odd positions * 1, even positions * 3
        if (i % 2 === 0) {
            sum += digit * 1
        } else {
            sum += digit * 3
        }
    }

    const remainder = sum % 10
    const checkDigit = remainder === 0 ? 0 : 10 - remainder

    return ean + checkDigit
}

export default function ProductForm({ onNavigate, productId }: ProductFormProps) {
    const [loading, setLoading] = useState(false)
    const [productType, setProductType] = useState<'simples' | 'variavel'>('simples')

    // Data Sources
    const [categories, setCategories] = useState<Category[]>([])
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])

    // Modal State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [categoryModalInitialId, setCategoryModalInitialId] = useState<number | undefined>(undefined)

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        nome_produto: '',
        descricao: '',
        preco: 0,
        preco_custo: 0,
        preco_varejo: 0,
        estoque_atual: 0,
        sku: '',
        tipo: 'simples',
        ativo: true,
        categoria_id: undefined,
        subcategoria_id: undefined,
        id: undefined,
        exibir_vitrine: true,
        imagens: []
    })

    // Variations State
    const [variations, setVariations] = useState<ProductVariation[]>([])
    const [variationConfig, setVariationConfig] = useState<{ name: string, values: string[] }[]>([
        { name: 'Tamanho', values: [] }
    ])
    const [newVariationValue, setNewVariationValue] = useState('')

    // Load Categories
    useEffect(() => {
        loadCategories()
        // Auto-generate for new products
        if (!productId && !formData.sku && !formData.id) { // formData.id check depends if it's set initially, usually undefined for new
            // Basic heuristic: if name is empty, likely new.
            if (!formData.nome_produto) {
                setFormData(prev => ({
                    ...prev,
                    sku: generateSKU(),
                    codigo_barras: generateEAN()
                }))
            }
        } else if (productId) {
            loadProduct(productId)
        }
    }, [productId])

    const loadProduct = async (id: number) => {
        setLoading(true)
        try {
            const product = await productService.getProductById(id)
            setFormData(product)
            setProductType(product.tipo || 'simples')
            if (product.variacoes && product.variacoes.length > 0) {
                setVariations(product.variacoes)
                // Derive config from existing variations
                // Assuming single attribute 'Tamanho' for MVP, or we need to check keys
                const allAttrs = product.variacoes.map(v => v.atributos)
                const attrKeys = Array.from(new Set(allAttrs.flatMap(Object.keys)))

                if (attrKeys.length > 0) {
                    const primaryAttr = attrKeys[0] // Take first as primary for MVP
                    const values = Array.from(new Set(allAttrs.map(a => a[primaryAttr]).filter(Boolean)))
                    setVariationConfig([{ name: primaryAttr, values }])
                }
            }
            if (product.categoria_id) {
                loadSubcategories(product.categoria_id)
            }
        } catch (error) {
            console.error('Error loading product', error)
            alert('Erro ao carregar produto')
        } finally {
            setLoading(false)
        }
    }

    // Load Subcategories when Category changes
    useEffect(() => {
        if (formData.categoria_id) {
            loadSubcategories(formData.categoria_id)
        } else {
            setSubcategories([])
        }
    }, [formData.categoria_id])

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategories()
            setCategories(data)
        } catch (error) {
            console.error('Error loading categories', error)
        }
    }

    const loadSubcategories = async (catId: number) => {
        try {
            const data = await categoryService.getSubcategories(catId)
            setSubcategories(data)
        } catch (error) {
            console.error('Error loading subcategories', error)
        }
    }

    // Handle normal form change
    const handleChange = (field: keyof Product, value: any) => {
        let finalValue = value

        // Specific logic for IDs
        if (field === 'categoria_id' || field === 'subcategoria_id') {
            finalValue = value === '' ? undefined : Number(value)
        }

        setFormData(prev => {
            const updates: any = { [field]: finalValue }
            // Reset subcategory if category changes
            if (field === 'categoria_id') {
                updates.subcategoria_id = undefined
            }
            return { ...prev, ...updates }
        })
    }

    const handleMoneyChange = (field: keyof Product, value: string) => {
        // Remove non-numeric
        const numericValue = value.replace(/\D/g, '')
        // Convert to float
        const floatValue = Number(numericValue) / 100
        setFormData(prev => ({ ...prev, [field]: floatValue }))
    }

    // Handle Variation Config
    const addVariationValue = (index: number) => {
        if (!newVariationValue.trim()) return
        const updatedConfig = [...variationConfig]
        updatedConfig[index].values.push(newVariationValue)
        setVariationConfig(updatedConfig)
        setNewVariationValue('')
        generateVariations(updatedConfig)
    }

    const removeVariationValue = (configIndex: number, valueIndex: number) => {
        const updatedConfig = [...variationConfig]
        updatedConfig[configIndex].values.splice(valueIndex, 1)
        setVariationConfig(updatedConfig)
        generateVariations(updatedConfig)
    }

    // Generate cartesian product of variations
    const generateVariations = (config: typeof variationConfig) => {
        const newVariations: ProductVariation[] = []
        const attrName = config[0].name
        const values = config[0].values

        values.forEach(val => {
            // Updated matching logic: check both by attribute value AND handle potential legacy formats
            const existing = variations.find(v =>
                v.atributos[attrName] === val // Match precisely by current attribute
            )

            if (existing) {
                newVariations.push(existing)
            } else {
                newVariations.push({
                    sku: `${formData.sku || 'SKU'}-${val}`,
                    preco_varejo: formData.preco || 0,
                    preco_custo: formData.preco_custo || 0,
                    estoque_atual: 0,
                    atributos: { [attrName]: val },
                    foto_url: '' // Init empty
                })
            }
        })
        setVariations(newVariations)
    }

    const updateVariation = (index: number, field: keyof ProductVariation, value: any) => {
        const updated = [...variations]
        updated[index] = { ...updated[index], [field]: value }
        setVariations(updated)
    }

    const updateVariationMoney = (index: number, field: 'preco_varejo' | 'preco_custo', value: string) => {
        // Remove non-numeric
        const numericValue = value.replace(/\D/g, '')
        // Convert to float
        const floatValue = Number(numericValue) / 100

        const updated = [...variations]
        updated[index] = { ...updated[index], [field]: floatValue }
        setVariations(updated)
    }

    const handleImageUpload = async (file: File) => {
        try {
            setLoading(true)
            const url = await productService.uploadProductImage(file)
            setFormData(prev => {
                const currentImages = prev.imagens || []
                const newImage: ProductImage = {
                    imagem_url: url,
                    ordem_exibicao: currentImages.length
                }
                const newImages = [...currentImages, newImage]
                return {
                    ...prev,
                    imagens: newImages,
                    foto_url: newImages[0]?.imagem_url
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
            // Reorder
            const reordered = currentImages.map((img, idx) => ({ ...img, ordem_exibicao: idx }))
            return {
                ...prev,
                imagens: reordered,
                foto_url: reordered[0]?.imagem_url || ''
            }
        })
    }

    const handleSave = async () => {
        if (!formData.nome_produto) {
            alert('Nome do produto é obrigatório')
            return
        }

        setLoading(true)
        try {
            if (productId || formData.id) {
                await productService.updateProduct(productId || formData.id!, {
                    ...formData,
                    tipo: productType
                }, productType === 'variavel' ? variations : [], formData.imagens || [])
            } else {
                await productService.createProduct({
                    ...formData,
                    tipo: productType
                }, productType === 'variavel' ? variations : [], formData.imagens || [])
            }

            alert('Produto salvo com sucesso!')
            onNavigate?.('products')
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar produto')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-main-bg bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="h-16 bg-white/80 dark:bg-black/20 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 sticky top-0 z-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <button onClick={() => onNavigate?.('home')} className="text-gray-500 hover:text-primary transition-colors">Dashboard</button>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-gray-900 font-medium">Produtos</span>
                </nav>
                {/* Top Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <button className="text-gray-500 hover:text-primary transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </header>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Page Heading & Actions */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">{productId ? 'Editar Produto' : 'Novo Produto'}</h1>
                            <p className="text-slate-500 dark:text-gray-400 text-sm md:max-w-xl">Preencha as informações detalhadas do produto para disponibilizá-lo em seus canais de venda.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onNavigate?.('products')}
                                className="px-6 h-10 rounded-lg border border-transparent text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-6 h-10 rounded-lg border border-transparent text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-all shadow-md shadow-emerald-200 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">check</span>
                                {loading ? 'Salvando...' : 'Salvar Produto'}
                            </button>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Card: Informações Básicas */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">feed</span>
                                    Informações Básicas
                                </h3>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Nome do Produto <span className="text-red-500">*</span></span>
                                            <input
                                                value={formData.nome_produto}
                                                onChange={(e) => handleChange('nome_produto', e.target.value)}
                                                className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none px-3"
                                                placeholder="Ex: Camiseta Básica Algodão UNIQ"
                                                type="text"
                                            />
                                        </label>
                                    </div>

                                    {/* Description */}
                                    <div className="grid grid-cols-1 gap-5">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Descrição</span>
                                            <textarea
                                                value={formData.descricao || ''}
                                                onChange={(e) => handleChange('descricao', e.target.value)}
                                                className="w-full h-24 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none p-3 resize-none"
                                                placeholder="Descreva os detalhes do produto..."
                                            />
                                        </label>
                                    </div>

                                    {/* Category Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Categoria</span>
                                            <div className="flex gap-2">
                                                <select
                                                    value={formData.categoria_id || ''}
                                                    onChange={(e) => handleChange('categoria_id', e.target.value)}
                                                    className="flex-1 h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm transition-all text-slate-700 outline-none px-3"
                                                >
                                                    <option value="">Selecione...</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome_categoria}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        setCategoryModalInitialId(undefined)
                                                        setIsCategoryModalOpen(true)
                                                    }}
                                                    className="size-11 flex-shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center"
                                                    title="Gerenciar Categorias"
                                                >
                                                    <span className="material-symbols-outlined">create_new_folder</span>
                                                </button>
                                            </div>
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Subcategoria</span>
                                            <div className="flex gap-2">
                                                <select
                                                    value={formData.subcategoria_id || ''}
                                                    onChange={(e) => handleChange('subcategoria_id', e.target.value)}
                                                    disabled={!formData.categoria_id}
                                                    className="flex-1 h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm transition-all text-slate-700 outline-none px-3 disabled:opacity-50"
                                                >
                                                    <option value="">Selecione...</option>
                                                    {subcategories.map(sub => (
                                                        <option key={sub.id_subcategoria} value={sub.id_subcategoria}>{sub.nome_subcategoria}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        if (!formData.categoria_id) {
                                                            alert('Selecione uma categoria primeiro')
                                                            return
                                                        }
                                                        setCategoryModalInitialId(formData.categoria_id)
                                                        setIsCategoryModalOpen(true)
                                                    }}
                                                    className="size-11 flex-shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center"
                                                    title="Gerenciar Subcategorias"
                                                >
                                                    <span className="material-symbols-outlined">create_new_folder</span>
                                                </button>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Product Type Toggle */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Tipo de Produto</span>
                                            <div className="flex bg-gray-100 p-1 rounded-lg h-11">
                                                <button
                                                    type="button"
                                                    onClick={() => setProductType('simples')}
                                                    className={`flex-1 text-sm font-medium rounded-md transition-all ${productType === 'simples'
                                                        ? 'bg-white text-primary shadow-sm'
                                                        : 'text-slate-500 hover:text-slate-700'
                                                        }`}
                                                >
                                                    Simples
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setProductType('variavel')}
                                                    className={`flex-1 text-sm font-medium rounded-md transition-all ${productType === 'variavel'
                                                        ? 'bg-white text-primary shadow-sm'
                                                        : 'text-slate-500 hover:text-slate-700'
                                                        }`}
                                                >
                                                    Com Variações
                                                </button>
                                            </div>
                                        </label>
                                    </div>

                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">Descrição Detalhada</span>
                                        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                                            {/* Toolbar simulated */}
                                            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                                                <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                                                <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                                                <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                                                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                                <button className="p-1 hover:bg-gray-200 rounded text-gray-500"><span className="material-symbols-outlined text-[18px]">link</span></button>
                                            </div>
                                            <textarea
                                                value={formData.descricao || ''}
                                                onChange={(e) => handleChange('descricao', e.target.value)}
                                                className="w-full border-0 focus:ring-0 text-sm p-4 h-32 resize-none outline-none"
                                                placeholder="Descreva as características principais do produto..."
                                            ></textarea>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 text-right">{formData.descricao?.length || 0}/2000 caracteres</p>
                                    </label>
                                </div>
                            </div>

                            {/* Card: Variacoes (Only if Variable) */}
                            {productType === 'variavel' && (
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">style</span>
                                        Variações
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <label className="block mb-2 text-sm font-medium text-slate-700">Opções de {variationConfig[0].name}</label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                value={newVariationValue}
                                                onChange={(e) => setNewVariationValue(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addVariationValue(0)}
                                                className="flex-1 h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
                                                placeholder="Digite uma opção (ex: P, M, G, Azul) e tecle Enter"
                                            />
                                            <button onClick={() => addVariationValue(0)} className="bg-primary hover:bg-primary-dark text-white px-4 rounded-lg text-sm font-medium transition-colors">Adicionar</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {variationConfig[0].values.map((val, idx) => (
                                                <span key={idx} className="bg-white border px-2 py-1 rounded text-sm flex items-center gap-2 text-slate-700">
                                                    {val}
                                                    <button onClick={() => removeVariationValue(0, idx)} className="text-red-500 hover:bg-red-50 rounded-full p-0.5 flex items-center justify-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {variations.length > 0 && (
                                        <div className="overflow-x-auto border rounded-lg">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                                    <tr>
                                                        <th className="px-4 py-3">Variação</th>
                                                        <th className="px-4 py-3">Imagem</th>
                                                        <th className="px-4 py-3">SKU</th>
                                                        <th className="px-4 py-3">Preço Custo</th>
                                                        <th className="px-4 py-3">Preço Venda</th>
                                                        <th className="px-4 py-3">Estoque</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 bg-white">
                                                    {variations.map((v, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-4 py-2 font-medium text-slate-700">{Object.values(v.atributos).join(' / ')}</td>
                                                            <td className="px-4 py-2">
                                                                <div className="relative group size-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden">
                                                                    {v.foto_url ? (
                                                                        <img src={v.foto_url} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="material-symbols-outlined text-gray-400 text-xs">image</span>
                                                                    )}
                                                                    <input
                                                                        type="file"
                                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                                        onChange={async (e) => {
                                                                            const file = e.target.files?.[0]
                                                                            if (file) {
                                                                                try {
                                                                                    setLoading(true) // Global loading might be annoying but safe
                                                                                    const url = await productService.uploadProductImage(file)
                                                                                    updateVariation(idx, 'foto_url', url)
                                                                                } catch (error) {
                                                                                    console.error(error)
                                                                                    alert('Erro ao fazer upload da imagem da variação')
                                                                                } finally {
                                                                                    setLoading(false)
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <input
                                                                    value={v.sku}
                                                                    onChange={(e) => updateVariation(idx, 'sku', e.target.value)}
                                                                    className="w-28 text-xs border-gray-300 rounded focus:border-primary focus:ring-primary/20 outline-none px-2 h-8"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <div className="relative">
                                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs text-[10px]">R$</span>
                                                                    <input
                                                                        type="text"
                                                                        value={formatMoney(v.preco_custo || 0)}
                                                                        onChange={(e) => updateVariationMoney(idx, 'preco_custo', e.target.value)}
                                                                        className="w-24 pl-6 text-xs border-gray-300 rounded focus:border-primary focus:ring-primary/20 outline-none h-8"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <div className="relative">
                                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs text-[10px]">R$</span>
                                                                    <input
                                                                        type="text"
                                                                        value={formatMoney(v.preco_varejo || 0)}
                                                                        onChange={(e) => updateVariationMoney(idx, 'preco_varejo', e.target.value)}
                                                                        className="w-24 pl-6 text-xs border-gray-300 rounded focus:border-primary focus:ring-primary/20 outline-none h-8"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <input
                                                                    type="number"
                                                                    value={v.estoque_atual}
                                                                    onChange={(e) => updateVariation(idx, 'estoque_atual', Number(e.target.value))}
                                                                    className="w-20 text-xs border-gray-300 rounded focus:border-primary focus:ring-primary/20 outline-none px-2 h-8"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Card: Preços e Estoque (Only for Simple) */}
                            {productType === 'simples' && (
                                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">payments</span>
                                        Preços & Estoque
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Preço de Venda</span>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                                                <input
                                                    className="w-full h-11 pl-10 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm font-medium placeholder:text-gray-400 transition-all outline-none"
                                                    placeholder="0,00"
                                                    type="text"
                                                    value={formatMoney(formData.preco || 0)}
                                                    onChange={(e) => handleMoneyChange('preco', e.target.value)}
                                                />
                                            </div>
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Preço de Custo</span>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                                                <input
                                                    className="w-full h-11 pl-10 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none"
                                                    placeholder="0,00"
                                                    type="text"
                                                    value={formatMoney(formData.preco_custo || 0)}
                                                    onChange={(e) => handleMoneyChange('preco_custo', e.target.value)}
                                                />
                                            </div>
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Preço Promocional</span>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R$</span>
                                                <input
                                                    className="w-full h-11 pl-10 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none"
                                                    placeholder="0,00"
                                                    type="text"
                                                    value={formatMoney(formData.preco_varejo || 0)}
                                                    onChange={(e) => handleMoneyChange('preco_varejo', e.target.value)}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                    <div className="w-full h-px bg-gray-100 my-6"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Estoque Atual</span>
                                            <input
                                                className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none px-3"
                                                placeholder="0"
                                                type="number"
                                                value={formData.estoque_atual}
                                                onChange={(e) => handleChange('estoque_atual', Number(e.target.value))}
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-slate-700 mb-1.5 block">Estoque Mínimo (Alerta)</span>
                                            <input
                                                className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none px-3"
                                                placeholder="5"
                                                type="number"
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Media & Organization */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Card: Imagem do Produto (Gallery) */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">image</span>
                                    Mídia ({formData.imagens?.length || 0})
                                </h3>

                                {/* Dropzone */}
                                <div className="w-full aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group/upload relative overflow-hidden mb-4">
                                    <input
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        type="file"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                Array.from(e.target.files).forEach(handleImageUpload)
                                            }
                                        }}
                                    />
                                    <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover/upload:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-gray-400 text-3xl group-hover/upload:text-primary">cloud_upload</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">Clique ou arraste</p>
                                    <p className="text-xs text-slate-500 mt-1">PNG, JPG até 5MB</p>
                                </div>

                                {/* Thumbnails */}
                                <div className="grid grid-cols-4 gap-2">
                                    {formData.imagens?.map((img, idx) => (
                                        <div key={idx} className="aspect-square rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative group">
                                            <img src={img.imagem_url} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all gap-2">
                                                <button
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                    title="Remover"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                                </button>
                                            </div>
                                            {idx === 0 && (
                                                <div className="absolute top-1 left-1 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Capa</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card: Codificação */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">qr_code</span>
                                    Codificação
                                </h3>
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">SKU (Código Interno)</span>
                                        <input
                                            className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all uppercase outline-none px-3"
                                            placeholder="PRD-0001"
                                            type="text"
                                            value={formData.sku || ''}
                                            onChange={(e) => handleChange('sku', e.target.value)}
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700 mb-1.5 block">Código de Barras</span>
                                        <div className="flex gap-2">
                                            <input
                                                className="w-full h-11 rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-primary/20 text-sm placeholder:text-gray-400 transition-all outline-none px-3"
                                                placeholder="789..."
                                                type="text"
                                                value={formData.codigo_barras || ''}
                                                onChange={(e) => handleChange('codigo_barras', e.target.value)}
                                            />
                                            <button
                                                onClick={() => handleChange('codigo_barras', generateEAN())}
                                                className="size-11 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                                                title="Gerar código"
                                            >
                                                <span className="material-symbols-outlined">autorenew</span>
                                            </button>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Card: Status e Visibilidade */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">visibility</span>
                                    Visibilidade
                                </h3>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-700">Produto Ativo</span>
                                        <span className="text-xs text-slate-500">Disponível para venda</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.ativo}
                                            onChange={(e) => handleChange('ativo', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-700">Exibir no Catálogo</span>
                                        <span className="text-xs text-slate-500">Público na vitrine digital</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.exibir_vitrine}
                                            onChange={(e) => handleChange('exibir_vitrine', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Manager Modal */}
            <CategoryManagerModal
                isOpen={isCategoryModalOpen}
                onClose={() => {
                    setIsCategoryModalOpen(false)
                    loadCategories() // Refresh in case of changes
                    if (formData.categoria_id) loadSubcategories(formData.categoria_id) // Refresh subs if needed
                }}
                initialCategory={categoryModalInitialId}
            />
        </div>
    )
}
