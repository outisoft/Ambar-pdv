import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';

interface Props {
    show: boolean;
    onClose: () => void;
    type: 'in' | 'out';
}

export default function CashMovementModal({ show, onClose, type }: Props) {
    
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        type: type,
        amount: '',
        description: ''
    });

    // Actualizar el tipo cuando cambia la prop (entrada/salida)
    useEffect(() => {
        setData('type', type);
        clearErrors();
    }, [type, show]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cash_movements.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
            preserveScroll: true
        });
    };

    return (
        <Dialog
            open={show}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="sm:max-w-md">
                <div className="space-y-4">
                    <h2
                        className={`text-lg font-bold ${
                            type === 'in'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                        }`}
                    >
                        {type === 'in'
                            ? '💰 Registrar Entrada de Caja'
                            : '💸 Registrar Gasto / Retiro'}
                    </h2>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-foreground">
                                Monto ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                autoFocus
                                placeholder="0.00"
                            />
                            {errors.amount && (
                                <p className="text-xs mt-1 text-red-500 dark:text-red-400">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-foreground">
                                Descripción / Motivo
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder={
                                    type === 'in'
                                        ? 'Ej: Cambio inicial extra'
                                        : 'Ej: Pago a proveedor'
                                }
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && (
                                <p className="text-xs mt-1 text-red-500 dark:text-red-400">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-md border border-input text-sm font-medium text-foreground hover:bg-muted"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm ${
                                    type === 'in'
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                } ${processing ? 'opacity-80 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'Guardando...' : 'Confirmar'}
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}