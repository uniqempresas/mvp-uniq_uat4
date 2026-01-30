import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainSidebar from '../../components/Sidebar/MainSidebar'
import CRMSubSidebar from '../../components/Sidebar/CRMSubSidebar'
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
            <MainSidebar activeContext="crm" onContextChange={handleContextChange} />
            <CRMSubSidebar activeView={activeView} onNavigate={setActiveView} />

            <main className="flex-1 overflow-auto">
                {renderContent()}
            </main>
        </div>
    )
}
