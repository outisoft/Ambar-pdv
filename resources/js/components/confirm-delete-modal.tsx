import { Button } from '@/components/ui/button';

type ConfirmDeleteModalProps = {
    open: boolean;
    itemName?: string | null;
    title?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirming?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

function ConfirmDeleteModal({
    open,
    itemName,
    title = 'Confirmar eliminación',
    confirmLabel = 'Eliminar',
    cancelLabel = 'Cancelar',
    confirming = false,
    onCancel,
    onConfirm,
}: ConfirmDeleteModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    ¿Seguro que deseas eliminar{' '}
                    <span className="font-medium text-foreground">{itemName}</span>? Esta acción no se puede deshacer.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={onCancel} disabled={confirming}>
                        {cancelLabel}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={confirming}>
                        {confirming ? 'Eliminando...' : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;
export { ConfirmDeleteModal };
