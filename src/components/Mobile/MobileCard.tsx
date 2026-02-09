interface MobileCardField {
    label: string
    value: string | React.ReactNode
    icon?: string
}

interface MobileCardAction {
    icon: string
    onClick: (e: React.MouseEvent) => void
    color?: 'primary' | 'red' | 'blue' | 'gray'
    title?: string
}

interface MobileCardBadge {
    label: string
    color: 'green' | 'red' | 'blue' | 'gray' | 'yellow'
}

interface MobileCardProps {
    avatar?: string | React.ReactNode
    title: string
    subtitle?: string
    fields?: MobileCardField[]
    actions: MobileCardAction[]
    badge?: MobileCardBadge
    onClick?: () => void
}

export default function MobileCard({
    avatar,
    title,
    subtitle,
    fields = [],
    actions,
    badge,
    onClick
}: MobileCardProps) {
    const getBadgeClasses = (color: string) => {
        const classes = {
            green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            red: 'bg-red-50 text-red-700 border-red-200',
            blue: 'bg-blue-50 text-blue-700 border-blue-200',
            gray: 'bg-gray-50 text-gray-600 border-gray-200',
            yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200'
        }
        return classes[color as keyof typeof classes] || classes.gray
    }

    const getActionColorClasses = (color?: string) => {
        const classes = {
            primary: 'text-primary hover:bg-primary/10',
            red: 'text-red-500 hover:bg-red-50',
            blue: 'text-blue-500 hover:bg-blue-50',
            gray: 'text-gray-500 hover:bg-gray-100'
        }
        return classes[(color as keyof typeof classes) || 'gray']
    }

    return (
        <div
            className={`bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-shadow ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''
                }`}
            onClick={onClick}
        >
            {/* Header: Avatar + Title + Badge */}
            <div className="flex items-start gap-3 mb-3">
                {/* Avatar/Photo */}
                {avatar && (
                    <div className="shrink-0">
                        {typeof avatar === 'string' ? (
                            <div
                                className="size-12 rounded-lg bg-gray-100 bg-cover bg-center border border-gray-200"
                                style={{ backgroundImage: `url('${avatar}')` }}
                            />
                        ) : (
                            <div className="size-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                {avatar}
                            </div>
                        )}
                    </div>
                )}

                {/* Title + Subtitle */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{title}</h3>
                    {subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>}
                </div>

                {/* Badge (Status) */}
                {badge && (
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${getBadgeClasses(
                            badge.color
                        )}`}
                    >
                        <span
                            className={`size-1.5 rounded-full ${badge.color === 'green'
                                    ? 'bg-emerald-500'
                                    : badge.color === 'red'
                                        ? 'bg-red-500'
                                        : badge.color === 'blue'
                                            ? 'bg-blue-500'
                                            : badge.color === 'yellow'
                                                ? 'bg-yellow-500'
                                                : 'bg-gray-400'
                                }`}
                        />
                        {badge.label}
                    </span>
                )}
            </div>

            {/* Fields (Key-Value Pairs) */}
            {fields.length > 0 && (
                <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
                    {fields.map((field, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            {field.icon && (
                                <span className="material-symbols-outlined text-[16px] text-gray-400">{field.icon}</span>
                            )}
                            <span className="text-gray-500 text-xs">{field.label}:</span>
                            <span className="text-gray-900 font-medium flex-1">{field.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions Row */}
            <div className="flex items-center justify-end gap-2">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation()
                            action.onClick(e)
                        }}
                        className={`p-3 rounded-lg transition-all ${getActionColorClasses(action.color)}`}
                        title={action.title}
                        style={{ minWidth: '44px', minHeight: '44px' }} // iOS HIG touch target
                    >
                        <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
