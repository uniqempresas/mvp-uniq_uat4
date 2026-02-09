import { useState, useEffect } from 'react'
import { serviceService, type Service } from '../../services/serviceService'
import { categoryService, type Category } from '../../services/categoryService'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import MobileCard from '../../components/Mobile/MobileCard'
import ServiceForm from './ServiceForm'

interface ServiceListProps {
    onNavigate?: (view: string) => void
}

export default function ServiceList({ onNavigate }: ServiceListProps) {
    const [services, setServices] = useState<Service[]>([])
    const [filteredServices, setFilteredServices] = useState<Service[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | undefined>(undefined)

    // Filtros
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('Todas Categorias')

    // Load Data
    const fetchData = async () => {
        setIsLoading(true)
        try {
            // Carregar serviços e categorias em paralelo
            const [servicesData, categoriesData] = await Promise.all([
                serviceService.getServices(),
                categoryService.getCategories()
            ])

            setServices(servicesData)
            setFilteredServices(servicesData)
            setCategories(categoriesData)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Filter Logic
    useEffect(() => {
        let result = services

        // 1. Busca textual
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase()
            result = result.filter(service =>
                service.nome.toLowerCase().includes(term) ||
                service.descricao?.toLowerCase().includes(term) ||
                // Verifica categoria string legada ou busca nome no array de categorias
                service.categoria?.toLowerCase().includes(term)
            )
        }

        // 2. Filtro de Categoria
        if (filterCategory !== 'Todas Categorias') {
            const catId = Number(filterCategory)
            if (!isNaN(catId)) {
                // Se for ID numérico
                result = result.filter(s => s.categoria_id === catId)
            } else {
                // Fallback para string legada
                result = result.filter(s => s.categoria === filterCategory)
            }
        }

        setFilteredServices(result)
    }, [searchTerm, filterCategory, services])

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            await serviceService.deleteService(id)
            fetchData() // Refresh list
        }
    }

    const openEdit = (service: Service, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingService(service)
        setIsFormOpen(true)
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDuration = (minutes?: number) => {
        if (!minutes) return '-'
        if (minutes < 60) return `${minutes}min`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
    }

    // Helper para obter nome da categoria
    const getCategoryName = (service: Service) => {
        if (service.categoria_id) {
            return categories.find(c => c.id_categoria === service.categoria_id)?.nome_categoria || '-'
        }
        return service.categoria || '-'
    }

    const { isMobile } = useBreakpoint()

    const renderMobileCard = (service: Service) => (
        <MobileCard
            key={service.id}
            avatar={
                service.foto_url || (
                    <span className="material-symbols-outlined text-gray-300">handyman</span>
                )
            }
            title={service.nome}
            subtitle={service.descricao}
            badge={
                service.ativo
                    ? { label: 'Ativo', color: 'green' }
                    : { label: 'Inativo', color: 'gray' }
            }
            fields={[
                { label: 'Categoria', value: getCategoryName(service) },
                { label: 'Preço', value: formatCurrency(service.preco) },
                { label: 'Duração', value: formatDuration(service.duracao), icon: 'schedule' }
            ]}
            actions={[
                {
                    icon: 'edit',
                    onClick: (e) => openEdit(service, e),
                    color: 'blue',
                    title: 'Editar'
                },
                {
                    icon: 'delete',
                    onClick: (e) => handleDelete(service.id, e),
                    color: 'red',
                    title: 'Excluir'
                }
            ]}
        />
    )

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F3F4F6]">
            {/* Header */}
            <header className="flex-none px-8 py-6 pb-2">
                <nav className="flex items-center text-sm font-medium text-slate-500 mb-4">
                    <a className="hover:text-primary transition-colors cursor-pointer" onClick={() => onNavigate?.('home')}>
                        Minha Empresa
                    </a>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-primary font-semibold">Serviços</span>
                </nav>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Catálogo de Serviços</h1>
                        <p className="text-slate-500">Gerencie os serviços oferecidos pela sua empresa.</p>
                    </div>
                    <button
                        onClick={() => { setEditingService(undefined); setIsFormOpen(true) }}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-primary/30 transition-all active:scale-95 hover:shadow-md"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Novo Serviço
                    </button>
                </div>
            </header>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
                {/* Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">

                    {/* Filters */}
                    <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-white">
                        <div className="relative w-full lg:max-w-md group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                                placeholder="Buscar por nome, categoria..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <select
                                className="h-10 px-3 rounded-lg border border-gray-200 text-sm text-slate-600 focus:border-primary focus:ring-primary/20 outline-none bg-gray-50 cursor-pointer min-w-[160px]"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="Todas Categorias">Todas Categorias</option>
                                {categories.map((cat, index) => (
                                    <option key={`${cat.id_categoria}-${index}`} value={cat.id_categoria}>{cat.nome_categoria}</option>
                                ))}
                                {/* Opção para itens legados se necessário */}
                                <option value="Consultoria">Consultoria (Legado)</option>
                            </select>
                            <div className="text-sm text-gray-400 font-medium px-2 whitespace-nowrap">
                                {filteredServices.length} resultados
                            </div>
                        </div>
                    </div>

                    {isMobile ? (
                        // Mobile Card Layout
                        <div className="p-4 grid gap-4">
                            {isLoading ? (
                                <div className="py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                                        <p>Carregando serviços...</p>
                                    </div>
                                </div>
                            ) : filteredServices.length === 0 ? (
                                <div className="py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                                        <p>{searchTerm ? 'Nenhum serviço encontrado com essa busca.' : 'Nenhum serviço cadastrado ainda.'}</p>
                                    </div>
                                </div>
                            ) : (
                                filteredServices.map(renderMobileCard)
                            )}
                        </div>
                    ) : (
                        // Desktop Table Layout
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Serviço</th>
                                        <th className="px-6 py-4">Categoria</th>
                                        <th className="px-6 py-4">Preço</th>
                                        <th className="px-6 py-4">Duração</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isLoading ? (
                                        <tr><td colSpan={6} className="p-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                                                <p>Carregando serviços...</p>
                                            </div>
                                        </td></tr>
                                    ) : filteredServices.length === 0 ? (
                                        <tr><td colSpan={6} className="p-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                                                <p>{searchTerm ? 'Nenhum serviço encontrado com essa busca.' : 'Nenhum serviço cadastrado ainda.'}</p>
                                            </div>
                                        </td></tr>
                                    ) : (
                                        filteredServices.map(service => (
                                            <tr
                                                key={service.id}
                                                className="hover:bg-gray-50/80 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        {/* Avatar / Foto */}
                                                        <div className="size-12 rounded-lg bg-gray-100 shrink-0 bg-cover bg-center border border-gray-200 relative overflow-hidden flex items-center justify-center">
                                                            {service.foto_url ? (
                                                                <img src={service.foto_url} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="material-symbols-outlined text-gray-300">handyman</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 text-sm">{service.nome}</p>
                                                            {service.descricao && (
                                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-[200px]">{service.descricao}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                        {getCategoryName(service)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {formatCurrency(service.preco)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                        <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                                                        {formatDuration(service.duracao)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${service.ativo
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                                        }`}>
                                                        <span className={`size-1.5 rounded-full ${service.ativo ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                                        {service.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => openEdit(service, e)}
                                                            className="text-slate-400 hover:text-primary hover:bg-primary/5 transition-all p-2 rounded-lg"
                                                            title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(service.id, e)}
                                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-lg"
                                                            title="Excluir"
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
                    )}
                </div>
            </div>

            <ServiceForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editingService}
                onSuccess={fetchData} // Recarrega dados ao salvar
            />
        </div>
    )
}
