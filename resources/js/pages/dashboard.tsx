// resources/js/Pages/Dashboard.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import {
    ArrowUpRight,
    Calendar,
    CreditCard,
    DollarSign,
    TrendingUp,
    Users,
    Activity,
    ShoppingCart
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCashMovement } from '@/Contexts/CashMovementContext';

// 2. Registro de componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

interface DashboardProps extends PageProps {
    todaySales: number;
    todayTransactions: number;
    chartLabels: string[];
    chartData: number[];
    recentSales: {
        id: number;
        client_name: string;
        created_at: string;
        total: number;
        status: string;
    }[];
}

export default function Dashboard({
    auth,
    todaySales,
    todayTransactions,
    chartLabels,
    chartData,
    recentSales,
}: DashboardProps) {
    const { openEntry, openExpense } = useCashMovement();
    const data = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Ventas ($)',
                data: chartData,
                backgroundColor: 'rgba(255, 117, 15, 0.8)', // Primary Orange
                borderColor: '#FF750F',
                borderWidth: 0,
                borderRadius: 4,
                hoverBackgroundColor: '#FF750F',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                backgroundColor: 'oklch(0.205 0 0)', // Dark
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: 'oklch(0.556 0 0)' } // Muted foreground
            },
            y: {
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                    borderDash: [5, 5],
                },
                ticks: {
                    color: 'oklch(0.556 0 0)',
                    callback: function (value: any) { return '$' + value; }
                },
                border: { display: false }
            }
        }
    };

    const currentDate = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">

                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Hola, {auth.user.name.split(' ')[0]} 👋
                        </h1>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={openEntry}
                                className="inline-flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-emerald-500/60 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                            >
                                💰 Entrada
                            </button>
                            <button
                                type="button"
                                onClick={openExpense}
                                className="inline-flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-red-500/60 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors"
                            >
                                💸 Gasto
                            </button>
                        </div>
                        <Link
                            href={route('pos')}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground transition-colors bg-primary rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20"
                        >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Nueva Venta
                        </Link>
                    </div>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Ventas Hoy */}
                    <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ventas Hoy</p>
                                <h3 className="text-2xl font-bold mt-1 text-foreground">${Number(todaySales).toFixed(2)}</h3>
                            </div>
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-600 dark:text-green-400 flex items-center font-medium">
                                <ArrowUpRight className="w-4 h-4 mr-1" />
                                +12.5%
                            </span>
                            <span className="ml-2 text-muted-foreground">vs ayer</span>
                        </div>
                    </div>

                    {/* Card 2: Transacciones */}
                    <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Transacciones</p>
                                <h3 className="text-2xl font-bold mt-1 text-foreground">{todayTransactions}</h3>
                            </div>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-600 dark:text-green-400 flex items-center font-medium">
                                <ArrowUpRight className="w-4 h-4 mr-1" />
                                +5.2%
                            </span>
                            <span className="ml-2 text-muted-foreground">vs ayer</span>
                        </div>
                    </div>

                    {/* Card 3: Clientes Nuevos */}
                    <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Clientes Nuevos</p>
                                <h3 className="text-2xl font-bold mt-1 text-foreground">+24</h3>
                            </div>
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-red-500 dark:text-red-400 flex items-center font-medium">
                                <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                                -2.1%
                            </span>
                            <span className="ml-2 text-muted-foreground">vs semana pasada</span>
                        </div>
                    </div>

                    {/* Card 4: Actividad */}
                    <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Actividad</p>
                                <h3 className="text-2xl font-bold mt-1 text-foreground">98%</h3>
                            </div>
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm w-full">
                            <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: '98%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Charts & Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-foreground">Resumen de Ingesos</h3>
                            <select className="text-sm border-input rounded-lg bg-background text-foreground focus:ring-primary focus:border-primary">
                                <option>Últimos 7 días</option>
                                <option>Este mes</option>
                            </select>
                        </div>
                        <div className="h-[300px] w-full">
                            <Bar options={options} data={data} redraw />
                        </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Transacciones Recientes</h3>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {recentSales.length > 0 ? (
                                recentSales.map((sale) => (
                                    <div
                                        key={sale.id}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {sale.client_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(sale.created_at), {
                                                        addSuffix: true,
                                                        locale: es,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-foreground">
                                                +$ {Number(sale.total).toFixed(2)}
                                            </p>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${sale.status === 'cancelled'
                                                        ? 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400'
                                                        : 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400'
                                                    }`}
                                            >
                                                {sale.status === 'cancelled' ? 'Anulada' : 'Completada'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No hay transacciones recientes.</p>
                            )}
                        </div>
                        <Link
                            href={route('sales.index')}
                            className="mt-4 w-full py-2 text-sm text-center text-muted-foreground hover:text-primary transition-colors font-medium"
                        >
                            Ver todas las transacciones
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
