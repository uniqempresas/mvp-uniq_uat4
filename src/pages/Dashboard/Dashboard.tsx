import { useState } from 'react'
import MainSidebar from '../../components/Sidebar/MainSidebar'
import SubSidebar from '../../components/Sidebar/SubSidebar'
import DashboardHome from './components/DashboardHome'
import ModuleStore from './components/ModuleStore'

export default function Dashboard() {
    const [activeContext, setActiveContext] = useState('dashboard')

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light text-slate-800 antialiased selection:bg-primary/20 selection:text-primary">

            <MainSidebar
                activeContext={activeContext}
                onContextChange={setActiveContext}
            />

            <SubSidebar activeContext={activeContext} />

            {/* Main Content Area */}
            {activeContext === 'store' ? (
                <ModuleStore />
            ) : (
                <DashboardHome />
            )}
        </div>
    )
}
