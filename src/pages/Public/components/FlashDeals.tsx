import React from 'react'
import { motion } from 'framer-motion'
import type { PublicProduct } from '../../../services/publicService'

interface FlashDealsProps {
    products: PublicProduct[]
    companyPhone: string
}

export default function FlashDeals({ products, companyPhone }: FlashDealsProps) {
    // Pegar apenas os primeiros 4 produtos para flash deals
    const flashProducts = products.slice(0, 4)

    if (flashProducts.length === 0) return null

    // Calcular tempo restante (exemplo: 6 horas)
    const endTime = new Date()
    endTime.setHours(endTime.getHours() + 6)

    return (
        <section className="px-4 md:px-0 my-16">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-2xl relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{
                                x: ['-100%', '100%'],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                        <div className="relative flex items-center gap-2">
                            <span className="material-symbols-outlined">bolt</span>
                            <span className="font-extrabold text-sm">FLASH SALE</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            Ofertas Relâmpago
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Termina em breve!
                        </p>
                    </div>
                </div>
                <Timer endTime={endTime} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {flashProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-300"
                    >
                        {/* Badge de desconto */}
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                            -30%
                        </div>

                        {/* Imagem do produto */}
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            {product.imagens?.[0]?.imagem_url ? (
                                <img
                                    src={product.imagens[0].imagem_url}
                                    alt={product.nome_produto}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-300 text-6xl">
                                        image
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {product.nome_produto}
                            </h4>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs text-gray-400 line-through">
                                    R$ {(product.preco * 1.3).toFixed(2)}
                                </span>
                                <span className="text-2xl font-extrabold text-primary">
                                    R$ {product.preco.toFixed(2)}
                                </span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    const text = `Olá! Tenho interesse no produto *${product.nome_produto}* da Flash Sale!`
                                    const link = `https://wa.me/55${companyPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
                                    window.open(link, '_blank')
                                }}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">shopping_cart</span>
                                <span>Comprar Agora</span>
                            </motion.button>
                        </div>

                        {/* Progress bar (estoque simulado) */}
                        <div className="px-4 pb-4">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-yellow-400 to-red-500 h-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                                65% vendido • Estoque limitado!
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

// Componente de Timer
function Timer({ endTime }: { endTime: Date }) {
    const [timeLeft, setTimeLeft] = React.useState(getTimeLeft(endTime))

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(endTime))
        }, 1000)

        return () => clearInterval(timer)
    }, [endTime])

    return (
        <div className="flex items-center gap-2">
            <TimeBox value={timeLeft.hours} label="Horas" />
            <span className="text-2xl font-bold text-gray-400">:</span>
            <TimeBox value={timeLeft.minutes} label="Min" />
            <span className="text-2xl font-bold text-gray-400">:</span>
            <TimeBox value={timeLeft.seconds} label="Seg" />
        </div>
    )
}

function TimeBox({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="bg-gray-900 dark:bg-gray-700 text-white font-mono text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-lg">
                {String(value).padStart(2, '0')}
            </div>
            <span className="text-xs text-gray-500 mt-1">{label}</span>
        </div>
    )
}

function getTimeLeft(endTime: Date) {
    const total = endTime.getTime() - new Date().getTime()
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)

    return { hours, minutes, seconds }
}


