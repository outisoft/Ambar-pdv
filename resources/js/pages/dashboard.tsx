// resources/js/Pages/Dashboard.tsx
import AuthenticatedLayout from '@/layouts/app-layout'; // Tu layout
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

// 1. Importaciones de Chart.js
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 2. Registro de componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

// 3. Definimos las props que vienen del Controller
interface DashboardProps extends PageProps {
    todaySales: number;
    todayTransactions: number;
    chartLabels: string[];
    chartData: number[];
}

export default function Dashboard({
    auth,
    todaySales,
    todayTransactions,
    chartLabels,
    chartData,
}: DashboardProps) {
    // Configuración de los datos del gráfico
    const data = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Ventas ($)',
                data: chartData,
                backgroundColor: 'rgba(59, 130, 246, 0.5)', // Color azul (Tailwind blue-500)
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Ventas de los últimos 7 días',
            },
        },
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* SECCIÓN 1: TARJETAS DE RESUMEN */}
                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Tarjeta 1: Ventas Hoy */}
                        <div className="overflow-hidden border-l-4 border-green-500 bg-white p-6 shadow-sm sm:rounded-lg">
                            <div className="text-gray-500">Ventas de Hoy</div>
                            <div className="text-3xl font-bold text-gray-800">
                                ${Number(todaySales).toFixed(2)}
                            </div>
                        </div>

                        {/* Tarjeta 2: Transacciones Hoy */}
                        <div className="overflow-hidden border-l-4 border-blue-500 bg-white p-6 shadow-sm sm:rounded-lg">
                            <div className="text-gray-500">
                                Transacciones Hoy
                            </div>
                            <div className="text-3xl font-bold text-gray-800">
                                {todayTransactions}
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: GRÁFICO */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Bar options={options} data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
