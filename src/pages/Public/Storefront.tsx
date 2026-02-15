import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { publicService, type PublicCompany, type PublicProduct, type Category, type HierarchicalCategory, type LayoutBlock } from '../../services/publicService'
import CategoryChips from './components/CategoryChips'
import StoreLayout from './components/StoreLayout'
import ProductCard from './components/ProductCard'
import HeroSection from './components/HeroSection'
import FlashDeals from './components/FlashDeals'
import PromoBanner from './components/PromoBanner'
import NewsletterSection from './components/NewsletterSection'

const DEFAULT_LAYOUT: LayoutBlock[] = [
    { id: 'hero', active: true, order: 1 },
    { id: 'categories_circle', active: true, order: 2 },
    { id: 'flash_deals', active: true, order: 3 },
    { id: 'featured_products', active: true, order: 4 },
    { id: 'all_products', active: true, order: 5 },
    { id: 'newsletter', active: true, order: 6 },
]

export default function Storefront() {
    const { slug, categoryId } = useParams<{ slug: string; categoryId?: string }>()
    const [company, setCompany] = useState<PublicCompany | null>(null)
    const [products, setProducts] = useState<PublicProduct[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [hierarchicalCategories, setHierarchicalCategories] = useState<HierarchicalCategory[]>([])
    const [activeCategory, setActiveCategory] = useState<string | null>(categoryId || null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) loadData(slug)
    }, [slug])

    useEffect(() => {
        if (categoryId) {
            setActiveCategory(categoryId)
        } else {
            setActiveCategory(null)
        }
    }, [categoryId])

    const loadData = async (slug: string) => {
        try {
            const companyData = await publicService.getCompanyBySlug(slug)
            if (companyData) {
                setCompany(companyData)
                const [productsData, categoriesData, hierarchicalData] = await Promise.all([
                    publicService.getPublicProducts(companyData.id),
                    publicService.getCategories(companyData.id),
                    publicService.getHierarchicalCategories(companyData.id)
                ])
                setProducts(productsData)
                setCategories(categoriesData)
                setHierarchicalCategories(hierarchicalData)

                // SEO: Title dinâmico
                document.title = `${companyData.nome_fantasia} | Loja Online`
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !activeCategory || String(p.categoria_id) === String(activeCategory) || String(p.subcategoria_id) === String(activeCategory)
        return matchesSearch && matchesCategory
    })

    // G1 — Render dinâmico baseado em home_layout
    const renderBlock = (blockId: string): React.ReactNode => {
        const isHome = !activeCategory && !searchTerm

        switch (blockId) {
            case 'hero':
                return isHome ? (
                    <HeroSection
                        key="hero"
                        banners={company?.store_config?.appearance?.hero?.banners}
                        heroType={company?.store_config?.appearance?.hero?.type}
                        autoplay={company?.store_config?.appearance?.hero?.autoplay}
                        interval={company?.store_config?.appearance?.hero?.interval}
                        slug={slug}
                        companyName={company?.nome_fantasia}
                        onSelectCategory={setActiveCategory}
                    />
                ) : null

            case 'categories_circle':
                return categories.length > 0 ? (
                    <div key="categories" className="px-4 md:px-0 mb-6">
                        <CategoryChips
                            categories={categories}
                            activeCategory={activeCategory}
                            onSelectCategory={setActiveCategory}
                        />
                    </div>
                ) : null

            case 'flash_deals':
                return isHome ? (
                    <FlashDeals
                        key="flash_deals"
                        products={products}
                        companyPhone={company!.telefone}
                    />
                ) : null

            case 'featured_products':
                return (
                    <div key="featured_products" className="px-4 md:px-0 flex items-center justify-between mb-8 mt-8">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {activeCategory
                                    ? categories.find(c => c.id_categoria === activeCategory)?.nome_categoria
                                    : 'Ofertas em Destaque'
                                }
                            </h3>
                            {!activeCategory && (
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Preços imbatíveis por tempo limitado</p>
                            )}
                        </div>
                        {!activeCategory && (
                            <button className="text-primary font-bold flex items-center gap-1 hover:underline">
                                Ver todas <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        )}
                    </div>
                )

            case 'all_products':
                return (
                    <div key="all_products" className="px-4 md:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                companyPhone={company!.telefone}
                            />
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-20">
                                <span className="material-symbols-outlined text-6xl text-gray-300 block mb-4">search_off</span>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum produto encontrado.</p>
                            </div>
                        )}
                    </div>
                )

            case 'newsletter':
                return isHome ? (
                    <React.Fragment key="newsletter">
                        <PromoBanner />
                        <NewsletterSection />
                    </React.Fragment>
                ) : null

            default:
                return null
        }
    }

    if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-background-dark flex items-center justify-center text-gray-500">Carregando loja...</div>
    if (!company) return <div className="min-h-screen bg-gray-50 dark:bg-background-dark flex items-center justify-center text-gray-500">Loja não encontrada.</div>

    return (
        <div>
            <StoreLayout
                companyName={company.nome_fantasia}
                logoUrl={company.logo_url}
                telefone={company.telefone}
                email={company.email}
                onCartClick={() => navigate(`/c/${slug}/cart`)}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categories={hierarchicalCategories}
                flatCategories={categories}
                onSelectCategory={setActiveCategory}
                appearance={company.store_config?.appearance}
            >
                {/* === RENDER DINÂMICO BASEADO EM home_layout === */}
                {(() => {
                    const layout = company?.store_config?.appearance?.home_layout
                    const activeBlocks = layout
                        ?.filter(b => b.active)
                        ?.sort((a, b) => a.order - b.order) || DEFAULT_LAYOUT

                    return activeBlocks.map(block => renderBlock(block.id))
                })()}


            </StoreLayout>
        </div>
    )
}
