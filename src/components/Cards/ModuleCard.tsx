

interface ModuleCardProps {
    label: string
    description?: string
    icon: string
    isActive: boolean
    onToggle: () => void
    isLoading?: boolean
}

export default function ModuleCard({ label, description, icon, isActive, onToggle, isLoading }: ModuleCardProps) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start sm:items-center justify-between gap-4 transition-all hover:bg-white/10">
            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40'
                    }`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <div>
                    <h3 className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-white/60'}`}>
                        {label}
                    </h3>
                    {description && (
                        <p className="text-sm text-white/40 max-w-xs">{description}</p>
                    )}
                </div>
            </div>

            <button
                onClick={onToggle}
                disabled={isLoading}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900 ${isActive ? 'bg-primary' : 'bg-white/20'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    )
}
