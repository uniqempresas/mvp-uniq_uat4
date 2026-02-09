import { supabase } from '../../lib/supabase'

interface MobileHeaderProps {
    onMenuClick: () => void
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
    const handleLogout = async () => {
        if (confirm('Deseja realmente sair?')) {
            await supabase.auth.signOut()
            window.location.reload()
        }
    }

    return (
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 px-4">
            <div className="flex items-center justify-between h-full">
                {/* Hamburger Button */}
                <button
                    onClick={onMenuClick}
                    className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Abrir menu"
                >
                    <span className="material-symbols-outlined text-slate-700">menu</span>
                </button>

                {/* Logo */}
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-2xl">spa</span>
                </div>

                {/* User Avatar */}
                <div
                    onClick={handleLogout}
                    className="h-10 w-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer hover:border-primary transition-colors"
                >
                    <img alt="User profile" className="h-full w-full object-cover" src="/avatar.png" />
                </div>
            </div>
        </header>
    )
}
