import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { publicService, type PublicCompany, type PublicProduct, type Category } from '../../services/publicService'
import CartDrawer from '../../components/Storefront/CartDrawer'
import CategoryChips from './components/CategoryChips'
import StoreLayout from './components/StoreLayout'
import ProductCard from './components/ProductCard'
import HeroSection from './components/HeroSection'
import PromoBanner from './components/PromoBanner'
import NewsletterSection from './components/NewsletterSection'

export default function Storefront() {
    const { slug, categoryId } = useParams<{ slug: string; categoryId?: string }>()
    const [company, setCompany] = useState<PublicCompany | null>(null)
    const [products, setProducts] = useState<PublicProduct[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [activeCategory, setActiveCategory] = useState<string | null>(categoryId || null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCartOpen, setIsCartOpen] = useState(false)

    useEffect(() => {
        if (slug) loadData(slug)
    }, [slug])

    // Update active category when URL param changes
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
                const [productsData, categoriesData] = await Promise.all([
                    publicService.getPublicProducts(companyData.id),
                    publicService.getCategories(companyData.id)
                ])
                setProducts(productsData)
                setCategories(categoriesData)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }



    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !activeCategory || String(p.categoria_id) === activeCategory
        return matchesSearch && matchesCategory
    })

    if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-background-dark flex items-center justify-center text-gray-500">Carregando loja...</div>
    if (!company) return <div className="min-h-screen bg-gray-50 dark:bg-background-dark flex items-center justify-center text-gray-500">Loja não encontrada.</div>

    return (
        <StoreLayout
            companyName={company.nome_fantasia}
            onCartClick={() => setIsCartOpen(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
        >
            {/* Category Chips (Top Nav) */}
            {categories.length > 0 && (
                <div className="px-4 md:px-0 mb-6">
                    <CategoryChips
                        categories={categories}
                        activeCategory={activeCategory}
                        onSelectCategory={setActiveCategory}
                    />
                </div>
            )}

            {/* Hero Section (Only on Home or when no specific category selected? - Reference shows it always, maybe?) */}
            {/* Let's show it only when no category is active or search is empty to imitate "Home" feel, or always. Reference shows it on "Vitrine Principal". */}
            {!activeCategory && !searchTerm && (
                <HeroSection />
            )}

            {/* Section Header */}
            <div className="px-4 md:px-0 flex items-center justify-between mb-8 mt-8">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {activeCategory
                            ? categories.find(c => c.id === activeCategory)?.nome_categoria
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

            {/* Product Grid */}
            <div className="px-4 md:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        companyPhone={company.telefone}
                    />
                ))}

                {filteredProducts.length === 0 && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-gray-300 block mb-4">search_off</span>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum produto encontrado.</p>
                    </div>
                )}
            </div>

            {/* Sections only on "Home" view */}
            {!activeCategory && !searchTerm && (
                <>
                    <PromoBanner />
                    <NewsletterSection />
                </>
            )}

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                companyPhone={company.telefone}
                companyName={company.nome_fantasia}
            />
        </StoreLayout>
    )
}
