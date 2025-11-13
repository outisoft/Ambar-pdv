import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitch() {
    const { appearance, updateAppearance } = useAppearance();
    const isDark = appearance === 'dark';

    const toggle = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggle}
            type="button"
            aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
            className="flex w-full items-center justify-between gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700"
        >
            <span className="flex items-center gap-2">
                {isDark ? (
                    <Moon className="h-4 w-4 text-neutral-200" />
                ) : (
                    <Sun className="h-4 w-4 text-amber-500" />
                )}
                Tema
            </span>
            <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${isDark ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-200 text-neutral-700'}`}
            >
                {isDark ? 'Oscuro' : 'Claro'}
            </span>
        </button>
    );
}
