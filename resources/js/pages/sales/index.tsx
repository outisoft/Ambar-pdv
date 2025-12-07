// resources/js/Pages/Sales/Index.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

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
    created_at: string;
    items: SaleItem[];
}

interface SalesProps extends PageProps {
    sales: {
        data: Sale[];
        links: any[]; // Para la paginación
    };
}

const handleCancel = (saleId: number) => {
    if (confirm('¿Estás SEGURO de anular esta venta? El stock será devuelto.')) {
        router.delete(route('sales.destroy', saleId));
    }
};

export default function Index({ auth, sales }: SalesProps) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Historial de Ventas" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl leading-tight font-semibold text-gray-900 dark:text-gray-100">
                        Historial de Ventas
                    </h2>

                    <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {sales.data.length === 0 ? (
                                <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400">
                                    No hay ventas registradas aún.
                                </p>
                            ) : (
                                <>
                                    {/* Vista móvil: tarjetas */}
                                    <div className="grid gap-4 md:hidden">
                                        {sales.data.map((sale) => (
                                            <div
                                                key={sale.id}
                                                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-600 dark:bg-gray-900"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                                        Venta
                                                    </span>
                                                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                                        #{sale.id}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(
                                                        sale.created_at,
                                                    ).toLocaleString()}
                                                </p>
                                                <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                                    {sale.items.map((item) => (
                                                        <li
                                                            key={item.id}
                                                            className="flex justify-between"
                                                        >
                                                            <span>
                                                                {item.quantity}{' '}
                                                                x{' '}
                                                                {item.product
                                                                    ?.name ||
                                                                    'Producto eliminado'}
                                                            </span>
                                                            <span className="text-gray-600 tabular-nums dark:text-gray-400">
                                                                $
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                ).toFixed(2)}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="mt-3 flex justify-end">
                                                    <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                        Total: $
                                                        {Number(
                                                            sale.total,
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Vista escritorio: tabla */}
                                    <div className="hidden md:block">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur dark:bg-gray-900/60">
                                                    <tr>
                                                        {/* ... tus otros headers ... */}
                                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                            ID Venta
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                            Fecha
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                            Productos (Resumen)
                                                        </th>
                                                        {/* 3. CAMBIO VISUAL: Sugiero renombrar este header */}
                                                        <th className="px-6 py-3 text-right text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                            Total / Acciones
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                                    {sales.data.map((sale, i) => {
                                                        // Helper para saber si está anulada
                                                        const isCancelled = sale.status === 'cancelled';

                                                        return (
                                                            <tr
                                                                key={sale.id}
                                                                // 4. CAMBIO: Si está anulada, pintamos la fila de rojo suave
                                                                className={`transition hover:bg-indigo-50/70 dark:hover:bg-indigo-900/30 ${isCancelled
                                                                        ? 'bg-red-50 dark:bg-red-900/20' // Color si está anulada
                                                                        : i % 2
                                                                            ? 'bg-gray-50 dark:bg-gray-800/70'
                                                                            : 'bg-white dark:bg-gray-800'
                                                                    }`}
                                                            >
                                                                <td className="px-6 py-4 font-semibold whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                                    #{sale.id}
                                                                    {/* Badge opcional de anulado */}
                                                                    {isCancelled && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">ANULADA</span>}
                                                                </td>

                                                                {/* ... Columna Fecha (igual) ... */}
                                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                                                    {new Date(sale.created_at).toLocaleString()}
                                                                </td>

                                                                {/* ... Columna Productos (igual) ... */}
                                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                                    <ul className="space-y-1">
                                                                        {sale.items.map((item) => (
                                                                            <li key={item.id} className="flex justify-between">
                                                                                <span className={isCancelled ? 'line-through opacity-50' : ''}>
                                                                                    {item.quantity} x {item.product?.name || 'Producto eliminado'}
                                                                                </span>
                                                                                <span className="text-gray-500 tabular-nums dark:text-gray-400">
                                                                                    ${(item.price * item.quantity).toFixed(2)}
                                                                                </span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </td>

                                                                {/* ... COLUMNA TOTAL Y ACCIONES ... */}
                                                                <td className="px-6 py-4 text-right font-bold whitespace-nowrap text-emerald-600 tabular-nums dark:text-emerald-400">

                                                                    {/* Aquí está el contenedor flex donde agregamos el botón */}
                                                                    <div className="flex items-center justify-end gap-2">

                                                                        {/* PRECIO (Tachado si está anulado) */}
                                                                        <span className={isCancelled ? 'line-through text-gray-400 mr-2' : 'mr-2'}>
                                                                            ${Number(sale.total).toFixed(2)}
                                                                        </span>

                                                                        {/* BOTÓN TICKET (Siempre visible) */}
                                                                        <a
                                                                            href={route('sales.ticket', sale.id)}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            title="Imprimir ticket"
                                                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z" />
                                                                            </svg>
                                                                            <span className="hidden sm:inline">Ticket</span>
                                                                        </a>

                                                                        {/* 5. NUEVO BOTÓN: ANULAR */}
                                                                        {/* Solo se muestra si NO está cancelada y eres Admin */}
                                                                        {!isCancelled && auth.user.roles.includes('admin') && (
                                                                            <button
                                                                                onClick={() => handleCancel(sale.id)}
                                                                                title="Anular Venta"
                                                                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100 hover:border-red-300 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                                                                            >
                                                                                {/* Icono Ban/Trash */}
                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                                                                </svg>
                                                                                <span className="hidden sm:inline">Anular</span>
                                                                            </button>
                                                                        )}

                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Paginación */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                {sales.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url || '#'}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${link.active
                                            ? 'bg-indigo-600 text-white shadow dark:bg-indigo-500'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                            } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
