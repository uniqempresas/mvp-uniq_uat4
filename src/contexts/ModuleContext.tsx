import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { moduleService } from '../services/moduleService';

// Define quais módulos sempre devem estar ativos (se houver)
const CORE_MODULES: string[] = ['dashboard'];

interface ModuleContextType {
    activeModules: string[];
    isLoading: boolean;
    isModuleActive: (code: string) => boolean;
    toggleModule: (code: string, active: boolean) => Promise<void>;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeModules, setActiveModules] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadModules = async () => {
        try {
            const modules = await moduleService.getActiveModules();
            setActiveModules(modules);
        } catch (error) {
            console.error('Failed to load modules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Inicialização
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await loadModules();
            } else {
                setIsLoading(false);
            }
        };

        init();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setIsLoading(true);
                // Don't await this, let it run in background so it doesn't block login
                loadModules().catch(err => console.error("Error loading modules in background", err));
            } else if (event === 'SIGNED_OUT') {
                setActiveModules([]);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const isModuleActive = (code: string) => {
        if (CORE_MODULES.includes(code)) return true;
        return activeModules.includes(code);
    };

    const toggleModule = async (code: string, active: boolean) => {
        // Optimistic update
        setActiveModules(prev =>
            active ? [...prev, code] : prev.filter(c => c !== code)
        );

        try {
            await moduleService.toggleModule(code, active);
        } catch (error) {
            console.error('Failed to toggle module, reverting...', error);
            // Revert on error
            setActiveModules(prev =>
                !active ? [...prev, code] : prev.filter(c => c !== code)
            );
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
