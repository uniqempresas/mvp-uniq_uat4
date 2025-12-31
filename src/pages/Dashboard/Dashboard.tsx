import { useState } from 'react'
import MainSidebar from '../../components/Sidebar/MainSidebar'
import SubSidebar from '../../components/Sidebar/SubSidebar'
import DashboardHome from './components/DashboardHome'
import ModuleStore from './components/ModuleStore'
import ProductForm from '../Catalog/ProductForm'
import ClientList from '../CRM/ClientList'
import CRMSettings from '../CRM/CRMSettings'
import CRMOpportunities from '../CRM/CRMOpportunities'

export default function Dashboard() {
    const [activeContext, setActiveContext] = useState('dashboard')
    const [activeView, setActiveView] = useState('home')

    console.log('Dashboard activeView:', activeView)

    const renderContent = () => {
        if (activeContext === 'store') return <ModuleStore />

        // Dashboard Context Views
        switch (activeView) {
            case 'products':
                return <ProductForm />
            case 'crm-clients':
                return <ClientList />
            case 'crm-settings':
                return <CRMSettings />
            case 'crm-opportunities':
                return <CRMOpportunities />
            case 'home':
            default:
                return <DashboardHome />
        }
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light text-slate-800 antialiased selection:bg-primary/20 selection:text-primary">

            <MainSidebar
                activeContext={activeContext}
                onContextChange={(ctx) => {
                    setActiveContext(ctx)
                    setActiveView('home') // Reset view on context switch
                }}
            />

            <SubSidebar
                activeContext={activeContext}
                onNavigate={(view) => setActiveView(view)}
            />

            {/* Main Content Area */}
            {renderContent()}
        </div>
    )
}
