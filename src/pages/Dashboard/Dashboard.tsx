import { useState } from 'react'
import DashboardHome from './components/DashboardHome'
import ModuleStore from './components/ModuleStore'
import ProductList from '../../components/Catalog/ProductList'
import ProductForm from '../Catalog/ProductForm'
import ServiceList from '../Services/ServiceList'
import CollaboratorList from '../../components/Registers/CollaboratorList'
import ClientList from '../../components/Registers/ClientList'
import SupplierList from '../../components/Registers/SupplierList'
import DashboardLayout from '../../components/Layout/DashboardLayout'

export default function Dashboard() {
    const [activeContext, setActiveContext] = useState('dashboard')
    const [activeView, setActiveView] = useState('home')
    const [editingProductId, setEditingProductId] = useState<number | undefined>(undefined)

    console.log('Dashboard activeView:', activeView)

    const renderContent = () => {
        if (activeContext === 'store') return <ModuleStore />
        if (activeContext === 'finance') {
            window.location.href = '/finance'
            return null
        }

        switch (activeView) {
            case 'products':
                return <ProductList onNavigate={setActiveView} onEdit={(id) => { setEditingProductId(id); setActiveView('product-form') }} />
            case 'product-form':
                return <ProductForm onNavigate={(view) => { setActiveView(view); setEditingProductId(undefined) }} productId={editingProductId} />
            case 'services':
                return <ServiceList onNavigate={setActiveView} />
            case 'clients':
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
        <DashboardLayout
            activeContext={activeContext}
            setActiveContext={setActiveContext}
            onNavigate={setActiveView}
        >
            {renderContent()}
        </DashboardLayout>
    )
}
