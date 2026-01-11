import { useState } from 'react'
import MainSidebar from '../../components/Sidebar/MainSidebar'
import SubSidebar from '../../components/Sidebar/SubSidebar'
import DashboardHome from './components/DashboardHome'
import ModuleStore from './components/ModuleStore'
import ProductList from '../../components/Catalog/ProductList'
import ProductForm from '../Catalog/ProductForm'
import ClientList from '../CRM/ClientList'
import CRMSettings from '../CRM/CRMSettings'
import CRMOpportunities from '../CRM/CRMOpportunities'
import CRMActivities from '../CRM/CRMActivities'
import CRMAttendances from '../CRM/CRMAttendances'
import CRMChat from '../CRM/CRMChat'
import CRMDashboard from '../CRM/CRMDashboard'

export default function Dashboard() {
    const [activeContext, setActiveContext] = useState('dashboard')
    const [activeView, setActiveView] = useState('home')
    const [editingProductId, setEditingProductId] = useState<number | undefined>(undefined)

    console.log('Dashboard activeView:', activeView)

    const renderContent = () => {
        if (activeContext === 'store') return <ModuleStore />

        // Dashboard Context Views
        switch (activeView) {
            case 'products':
                return <ProductList onNavigate={setActiveView} onEdit={(id) => { setEditingProductId(id); setActiveView('product-form') }} />
            case 'product-form':
                return <ProductForm onNavigate={(view) => { setActiveView(view); setEditingProductId(undefined) }} productId={editingProductId} />
            case 'crm-dashboard':
                return <CRMDashboard />
            case 'crm-clients':
                return <ClientList />
            case 'crm-settings':
                return <CRMSettings />
            case 'crm-opportunities':
                return <CRMOpportunities />
            case 'crm-activities':
                return <CRMActivities />
            case 'crm-chat':
                return <CRMChat />
            case 'crm-attendances':
                return <CRMAttendances />
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
