import { useState } from 'react'
import MainSidebar from '../../components/Sidebar/MainSidebar'
import SubSidebar from '../../components/Sidebar/SubSidebar'
import DashboardHome from './components/DashboardHome'
import FinanceLayout from '../Finance/FinanceLayout'
import ModuleStore from './components/ModuleStore'
import ProductList from '../../components/Catalog/ProductList'
import ProductForm from '../Catalog/ProductForm'
import ServiceList from '../Services/ServiceList'
import CollaboratorList from '../../components/Registers/CollaboratorList'
import ClientList from '../../components/Registers/ClientList'
import SupplierList from '../../components/Registers/SupplierList'

export default function Dashboard() {
    const [activeContext, setActiveContext] = useState('dashboard')
    const [activeView, setActiveView] = useState('home')
    const [editingProductId, setEditingProductId] = useState<number | undefined>(undefined)

    console.log('Dashboard activeView:', activeView)

    const renderContent = () => {
        if (activeContext === 'store') return <ModuleStore />
        if (activeContext === 'finance') return <FinanceLayout />

        // Dashboard Context Views
        switch (activeView) {
            case 'products':
                return <ProductList onNavigate={setActiveView} onEdit={(id) => { setEditingProductId(id); setActiveView('product-form') }} />
            case 'product-form':
                return <ProductForm onNavigate={(view) => { setActiveView(view); setEditingProductId(undefined) }} productId={editingProductId} />
            case 'services':
                return <ServiceList onNavigate={setActiveView} />
            case 'clients':
                // @ts-ignore
                return <ClientList onNavigate={setActiveView} />
            case 'suppliers':
                return <SupplierList />
            case 'collaborators':
                return <CollaboratorList />
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
