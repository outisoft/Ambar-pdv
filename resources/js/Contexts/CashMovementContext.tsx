import { createContext, useContext, useState, ReactNode } from 'react';
import CashMovementModal from '@/components/CashMovementModal';

// Definimos qué funciones estarán disponibles para toda la app
interface CashMovementContextType {
    openEntry: () => void;
    openExpense: () => void;
}

const CashMovementContext = createContext<CashMovementContextType | undefined>(undefined);

export function CashMovementProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<'in' | 'out'>('out');

    // Funciones para abrir el modal
    const openEntry = () => {
        setType('in');
        setIsOpen(true);
    };

    const openExpense = () => {
        setType('out');
        setIsOpen(true);
    };

    return (
        <CashMovementContext.Provider value={{ openEntry, openExpense }}>
            {children}
            
            {/* El modal vive aquí, siempre listo, pero oculto */}
            <CashMovementModal 
                show={isOpen} 
                onClose={() => setIsOpen(false)} 
                type={type} 
            />
        </CashMovementContext.Provider>
    );
}

// Hook personalizado para usarlo fácilmente
export function useCashMovement() {
    const context = useContext(CashMovementContext);
    if (!context) {
        throw new Error('useCashMovement debe usarse dentro de un CashMovementProvider');
    }
    return context;
}