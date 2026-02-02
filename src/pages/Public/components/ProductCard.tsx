import { useNavigate, useParams } from 'react-router-dom'
import { type PublicProduct } from '../../../services/publicService'
import { useCart } from '../../../contexts/CartContext'

interface ProductCardProps {
    product: PublicProduct
    companyPhone?: string
}

export default function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate()
    const { slug } = useParams<{ slug: string }>()
    const { addItem } = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        const variacao = product.variacoes?.[0]
        addItem(product, variacao)
        alert('Produto adicionado ao carrinho!')
    }

    const renderPrice = () => {
        // 1. With Variations
        if (product.variacoes && product.variacoes.length > 0) {
            const precos = product.variacoes
                .map((v: any) => Number(v.preco_varejo || 0))
                .filter((p: number) => p > 0)

            if (precos.length === 0) {
                return <span className="text-sm text-gray-600 font-medium">Consulte</span>
            }

            const menorPreco = Math.min(...precos)
            return (
                <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">A partir de</p>
                    <p className="text-xl md:text-2xl font-extrabold text-primary">
                        R$ {menorPreco.toFixed(2).replace('.', ',')}
                    </p>
                </div>
            )
        }

        // 2. Simple Product
        const precoFinal = product.preco_varejo && product.preco_varejo < product.preco ? product.preco_varejo : product.preco
        const temPromocao = product.preco_varejo && product.preco_varejo < product.preco

        return (
            <div>
                {temPromocao && (
                    <p className="text-xs text-gray-400 line-through font-medium">
                        R$ {product.preco.toFixed(2).replace('.', ',')}
                    </p>
                )}
                <p className="text-xl md:text-2xl font-extrabold text-primary">
                    R$ {precoFinal.toFixed(2).replace('.', ',')}
                </p>
            </div>
        )
    }

    const hasDiscount = product.preco_varejo && product.preco_varejo < product.preco

    return (
        <div
            onClick={() => navigate(`/c/${slug}/p/${product.id}`)}
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer flex flex-col"
        >
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-900 overflow-hidden">
                {/* Badge */}
                {hasDiscount && (
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
                        OFERTA
                    </div>
                )}

                {/* Favorite Button (Visual only) */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 z-10 size-8 bg-white/80 dark:bg-black/50 backdrop-blur shadow rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                >
                    <span className="material-symbols-outlined text-sm">favorite</span>
                </button>

                {/* Image */}
                {product.imagens && product.imagens.length > 0 ? (
                    <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundImage: `url('${product.imagens[0].imagem_url}')` }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-5xl">image</span>
                    </div>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                    {/* Mocked Vendor or Category Name could go here */}
                    UNIQ STORE
                </p>

                <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                    {product.nome_produto}
                </h4>

                {/* Rating (Mocked for now as per reference) */}
                <div className="flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-sm text-yellow-400 fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">4.8</span>
                    <span className="text-sm text-gray-400">({Math.floor(Math.random() * 100) + 10} avaliações)</span>
                </div>

                <div className="mt-auto flex items-end justify-between">
                    {renderPrice()}

                    <button
                        onClick={handleAddToCart}
                        className="size-10 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center transition-all shadow-lg shadow-primary/10 active:scale-95"
                    >
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
