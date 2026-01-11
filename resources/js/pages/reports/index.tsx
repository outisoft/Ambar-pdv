import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Clock4, BarChart3, Receipt } from 'lucide-react';

export default function ReportsIndex({ auth, branches }: any) {

    // Fechas por defecto: Inicio de mes hasta hoy
    const today = new Date().toISOString().split('T')[0];
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split('T')[0];

    const [filters, setFilters] = useState({
        start_date: firstDay,
        end_date: today,
        branch_id: '',
    });

    const handleDownload = (routeUrl: string) => {
        const url = `${routeUrl}?start_date=${filters.start_date}&end_date=${filters.end_date}&branch_id=${filters.branch_id}`;
        window.open(url, '_blank');
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ title: 'Reportes', href: '/reports' }]}
        >
            <Head title="Reportes" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Centro de Reportes
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Genera reportes filtrados por rango de fechas y sucursal.
                        </p>
                    </div>
                </div>

                {/* Filtros globales */}
                <Card className="bg-card text-card-foreground border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Filtros de reporte
                        </CardTitle>
                        <CardDescription>
                            Aplica un rango de fechas y sucursal; se utilizarán en todos los reportes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Fecha Inicio */}
                            <div className="space-y-1">
                                <Label className="text-sm font-medium text-foreground">Desde</Label>
                                <Input
                                    type="date"
                                    value={filters.start_date}
                                    onChange={(e) =>
                                        setFilters({ ...filters, start_date: e.target.value })
                                    }
                                />
                            </div>

                            {/* Fecha Fin */}
                            <div className="space-y-1">
                                <Label className="text-sm font-medium text-foreground">Hasta</Label>
                                <Input
                                    type="date"
                                    value={filters.end_date}
                                    onChange={(e) =>
                                        setFilters({ ...filters, end_date: e.target.value })
                                    }
                                />
                            </div>

                            {/* Sucursal */}
                            <div className="space-y-1">
                                <Label className="text-sm font-medium text-foreground">Sucursal</Label>
                                <select
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={filters.branch_id}
                                    onChange={(e) =>
                                        setFilters({ ...filters, branch_id: e.target.value })
                                    }
                                >
                                    <option value="">Todas las sucursales</option>
                                    {branches.map((b: any) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tarjetas de reportes disponibles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Reporte de horarios / turnos */}
                            <Card className="bg-card text-card-foreground shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            <Clock4 className="w-4 h-4" />
                                        </span>
                                        Horarios y turnos
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Detalle de horas de apertura, cierre y duración de turnos por cajero.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        className="w-full justify-center gap-2"
                                        onClick={() => handleDownload(route('reports.shifts_pdf'))}
                                    >
                                        <FileText className="w-4 h-4" />
                                        Descargar PDF
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Reporte de utilidades */}
                            <Card className="bg-card text-card-foreground shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            <BarChart3 className="w-4 h-4" />
                                        </span>
                                        Reporte de utilidades
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Analiza márgenes, costos y productos más rentables en pantalla.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full justify-center gap-2" asChild>
                                        <Link
                                            href={route('reports.profit', {
                                                start_date: filters.start_date,
                                                end_date: filters.end_date,
                                            })}
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            Ver reporte
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}