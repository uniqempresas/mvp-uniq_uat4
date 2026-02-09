import { useEffect } from 'react'

interface ToastProps {
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    visible: boolean
    onClose: () => void
    duration?: number
}

export default function Toast({
    message,
    type,
    visible,
    onClose,
    duration = 3000
}: ToastProps) {
    useEffect(() => {
        if (visible && duration > 0) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [visible, duration, onClose])

    if (!visible) return null

    const config = {
        success: {
            bg: 'bg-green-500',
            icon: 'check_circle'
        },
        error: {
            bg: 'bg-red-500',
            icon: 'error'
        },
        warning: {
            bg: 'bg-amber-500',
            icon: 'warning'
        },
        info: {
            bg: 'bg-blue-500',
            icon: 'info'
        }
    }

    const { bg, icon } = config[type]

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up md:left-auto md:right-4 md:w-96">
            <div className={`${bg} text-white rounded-lg p-4 shadow-xl flex items-center gap-3 backdrop-blur-sm`}>
                <span className="material-symbols-outlined shrink-0">
                    {icon}
                </span>
                <p className="flex-1 font-medium text-sm">{message}</p>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/20 rounded transition-colors shrink-0"
                    aria-label="Fechar"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
        </div>
    )
}
