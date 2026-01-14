import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, Client, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, CreditCard, DollarSign, History, Printer } from 'lucide-react';

interface ClientTransaction {
    id: number;
    type: 'charge' | 'payment';
    amount: number;
    previous_balance: number;
    new_balance: number;
    description?: string | null;
    created_at: string;
    user?: User;
}

interface ShowProps extends PageProps {
    client: Client & { transactions: ClientTransaction[] };
}

export default function Show({ client }: ShowProps) {
    const totalDeuda = Number(client.current_balance || 0);
    const limite = Number(client.credit_limit || 0);
    const disponible = Math.max(limite - totalDeuda, 0);

    return (
        <AuthenticatedLayout>
            <Head title={`Cuenta por cobrar - ${client.name}`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <History className="w-7 h-7 text-primary" />
                            Historial de crédito
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Detalle de movimientos de la cuenta de{' '}
                            <span className="font-medium text-foreground">{client.name}</span>.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Link href={route('accounts_receivable.index')}>
                            <Button variant="outline" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Volver al listado
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-4 flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <div className="text-lg font-semibold">{client.name}</div>
                        {client.tax_id && (
                            <p className="text-xs text-muted-foreground">RUT/DNI: {client.tax_id}</p>
                        )}
                        {(client.email || client.phone) && (
                            <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                                {client.email && <div>📧 {client.email}</div>}
                                {client.phone && <div>📞 {client.phone}</div>}
                            </div>
                        )}
                    </div>

                    <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Límite de crédito</p>
                            <p className="mt-1 text-2xl font-bold flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                ${limite.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Deuda actual</p>
                                <p className="mt-1 text-2xl font-bold text-destructive flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    ${totalDeuda.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Crédito disponible</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                ${disponible.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabla de movimientos */}
                <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <History className="w-4 h-4 text-primary" />
                            Movimientos de la cuenta
                        </h2>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead>Fecha</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                                <TableHead className="text-right">Saldo anterior</TableHead>
                                <TableHead className="text-right">Saldo nuevo</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {client.transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        Aún no hay movimientos registrados para este cliente.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                client.transactions.map((tx) => {
                                    const isPayment = tx.type === 'payment';
                                    return (
                                        <TableRow key={tx.id}>
                                            <TableCell>
                                                <div className="text-sm font-medium text-foreground">
                                                    {new Date(tx.created_at).toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={isPayment ? 'outline' : 'destructive'}
                                                    className={
                                                        isPayment
                                                            ? 'border-emerald-500 text-emerald-600 dark:text-emerald-300'
                                                            : ''
                                                    }
                                                >
                                                    {isPayment ? 'Abono' : 'Cargo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">
                                                    {tx.user?.name ?? 'Sistema'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span
                                                    className={
                                                        'text-sm font-medium ' +
                                                        (isPayment
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-destructive')
                                                    }
                                                >
                                                    ${Number(tx.amount || 0).toFixed(2)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                ${Number(tx.previous_balance || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                ${Number(tx.new_balance || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">
                                                    {tx.description || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {isPayment ? (
                                                    <a
                                                        href={route(
                                                            'receivable.print_ticket',
                                                            tx.id,
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                        </Button>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
