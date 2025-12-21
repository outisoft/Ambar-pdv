// resources/js/Pages/Sales/Index.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShoppingCart, Printer, Ban, Receipt } from 'lucide-react';

// Definimos tipos rápidos para esta vista (puedes moverlos a types/index.d.ts si prefieres)
interface SaleItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        name: string;
    };
}

interface Sale {
    id: number;
    total: number;
    status: string; // cancelled, completed
    created_at: string;
    items: SaleItem[];
}

interface SalesProps extends PageProps {
    sales: {
        data: Sale[];
        links: any[]; // Para la paginación
    };
}

export default function Index({ auth, sales }: SalesProps) {

    const isSuperAdmin = auth.user.roles.includes('super-admin');
    const isGerente = auth.user.roles.includes('gerente');

    const handleCancel = (saleId: number) => {
        if (confirm('¿Estás SEGURO de anular esta venta? El stock será devuelto.')) {
            router.delete(route('sales.destroy', saleId));
        }
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'Ventas', href: '/sales' }]}>
            <Head title="Historial de Ventas" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Historial de Ventas
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Revisa y administra las transacciones realizadas.
                        </p>
                    </div>
                    {/* Placeholder for filters if needed */}
                </div>

                {/* Content */}
                <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[100px]">ID Venta</TableHead>
                                <TableHead>Fecha</TableHead>
                                {(isGerente || isSuperAdmin) && (
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Origen
                                    </th>
                                )}
                                <TableHead>Productos</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No hay ventas registradas aún.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sales.data.map((sale) => {
                                    const isCancelled = sale.status === 'cancelled';
                                    return (
                                        <TableRow key={sale.id} className={isCancelled ? 'bg-destructive/5 hover:bg-destructive/10' : ''}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-medium">#{sale.id}</span>
                                                    {isCancelled && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">ANULADA</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        {format(new Date(sale.created_at), 'd MMM yyyy', { locale: es })}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(sale.created_at), 'HH:mm', { locale: es })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            {(isGerente || isSuperAdmin) && (
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {/* Si es Super Admin mostramos la Empresa */}
                                                    {isSuperAdmin && (
                                                        <div className="font-bold text-gray-800">
                                                            {sale.cash_register?.user?.company?.name || 'Empresa ???'}
                                                        </div>
                                                    )}
                                                    {/* Mostramos la Sucursal */}
                                                    <div className="text-xs text-gray-500">
                                                        🏪 {sale.cash_register?.branch?.name || 'Sucursal ???'}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        👤 {sale.cash_register?.user?.name}
                                                    </div>
                                                </td>
                                            )}

                                            <TableCell>
                                                <div className="text-sm max-w-[300px] truncate" title={sale.items.map(i => `${i.quantity} x ${i.product?.name}`).join(', ')}>
                                                    {sale.items.slice(0, 2).map((item, idx) => (
                                                        <span key={item.id} className={isCancelled ? 'line-through opacity-50 block' : 'block'}>
                                                            {item.quantity} x {item.product?.name || 'Producto eliminado'}
                                                        </span>
                                                    ))}
                                                    {sale.items.length > 2 && <span className="text-xs text-muted-foreground italic">+{sale.items.length - 2} más...</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={`font-bold tabular-nums ${isCancelled ? 'line-through text-muted-foreground' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                    ${Number(sale.total).toFixed(2)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <a
                                                        href={route('sales.ticket', sale.id)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button variant="outline" size="sm" className="h-8 gap-2">
                                                            <Receipt className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Ticket</span>
                                                        </Button>
                                                    </a>

                                                    {!isCancelled && auth.user.roles.includes('admin') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleCancel(sale.id)}
                                                            title="Anular Venta"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginación similar a links pero usando botones shadcn si es posible, o manteniendo el estilo simple */}
                <div className="flex justify-center mt-4">
                    <div className="flex flex-wrap gap-1">
                        {sales.links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url || '#'}
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 ${link.active
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'bg-background hover:bg-accent hover:text-accent-foreground border border-input'
                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
