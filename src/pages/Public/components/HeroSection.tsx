import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useNavigate } from 'react-router-dom'
import type { Banner } from '../../../services/publicService'

interface HeroSectionProps {
    banners?: Banner[]
    heroType?: 'carousel' | 'static'
    autoplay?: boolean
    interval?: number
    slug?: string
    companyName?: string
    onSelectCategory?: (id: string) => void
}

export default function HeroSection({
    banners = [],
    heroType = 'static',
    autoplay = true,
    interval = 5000,
    slug,
    companyName = 'Nossa Loja',
    onSelectCategory
}: HeroSectionProps) {
    if (!banners || banners.length === 0) {
        return <DefaultHero companyName={companyName} />
    }

    if (heroType === 'static') {
        return <BannerSlide banner={banners[0]} slug={slug} onSelectCategory={onSelectCategory} />
    }

    return (
        <section className="relative rounded-xl overflow-hidden mb-12 h-[420px] mx-4 md:mx-0">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation
                autoplay={autoplay ? { delay: interval } : false}
                loop={banners.length > 1}
                className="h-full"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <BannerSlide banner={banner} slug={slug} onSelectCategory={onSelectCategory} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}

function BannerSlide({ banner, slug, onSelectCategory }: { banner: Banner; slug?: string; onSelectCategory?: (id: string) => void }) {
    const navigate = useNavigate()

    const handleClick = () => {
        if (!banner.link_value) return

        if (banner.link_type === 'external') {
            window.open(banner.link_value, '_blank')
        } else if (banner.link_type === 'product') {
            navigate(`/c/${slug}/p/${banner.link_value}`)
        } else if (banner.link_type === 'category') {
            navigate(`/c/${slug}/category/${banner.link_value}`)
            onSelectCategory?.(banner.link_value)
        }
    }

    // Map button_position to CSS alignment
    const positionStyles = getPositionStyles(banner.button_position || 'bottom-left')
    const buttonColor = banner.button_color || '#10b77f'
    const textColor = banner.text_color || '#ffffff'

    return (
        <div className="relative h-full w-full bg-gradient-to-br from-gray-900 to-gray-800 group">
            <picture className="absolute inset-0">
                {banner.mobile_url && (
                    <source media="(max-width: 768px)" srcSet={banner.mobile_url} />
                )}
                <img
                    src={banner.desktop_url}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover"
                />
            </picture>

            {/* Content overlay — positioned dynamically */}
            <div
                className="absolute inset-0 flex p-6 md:p-8"
                style={positionStyles}
            >
                <div className="flex flex-col gap-2 max-w-md">
                    {banner.title && (
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight drop-shadow-lg" style={{ color: textColor }}>
                            {banner.title}
                        </h2>
                    )}
                    {banner.subtitle && (
                        <p className="text-sm md:text-base font-medium drop-shadow-md" style={{ color: textColor, opacity: 0.85 }}>
                            {banner.subtitle}
                        </p>
                    )}
                    {banner.button_text && banner.link_value && (
                        <button
                            onClick={handleClick}
                            className="mt-1 px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 hover:brightness-110 w-fit"
                            style={{ backgroundColor: buttonColor, color: textColor }}
                        >
                            {banner.button_text}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function getPositionStyles(position: string): React.CSSProperties {
    const map: Record<string, React.CSSProperties> = {
        'top-left': { alignItems: 'flex-start', justifyContent: 'flex-start' },
        'top-center': { alignItems: 'flex-start', justifyContent: 'center', textAlign: 'center' },
        'top-right': { alignItems: 'flex-start', justifyContent: 'flex-end', textAlign: 'right' },
        'center-left': { alignItems: 'center', justifyContent: 'flex-start' },
        'center-center': { alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
        'center-right': { alignItems: 'center', justifyContent: 'flex-end', textAlign: 'right' },
        'bottom-left': { alignItems: 'flex-end', justifyContent: 'flex-start' },
        'bottom-center': { alignItems: 'flex-end', justifyContent: 'center', textAlign: 'center' },
        'bottom-right': { alignItems: 'flex-end', justifyContent: 'flex-end', textAlign: 'right' },
    }
    return map[position] || map['bottom-left']
}

function DefaultHero({ companyName }: { companyName: string }) {
    return (
        <section className="relative rounded-xl overflow-hidden mb-12 h-[360px] mx-4 md:mx-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-slate-900"></div>

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full"></div>
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/3 rounded-full"></div>
            </div>

            <div className="relative h-full flex flex-col justify-center px-6 md:px-12 text-white max-w-2xl">
                <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-widest mb-5 w-fit">
                    Loja Online Oficial
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.15] mb-4">
                    Bem-vindo à <br className="hidden md:inline" />{companyName}
                </h2>
                <p className="text-base md:text-lg text-white/80 mb-8 font-medium max-w-md">
                    Explore nossos produtos com os melhores preços e atendimento personalizado.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="bg-white text-primary px-7 py-3.5 rounded-xl font-extrabold text-base hover:bg-gray-100 transition-all active:scale-95 shadow-lg">
                        Ver Produtos
                    </button>
                </div>
            </div>
        </section>
    )
}
