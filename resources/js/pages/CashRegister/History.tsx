import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function History({ auth, registers }: any) {

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ title: 'Historial de Cortes', href: '/cash-register/history' }]}
        >
            <Head title="Historial de Cortes" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Historial de Cortes de Caja
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Revisa los arqueos realizados, diferencias y responsables.
                        </p>
                    </div>
                </div>

                <Card className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-foreground">
                            Últimos cortes registrados
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="min-w-[220px]">Sucursal / Cajero</TableHead>
                                        <TableHead className="min-w-[220px]">Fechas</TableHead>
                                        <TableHead className="text-right min-w-[140px]">Fondo inicial</TableHead>
                                        <TableHead className="text-right min-w-[160px]">Dinero entregado</TableHead>
                                        <TableHead className="text-center min-w-[160px]">Diferencia</TableHead>
                                        <TableHead className="text-center min-w-[120px]">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registers.data.length > 0 ? (
                                        registers.data.map((reg: any) => {
                                            const diff = parseFloat(reg.discrepancy);
                                            const isNegative = diff < -5;
                                            const isPositive = diff > 5;

                                            const diffLabel = isNegative
                                                ? 'Faltante'
                                                : isPositive
                                                    ? 'Sobrante'
                                                    : 'Cuadrado';

                                            const diffBadgeVariant = isNegative
                                                ? 'destructive'
                                                : isPositive
                                                    ? 'secondary'
                                                    : 'outline';

                                            return (
                                                <TableRow key={reg.id} className="hover:bg-muted/40">
                                                    <TableCell>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {reg.branch}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                Cajero: {reg.user}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                                            <span>
                                                                Apertura{' '}
                                                                {format(new Date(reg.opened_at), 'd MMM yyyy HH:mm', {
                                                                    locale: es,
                                                                })}
                                                            </span>
                                                            <span className="font-medium text-foreground">
                                                                Cierre{' '}
                                                                {format(new Date(reg.closed_at), 'd MMM yyyy HH:mm', {
                                                                    locale: es,
                                                                })}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-sm text-muted-foreground">
                                                        {formatMoney(reg.initial_amount)}
                                                    </TableCell>
                                                    <TableCell className="text-right text-sm font-semibold text-foreground">
                                                        {formatMoney(reg.final_amount)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span
                                                                className={`text-sm font-bold tabular-nums ${
                                                                    isNegative
                                                                        ? 'text-red-600 dark:text-red-400'
                                                                        : isPositive
                                                                            ? 'text-amber-600 dark:text-amber-400'
                                                                            : 'text-emerald-600 dark:text-emerald-400'
                                                                }`}
                                                            >
                                                                {diff > 0 ? '+' : ''}
                                                                {formatMoney(diff)}
                                                            </span>
                                                            <Badge variant={diffBadgeVariant} className="text-[10px] px-2 py-0.5 uppercase tracking-wide">
                                                                {diffLabel}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <a
                                                            href={route('reports.z_cut_pdf', { register_id: reg.id })}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center rounded-md bg-neutral-900 text-white px-2 py-1 text-[11px] font-medium hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                                        >
                                                            📄 Corte Z
                                                        </a>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                No hay registros de cortes cerrados aún.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Paginación */}
                        <div className="p-4 border-t border-border flex justify-center">
                            <div className="flex flex-wrap gap-1">
                                {registers.links?.map((link: any, k: number) => (
                                    <Link
                                        key={k}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-8 px-3 py-1 ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                : 'bg-background hover:bg-accent hover:text-accent-foreground border border-input'
                                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}