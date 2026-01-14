import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PageProps, Client } from '@/types';
import { useMemo, useState, FormEvent, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Search, CreditCard, Users, ArrowDownRight } from 'lucide-react';

interface Debtor extends Client {
    credit_limit: number;
    current_balance: number;
}

type AccountsReceivableIndexProps = PageProps<{
    debtors: Debtor[];
}>;

export default function AccountsReceivableIndex({ auth, debtors }: AccountsReceivableIndexProps) {
    const { props } = usePage<PageProps>();
    const flash: any = (props as any).flash || {};

    const [search, setSearch] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Debtor | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        amount: '',
        notes: '',
    });

    const filteredDebtors = useMemo(() => {
        if (!search.trim()) return debtors;

        const term = search.toLowerCase();
        return debtors.filter((client) => {
            return (
                client.name.toLowerCase().includes(term) ||
                (client.email ?? '').toLowerCase().includes(term) ||
                (client.phone ?? '').toLowerCase().includes(term) ||
                (client.tax_id ?? '').toLowerCase().includes(term)
            );
        });
    }, [debtors, search]);

    const totalDebt = useMemo(
        () =>
            filteredDebtors.reduce(
                (acc, curr) => acc + Number(curr.current_balance ?? 0),
                0,
            ),
        [filteredDebtors],
    );

    const openPaymentModal = (client: Debtor) => {
        setSelectedClient(client);
        setData('amount', '');
        setData('notes', '');
        setShowPaymentModal(true);
    };

    const closePaymentModal = () => {
        setShowPaymentModal(false);
        setSelectedClient(null);
        reset();
    };

    const submitPayment = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedClient) return;

        post(route('accounts_receivable.store_payment', selectedClient.id), {
            onSuccess: () => {
                toast.success('Abono registrado correctamente.');
                closePaymentModal();
            },
            onError: () => {
                toast.error('No se pudo registrar el abono.');
            },
        });
    };

    // Escucha si el servidor envió una URL de ticket y la abre automáticamente
    useEffect(() => {
        if (flash?.ticket_url) {
            window.open(flash.ticket_url as string, '_blank');
        }
    }, [flash?.ticket_url]);

    return (
        <AuthenticatedLayout>
            <Head title="Cuentas por Cobrar" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Cuentas por Cobrar
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Controla los saldos pendientes de tus clientes.
                        </p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar cliente..."
                                className="pl-9 w-full md:w-[260px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Aviso de ticket de abono */}
                {flash?.ticket_url && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-md text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                            <span className="font-semibold">¡Abono registrado!</span>{' '}
                            <span>El comprobante se está abriendo en una nueva pestaña.</span>
                        </div>
                        <a
                            href={flash.ticket_url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-semibold"
                        >
                            ¿No abrió? Clic aquí para ver el ticket
                        </a>
                    </div>
                )}

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total por cobrar</p>
                            <p className="mt-1 text-2xl font-bold text-destructive">
                                ${totalDebt.toFixed(2)}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                            <CreditCard className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Clientes con deuda</p>
                            <p className="mt-1 text-2xl font-bold">{filteredDebtors.length}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Promedio por cliente</p>
                            <p className="mt-1 text-2xl font-bold">
                                ${filteredDebtors.length ? (totalDebt / filteredDebtors.length).toFixed(2) : '0.00'}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <ArrowDownRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Debtors table */}
                <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[260px]">Cliente</TableHead>
                                <TableHead>Contacto</TableHead>
                                <TableHead className="text-right">Límite de crédito</TableHead>
                                <TableHead className="text-right">Deuda actual</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDebtors.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        {search
                                            ? 'No se encontraron clientes con esa búsqueda.'
                                            : '¡Excelente! No tienes clientes con deuda pendiente.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDebtors.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                                                    {client.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">
                                                        {client.name}
                                                    </div>
                                                    {client.tax_id && (
                                                        <div className="text-xs text-muted-foreground">
                                                            RUT/DNI: {client.tax_id}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                                {client.phone && <span>📞 {client.phone}</span>}
                                                {client.email && <span>📧 {client.email}</span>}
                                                {!client.phone && !client.email && (
                                                    <span className="italic">Sin contacto</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {client.credit_limit != null ? (
                                                <Badge variant="secondary">
                                                    ${Number(client.credit_limit || 0).toFixed(2)}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground italic text-sm">
                                                    --
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge
                                                variant={
                                                    (client.current_balance || 0) > 0
                                                        ? 'destructive'
                                                        : 'default'
                                                }
                                            >
                                                ${Number(client.current_balance || 0).toFixed(2)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    onClick={() => openPaymentModal(client)}
                                                >
                                                    💵 Abonar
                                                </Button>
                                                <Link
                                                    href={route(
                                                        'accounts_receivable.show',
                                                        client.id,
                                                    )}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-primary hover:text-primary"
                                                    >
                                                        Ver historial
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {showPaymentModal && selectedClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closePaymentModal}
                    />
                    <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-foreground">
                            Registrar abono
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Cliente:{' '}
                            <span className="font-medium text-foreground">
                                {selectedClient.name}
                            </span>
                        </p>

                        <div className="mt-4 bg-muted/60 rounded-lg p-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Deuda actual
                                </span>
                                <span className="font-semibold text-destructive">
                                    ${Number(selectedClient.current_balance || 0).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={submitPayment} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Monto a pagar ($)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={selectedClient.current_balance ?? undefined}
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    autoFocus
                                    placeholder="0.00"
                                />
                                {errors.amount && (
                                    <p className="text-xs text-destructive mt-1">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Notas (opcional)
                                </label>
                                <textarea
                                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Ej. Pago parcial en efectivo"
                                />
                                {errors.notes && (
                                    <p className="text-xs text-destructive mt-1">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closePaymentModal}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Procesando...' : 'Confirmar pago'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
