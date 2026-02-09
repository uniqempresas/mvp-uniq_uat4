import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainSidebar from '../../components/Sidebar/MainSidebar'
import CRMSubSidebar from '../../components/Sidebar/CRMSubSidebar'
import MobileHeader from '../../components/Mobile/MobileHeader'
import MobileDrawer from '../../components/Mobile/MobileDrawer'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import CRMDashboard from './CRMDashboard'
import ClientList from './ClientList'
import CRMOpportunities from './CRMOpportunities'
import CRMActivities from './CRMActivities'
import CRMAttendances from './CRMAttendances'
import CRMChat from './CRMChat'
import CRMSettings from './CRMSettings'

export default function CRMLayout() {
    const [activeView, setActiveView] = useState('dashboard')
    const [viewParams, setViewParams] = useState<any>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const { isMobile } = useBreakpoint()
    const navigate = useNavigate()

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <CRMDashboard />
            case 'clients':
                return <ClientList />
            case 'opportunities':
                return <CRMOpportunities />
            case 'activities':
                return <CRMActivities highlightId={viewParams?.activityId} />
            case 'attendances':
                return <CRMAttendances />
            case 'chat':
                return <CRMChat onNavigate={(view, params) => { setActiveView(view); setViewParams(params) }} />
            case 'settings':
                return <CRMSettings />
            default:
                return <CRMDashboard />
        }
    }

    const handleContextChange = (context: string) => {
        if (context === 'dashboard') {
            navigate('/dashboard')
        } else if (context === 'finance') {
            navigate('/finance')
        }
        // CRM já está ativo, não precisa navegar
    }

    return (
        <div className="flex w-full h-screen overflow-hidden bg-background-light">
            {/* Mobile Header (apenas mobile) */}
            {isMobile && <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />}

            {/* Mobile Drawer (apenas mobile) */}
            {isMobile && (
                <MobileDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    activeContext="crm"
                    onContextChange={handleContextChange}
                    onNavigate={undefined}
                />
            )}

            {/* Desktop Sidebars (apenas desktop) */}
            <MainSidebar activeContext="crm" onContextChange={handleContextChange} />
            <CRMSubSidebar activeView={activeView} onNavigate={setActiveView} />

            <main className="flex-1 overflow-auto pt-16 md:pt-0">
                {renderContent()}
            </main>
        </div>
    )
}
