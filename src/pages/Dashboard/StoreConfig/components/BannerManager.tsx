import { useState } from 'react'
import type { Banner } from '../../../../services/publicService'
import { storeService } from '../../../../services/storeService'

interface BannerManagerProps {
    storeConfig: any
    onUpdate: () => void
}

type ButtonPosition = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center-center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

const POSITION_LABELS: Record<ButtonPosition, string> = {
    'top-left': '↖', 'top-center': '↑', 'top-right': '↗',
    'center-left': '←', 'center-center': '●', 'center-right': '→',
    'bottom-left': '↙', 'bottom-center': '↓', 'bottom-right': '↘'
}

const POSITION_GRID: ButtonPosition[][] = [
    ['top-left', 'top-center', 'top-right'],
    ['center-left', 'center-center', 'center-right'],
    ['bottom-left', 'bottom-center', 'bottom-right']
]

interface BannerForm {
    id?: string
    title: string
    subtitle: string
    desktop_url: string
    mobile_url: string
    button_text: string
    button_color: string
    text_color: string
    button_position: ButtonPosition
    link_type: 'external' | 'product' | 'category'
    link_value: string
}

export default function BannerManager({ storeConfig, onUpdate }: BannerManagerProps) {
    const banners: Banner[] = storeConfig?.appearance?.hero?.banners || []
    const [editingBanner, setEditingBanner] = useState<BannerForm | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    const handleFileUpload = async (file: File, type: 'desktop' | 'mobile') => {
        if (!file) return
        setUploading(true)
        try {
            const url = await storeService.uploadStoreAsset(file)
            if (editingBanner) {
                setEditingBanner({
                    ...editingBanner,
                    [type === 'desktop' ? 'desktop_url' : 'mobile_url']: url
                })
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('Erro ao fazer upload da imagem')
        } finally {
            setUploading(false)
        }
    }

    const handleSaveBanner = async () => {
        if (!editingBanner?.title || !editingBanner?.desktop_url) {
            alert('Preencha pelo menos o título e a imagem desktop')
            return
        }

        setSaving(true)
        try {
            const newBanner: Banner = {
                id: editingBanner.id || `banner-${Date.now()}`,
                title: editingBanner.title,
                subtitle: editingBanner.subtitle || '',
                desktop_url: editingBanner.desktop_url,
                mobile_url: editingBanner.mobile_url || editingBanner.desktop_url,
                button_text: editingBanner.button_text || 'Ver mais',
                button_color: editingBanner.button_color || '#10b77f',
                text_color: editingBanner.text_color || '#ffffff',
                button_position: editingBanner.button_position || 'bottom-left',
                link_type: editingBanner.link_type || 'external',
                link_value: editingBanner.link_value || '#'
            }

            let updatedBanners: Banner[]
            const existingIndex = banners.findIndex(b => b.id === newBanner.id)

            if (existingIndex >= 0) {
                // Editando
                updatedBanners = [...banners]
                updatedBanners[existingIndex] = newBanner
            } else {
                // Criando
                updatedBanners = [...banners, newBanner]
            }

            const updatedConfig = {
                ...storeConfig,
                appearance: {
                    ...storeConfig?.appearance,
                    hero: {
                        ...storeConfig?.appearance?.hero,
                        type: 'carousel',
                        autoplay: true,
                        interval: 5000,
                        banners: updatedBanners
                    }
                }
            }

            await storeService.updateStoreConfig(updatedConfig)
            onUpdate()
            setShowForm(false)
            setEditingBanner(null)
        } catch (error) {
            console.error('Error saving banner:', error)
            alert('Erro ao salvar banner')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteBanner = async (bannerId: string) => {
        if (!confirm('Deseja realmente remover este banner?')) return

        try {
            const updatedBanners = banners.filter(b => b.id !== bannerId)
            const updatedConfig = {
                ...storeConfig,
                appearance: {
                    ...storeConfig?.appearance,
                    hero: {
                        ...storeConfig?.appearance?.hero,
                        banners: updatedBanners
                    }
                }
            }

            await storeService.updateStoreConfig(updatedConfig)
            onUpdate()
        } catch (error) {
            console.error('Error deleting banner:', error)
            alert('Erro ao deletar banner')
        }
    }

    const openEditForm = (banner: Banner) => {
        setEditingBanner({
            id: banner.id,
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            desktop_url: banner.desktop_url,
            mobile_url: banner.mobile_url || '',
            button_text: banner.button_text || '',
            button_color: banner.button_color || '#10b77f',
            text_color: banner.text_color || '#ffffff',
            button_position: banner.button_position || 'bottom-left',
            link_type: banner.link_type || 'external',
            link_value: banner.link_value || ''
        })
        setShowForm(true)
    }

    const openCreateForm = () => {
        setEditingBanner({
            title: '',
            subtitle: '',
            desktop_url: '',
            mobile_url: '',
            button_text: 'Ver mais',
            button_color: '#10b77f',
            text_color: '#ffffff',
            button_position: 'bottom-left',
            link_type: 'external',
            link_value: ''
        })
        setShowForm(true)
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Banners & Hero
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Gerencie os banners de destaque da sua loja
                    </p>
                </div>
                <button
                    onClick={openCreateForm}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Novo Banner
                </button>
            </header>

            {/* Banner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition-shadow"
                    >
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                            <img
                                src={banner.desktop_url}
                                alt={banner.title || 'Banner'}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                    onClick={() => openEditForm(banner)}
                                    className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100"
                                    title="Editar"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteBanner(banner.id!)}
                                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                                    title="Deletar"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold mb-1 line-clamp-1">
                                {banner.title || 'Sem título'}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                {banner.subtitle || 'Sem descrição'}
                            </p>
                            {banner.link_type && (
                                <div className="mt-2 inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                    <span>Link:</span>
                                    <span className="font-bold">{banner.link_type}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {banners.length === 0 && (
                    <div className="col-span-full bg-white dark:bg-surface-dark rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                        <span className="material-symbols-outlined text-gray-300 text-6xl mb-4 block">image</span>
                        <h3 className="font-bold text-lg mb-2">Nenhum banner cadastrado</h3>
                        <p className="text-gray-500 mb-4">
                            Crie seu primeiro banner para destacar produtos e ofertas
                        </p>
                        <button
                            onClick={openCreateForm}
                            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Criar Primeiro Banner
                        </button>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && editingBanner && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-bold tracking-tight">
                                {editingBanner.id ? 'Editar Banner' : 'Novo Banner'}
                            </h3>
                            <button
                                onClick={() => { setShowForm(false); setEditingBanner(null) }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* ——— SEÇÃO: CONTEÚDO ——— */}
                            <fieldset>
                                <legend className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                                    Conteúdo
                                </legend>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                            Título <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={editingBanner.title}
                                            onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                                            placeholder="Ex: Promoção de Verão"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                            Subtítulo
                                        </label>
                                        <input
                                            type="text"
                                            value={editingBanner.subtitle}
                                            onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                                            placeholder="Ex: Até 50% de desconto"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                            Texto do Botão
                                        </label>
                                        <input
                                            type="text"
                                            value={editingBanner.button_text}
                                            onChange={(e) => setEditingBanner({ ...editingBanner, button_text: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                                            placeholder="Ex: Ver Ofertas"
                                        />
                                    </div>
                                </div>
                            </fieldset>

                            <hr className="border-gray-100 dark:border-gray-800" />

                            {/* ——— SEÇÃO: IMAGENS ——— */}
                            <fieldset>
                                <legend className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                                    Imagens
                                </legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Desktop */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                            Desktop <span className="text-red-500">*</span>
                                            <span className="font-normal text-gray-400 ml-1">1200×400</span>
                                        </label>
                                        {editingBanner.desktop_url ? (
                                            <div className="relative group">
                                                <img
                                                    src={editingBanner.desktop_url}
                                                    alt="Preview desktop"
                                                    className="w-full h-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                                />
                                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <span className="text-white text-xs font-bold">Trocar</span>
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'desktop')} disabled={uploading} />
                                                </label>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 text-2xl">cloud_upload</span>
                                                <span className="text-xs text-gray-500 mt-1">Clique para enviar</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'desktop')} disabled={uploading} />
                                            </label>
                                        )}
                                    </div>
                                    {/* Mobile */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                            Mobile
                                            <span className="font-normal text-gray-400 ml-1">600×600 (opcional)</span>
                                        </label>
                                        {editingBanner.mobile_url ? (
                                            <div className="relative group">
                                                <img
                                                    src={editingBanner.mobile_url}
                                                    alt="Preview mobile"
                                                    className="w-full h-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                                />
                                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <span className="text-white text-xs font-bold">Trocar</span>
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'mobile')} disabled={uploading} />
                                                </label>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 text-2xl">cloud_upload</span>
                                                <span className="text-xs text-gray-500 mt-1">Clique para enviar</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'mobile')} disabled={uploading} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                {uploading && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                                        <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                                        Enviando imagem...
                                    </div>
                                )}
                            </fieldset>

                            <hr className="border-gray-100 dark:border-gray-800" />

                            {/* ——— SEÇÃO: ESTILO ——— */}
                            <fieldset>
                                <legend className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                                    Estilo
                                </legend>
                                <div className="space-y-5">
                                    {/* Color pickers row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                                Cor do Botão
                                            </label>
                                            <div className="flex items-center gap-2.5">
                                                <input
                                                    type="color"
                                                    value={editingBanner.button_color}
                                                    onChange={(e) => setEditingBanner({ ...editingBanner, button_color: e.target.value })}
                                                    className="size-10 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer p-0.5"
                                                />
                                                <span className="text-xs text-gray-500 font-mono tracking-wide">{editingBanner.button_color}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                                Cor do Texto
                                            </label>
                                            <div className="flex items-center gap-2.5">
                                                <input
                                                    type="color"
                                                    value={editingBanner.text_color}
                                                    onChange={(e) => setEditingBanner({ ...editingBanner, text_color: e.target.value })}
                                                    className="size-10 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer p-0.5"
                                                />
                                                <span className="text-xs text-gray-500 font-mono tracking-wide">{editingBanner.text_color}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Live Preview */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                            Preview
                                        </label>
                                        <div className="relative h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900">
                                            {editingBanner.desktop_url && (
                                                <img src={editingBanner.desktop_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                            )}
                                            <div className="relative h-full flex items-end p-3">
                                                <div className="flex flex-col gap-1">
                                                    {editingBanner.title && (
                                                        <span className="text-xs font-bold drop-shadow" style={{ color: editingBanner.text_color }}>
                                                            {editingBanner.title}
                                                        </span>
                                                    )}
                                                    {editingBanner.button_text && (
                                                        <span
                                                            className="inline-block px-2.5 py-1 rounded text-[10px] font-bold w-fit drop-shadow"
                                                            style={{ backgroundColor: editingBanner.button_color, color: editingBanner.text_color }}
                                                        >
                                                            {editingBanner.button_text}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Position Grid */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                            Posição do Conteúdo
                                        </label>
                                        <div className="flex items-start gap-4">
                                            <div className="relative w-[160px] h-[108px] bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                {editingBanner.desktop_url && (
                                                    <img src={editingBanner.desktop_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                                                )}
                                                <div className="relative grid grid-cols-3 grid-rows-3 w-full h-full">
                                                    {POSITION_GRID.flat().map((pos) => (
                                                        <button
                                                            key={pos}
                                                            type="button"
                                                            onClick={() => setEditingBanner({ ...editingBanner, button_position: pos })}
                                                            className={`flex items-center justify-center text-xs font-bold transition-all duration-150 ${editingBanner.button_position === pos
                                                                ? 'text-white scale-110'
                                                                : 'text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-700/60'
                                                                }`}
                                                            style={editingBanner.button_position === pos ? { backgroundColor: editingBanner.button_color } : {}}
                                                            title={pos}
                                                        >
                                                            {POSITION_LABELS[pos]}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
                                                <p className="font-semibold text-gray-700 dark:text-gray-300">Selecionado:</p>
                                                <span
                                                    className="inline-block px-2 py-1 rounded text-xs font-bold"
                                                    style={{ backgroundColor: editingBanner.button_color, color: editingBanner.text_color }}
                                                >
                                                    {editingBanner.button_position?.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                                </span>
                                                <p className="text-gray-400 mt-1">Clique no grid para<br />reposicionar.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>

                            <hr className="border-gray-100 dark:border-gray-800" />

                            {/* ——— SEÇÃO: LINK ——— */}
                            <fieldset>
                                <legend className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                                    Ação do Clique
                                </legend>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                            Tipo de Link
                                        </label>
                                        <select
                                            value={editingBanner.link_type}
                                            onChange={(e) => setEditingBanner({ ...editingBanner, link_type: e.target.value as any })}
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                                        >
                                            <option value="external">Link Externo</option>
                                            <option value="product">Produto</option>
                                            <option value="category">Categoria</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                                            Destino
                                        </label>
                                        <input
                                            type="text"
                                            value={editingBanner.link_value}
                                            onChange={(e) => setEditingBanner({ ...editingBanner, link_value: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                                            placeholder={editingBanner.link_type === 'external' ? 'https://...' : 'ID do item'}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/30">
                            <button
                                onClick={() => { setShowForm(false); setEditingBanner(null) }}
                                className="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveBanner}
                                disabled={saving || uploading || !editingBanner.title || !editingBanner.desktop_url}
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50 transition-all active:scale-[0.98]"
                            >
                                {saving ? 'Salvando...' : 'Salvar Banner'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
