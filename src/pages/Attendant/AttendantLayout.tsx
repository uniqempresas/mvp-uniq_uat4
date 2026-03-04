import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainSidebar from '../../components/Sidebar/MainSidebar';
import SubSidebar from '../../components/Sidebar/SubSidebar';
import MobileHeader from '../../components/Mobile/MobileHeader';
import MobileDrawer from '../../components/Mobile/MobileDrawer';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import AttendantModule from './index';
import AttendantConfig from './AttendantConfig';

export default function AttendantLayout() {
    const [activeView, setActiveView] = useState('conversations');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { isMobile } = useBreakpoint();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Detectar a rota atual e definir a view correspondente
        if (location.pathname === '/attendant/config') {
            setActiveView('config');
        } else {
            setActiveView('conversations');
        }
    }, [location.pathname]);

    const renderContent = () => {
        switch (activeView) {
            case 'conversations':
                return <AttendantModule />;
            case 'config':
                return <AttendantConfig />;
            default:
                return <AttendantModule />;
        }
    };

    const handleContextChange = (context: string) => {
        if (context === 'dashboard') {
            navigate('/dashboard');
        } else if (context === 'crm') {
            navigate('/crm');
        } else if (context === 'finance') {
            navigate('/finance');
        } else if (context === 'sales') {
            navigate('/sales');
        } else if (context === 'modules') {
            navigate('/modules');
        }
        // Se for 'attendant', já está aqui
    };

    return (
        <div className="flex w-full h-screen overflow-hidden bg-background-light">
            {/* Mobile Header */}
            {isMobile && <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />}

            {/* Mobile Drawer */}
            {isMobile && (
                <MobileDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    activeContext="attendant"
                    onContextChange={handleContextChange}
                    onNavigate={undefined}
                />
            )}

            {/* Desktop Sidebars */}
            <MainSidebar activeContext="attendant" onContextChange={handleContextChange} />
            <SubSidebar activeContext="attendant" onNavigate={setActiveView} />

            <main className="flex-1 overflow-auto pt-16 md:pt-0">
                {renderContent()}
            </main>
        </div>
    );
}
