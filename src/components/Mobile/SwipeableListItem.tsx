import { useState, TouchEvent as ReactTouchEvent } from 'react'

interface SwipeableListItemProps {
    children: React.ReactNode
    onDelete: () => void
    deleteLabel?: string
    threshold?: number
}

export default function SwipeableListItem({
    children,
    onDelete,
    deleteLabel = 'Excluir',
    threshold = 80
}: SwipeableListItemProps) {
    const [translateX, setTranslateX] = useState(0)
    const [startX, setStartX] = useState(0)
    const [isDragging, setIsDragging] = useState(false)

    const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
        setStartX(e.touches[0].clientX)
        setIsDragging(true)
    }

    const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
        if (!isDragging) return

        const currentX = e.touches[0].clientX
        const deltaX = currentX - startX

        // Permite apenas swipe para esquerda (valores negativos)
        // Limita o movimento máximo em -120px
        if (deltaX < 0) {
            setTranslateX(Math.max(deltaX, -120))
        } else {
            setTranslateX(0)
        }
    }

    const handleTouchEnd = () => {
        setIsDragging(false)

        // Se passou do threshold, confirma delete
        if (Math.abs(translateX) >= threshold) {
            onDelete()
        } else {
            // Volta à posição original
            setTranslateX(0)
        }
    }

    return (
        <div className="relative overflow-hidden rounded-lg">
            {/* Delete background (revealed on swipe left) */}
            <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-6 rounded-lg">
                <div className="flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined">delete</span>
                    <span className="font-bold text-sm">{deleteLabel}</span>
                </div>
            </div>

            {/* Swipeable content */}
            <div
                style={{
                    transform: `translateX(${translateX}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
                className="bg-white dark:bg-slate-800 touch-pan-y relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {children}
            </div>
        </div>
    )
}
