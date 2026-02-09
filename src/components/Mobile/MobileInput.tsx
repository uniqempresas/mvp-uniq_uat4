import type { FocusEvent } from 'react'

interface MobileInputProps {
    type?: 'text' | 'tel' | 'email' | 'number' | 'currency' | 'cpf' | 'cnpj'
    label: string
    name?: string
    value: string
    onChange: (value: string) => void
    error?: string
    required?: boolean
    placeholder?: string
    disabled?: boolean
    maxLength?: number
}

export default function MobileInput({
    type = 'text',
    label,
    name,
    value,
    onChange,
    error,
    required = false,
    placeholder,
    disabled = false,
    maxLength
}: MobileInputProps) {

    const getInputMode = (): 'text' | 'tel' | 'email' | 'numeric' | 'decimal' => {
        switch (type) {
            case 'tel': return 'tel'
            case 'email': return 'email'
            case 'number': case 'cpf': case 'cnpj': return 'numeric'
            case 'currency': return 'decimal'
            default: return 'text'
        }
    }

    const getInputType = (): string => {
        if (type === 'email') return 'email'
        if (type === 'tel') return 'tel'
        return 'text'
    }

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        // Scroll into view quando keyboard abre (delay para keyboard animation)
        setTimeout(() => {
            e.target.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            })
        }, 300)
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={name}
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={getInputType()}
                inputMode={getInputMode()}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={handleFocus}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                className={`
                    h-11 rounded-lg border px-4 
                    focus:outline-none focus:ring-2 
                    transition-all
                    disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
                    dark:bg-slate-800 dark:text-white dark:placeholder-slate-400
                    ${error
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary'
                    }
                `}
            />
            {error && (
                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 animate-fade-in">
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}
