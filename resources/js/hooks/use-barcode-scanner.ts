import { useEffect, useState } from 'react';

export default function useBarcodeScanner({ onScan }: { onScan: (code: string) => void }) {
    
    useEffect(() => {
        let buffer = '';
        let lastKeyTime = Date.now();

        const handleKeyDown = (e: KeyboardEvent) => {
            const currentTime = Date.now();
            
            // 1. Detectar si el usuario está escribiendo normal en un input
            // Si el foco está en un input de texto, NO queremos interceptar (para dejar que busque por nombre)
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return; 
            }

            // 2. Lógica de "Velocidad" (El escáner es sobrehumano)
            // Si pasa mucho tiempo entre teclas, reseteamos el buffer (es un humano tecleando lento)
            if (currentTime - lastKeyTime > 100) { 
                buffer = ''; 
            }
            lastKeyTime = currentTime;

            // 3. Detectar ENTER (Fin del código)
            if (e.key === 'Enter') {
                if (buffer.length > 2) { // Mínimo 3 caracteres para considerar código válido
                    e.preventDefault();
                    onScan(buffer); // ¡Disparamos el evento!
                    buffer = '';
                }
            } else if (e.key.length === 1) { 
                // Acumular caracteres imprimibles
                buffer += e.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onScan]);
}