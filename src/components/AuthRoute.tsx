import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface AuthRouteProps {
    children: React.ReactNode
    type: 'private' | 'public'
}

export default function AuthRoute({ children, type }: AuthRouteProps) {
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        // You might want a loading spinner here
        return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
    }

    if (type === 'private' && !session) {
        return <Navigate to="/" replace />
    }

    if (type === 'public' && session) {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}
