import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { modulesService } from '../services/modulesService';
import { moduleService, type ModuleCode } from '../services/moduleService';

interface ModuleContextType {
    activeModules: ModuleCode[];
    isLoading: boolean;
    isModuleActive: (code: ModuleCode) => boolean;
    toggleModule: (code: ModuleCode, active: boolean) => Promise<void>;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeModules, setActiveModules] = useState<ModuleCode[]>([]);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Módulos que são sempre ativos por padrão ou core do sistema
    const CORE_MODULES: ModuleCode[] = ['settings', 'finance'];

    useEffect(() => {
        const init = async () => {
            try {
                // Check auth first
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    setIsLoading(false);
                    return;
                }

                const id = await modulesService.getCurrentCompanyId();
                setCompanyId(id);

                if (id) {
                    await loadModules(id);
                } else {
                    // Se não tiver empresa, para o loading
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error getting company ID:', error);
                setIsLoading(false);
            }
        };

        init();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                try {
                    const id = await modulesService.getCurrentCompanyId();
                    setCompanyId(id);
                    if (id) {
                        await loadModules(id);
                    } else {
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error('Error on auth change:', error);
                    setIsLoading(false);
                }
            } else if (event === 'SIGNED_OUT') {
                setCompanyId(null);
                setActiveModules([]);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadModules = async (empresaId: string) => {
        try {
            // Não setar true aqui se já estiver true, mas ok manter
            // setIsLoading(true); // O init já seta como true inicial

            const modules = await moduleService.getActiveModules(empresaId);
            const activeCodes = modules
                .filter(m => m.ativo)
                .map(m => m.modulo_codigo as ModuleCode);

            setActiveModules(activeCodes);
        } catch (error) {
            console.error('Failed to load modules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isModuleActive = (code: ModuleCode) => {
        if (CORE_MODULES.includes(code)) return true;
        return activeModules.includes(code);
    };

    const toggleModule = async (code: ModuleCode, active: boolean) => {
        if (!companyId) return;

        // Optimistic update
        setActiveModules(prev =>
            active ? [...prev, code] : prev.filter(c => c !== code)
        );

        try {
            await moduleService.toggleModule(companyId, code, active);
        } catch (error) {
            console.error('Failed to toggle module, reverting...', error);
            loadModules(companyId);
        }
    };

    return (
        <ModuleContext.Provider value={{
            activeModules,
            isLoading,
            isModuleActive,
            toggleModule
        }}>
            {children}
        </ModuleContext.Provider>
    );
};

export const useModules = () => {
    const context = useContext(ModuleContext);
    if (!context) {
        throw new Error('useModules must be used within a ModuleProvider');
    }
    return context;
};
