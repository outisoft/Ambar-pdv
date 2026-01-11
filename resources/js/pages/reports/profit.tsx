import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3 } from 'lucide-react';

export default function ProfitReport({ auth, kpi, topProducts, filters }: any) {
    const [dateRange, setDateRange] = useState({
        start_date: filters.start_date,
        end_date: filters.end_date,
    });

    const handleFilter = () => {
        router.get(route('reports.profit'), dateRange, { preserveState: true });
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount ?? 0);
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'Reportes', href: '/reports' }, { title: 'Utilidades' }]}>
            <Head title="Reporte de Utilidades" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <BarChart3 className="w-4 h-4" />
                            </span>
                            Reporte de Utilidades
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Analiza el desempeño de tus productos por rango de fechas.
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <Card className="bg-card text-card-foreground border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            Filtros de utilidad
                        </CardTitle>
                        <CardDescription>
                            Selecciona el periodo para calcular ventas, costos y margen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">Desde</label>
                                <Input
                                    type="date"
                                    value={dateRange.start_date}
                                    onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">Hasta</label>
                                <Input
                                    type="date"
                                    value={dateRange.end_date}
                                    onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                                />
                            </div>
                            <div className="flex md:justify-end">
                                <Button className="w-full md:w-auto" onClick={handleFilter}>
                                    Aplicar filtros
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* KPIs principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-card text-card-foreground border shadow-sm">
                        <CardContent className="pt-4 flex flex-col gap-1">
                            <span className="text-xs font-medium uppercase text-muted-foreground">Ventas Totales</span>
                            <span className="text-2xl font-bold text-foreground">{formatMoney(kpi.income)}</span>
                        </CardContent>
                    </Card>

                    <Card className="bg-card text-card-foreground border shadow-sm">
                        <CardContent className="pt-4 flex flex-col gap-1">
                            <span className="text-xs font-medium uppercase text-muted-foreground">Costo de Ventas</span>
                            <span className="text-2xl font-bold text-red-600">{formatMoney(kpi.cost)}</span>
                        </CardContent>
                    </Card>

                    <Card className="bg-card text-card-foreground border shadow-sm">
                        <CardContent className="pt-4 flex flex-col gap-1">
                            <span className="text-xs font-medium uppercase text-muted-foreground">Utilidad Bruta</span>
                            <span className="text-3xl font-bold text-emerald-600">{formatMoney(kpi.profit)}</span>
                        </CardContent>
                    </Card>

                    <Card className="bg-card text-card-foreground border shadow-sm">
                        <CardContent className="pt-4 flex flex-col gap-1">
                            <span className="text-xs font-medium uppercase text-muted-foreground">Margen</span>
                            <span className="text-3xl font-bold text-purple-600">{kpi.margin}%</span>
                            <span className="text-xs text-muted-foreground">Rentabilidad sobre ventas</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla de productos más rentables */}
                <Card className="bg-card text-card-foreground border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Top 10 productos más rentables</CardTitle>
                        <CardDescription>
                            Ordenados por utilidad generada en el periodo seleccionado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-right">Vendidos</TableHead>
                                    <TableHead className="text-right">Ingreso</TableHead>
                                    <TableHead className="text-right">Costo</TableHead>
                                    <TableHead className="text-right">Ganancia Neta</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topProducts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No hay datos en este periodo.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {topProducts.map((prod: any, idx: number) => (
                                    <TableRow key={idx} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">{prod.name}</TableCell>
                                        <TableCell className="text-right text-sm">{prod.total_sold}</TableCell>
                                        <TableCell className="text-right text-sm text-muted-foreground">
                                            {formatMoney(prod.income)}
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-red-500">
                                            {formatMoney(prod.total_cost)}
                                        </TableCell>
                                        <TableCell className="text-right text-sm font-semibold text-emerald-600">
                                            {formatMoney(prod.profit)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}