// resources/js/Pages/Sales/Index.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

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
                                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                            ID Venta
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                            Fecha
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                            Productos (Resumen)
                                                        </th>
                                                        <th className="px-6 py-3 text-right text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                            Total
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                                    {sales.data.map(
                                                        (sale, i) => (
                                                            <tr
                                                                key={sale.id}
                                                                className={`transition hover:bg-indigo-50/70 dark:hover:bg-indigo-900/30 ${
                                                                    i % 2
                                                                        ? 'bg-gray-50 dark:bg-gray-800/70'
                                                                        : 'bg-white dark:bg-gray-800'
                                                                }`}
                                                            >
                                                                <td className="px-6 py-4 font-semibold whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                                    #{sale.id}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                                                    {new Date(
                                                                        sale.created_at,
                                                                    ).toLocaleString()}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                                    <ul className="space-y-1">
                                                                        {sale.items.map(
                                                                            (
                                                                                item,
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        item.id
                                                                                    }
                                                                                    className="flex justify-between"
                                                                                >
                                                                                    <span>
                                                                                        {
                                                                                            item.quantity
                                                                                        }{' '}
                                                                                        x{' '}
                                                                                        {item
                                                                                            .product
                                                                                            ?.name ||
                                                                                            'Producto eliminado'}
                                                                                    </span>
                                                                                    <span className="text-gray-500 tabular-nums dark:text-gray-400">
                                                                                        $
                                                                                        {(
                                                                                            item.price *
                                                                                            item.quantity
                                                                                        ).toFixed(
                                                                                            2,
                                                                                        )}
                                                                                    </span>
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                    </ul>
                                                                </td>
                                                                <td className="px-6 py-4 text-right font-bold whitespace-nowrap text-emerald-600 tabular-nums dark:text-emerald-400">
                                                                    $
                                                                    {Number(
                                                                        sale.total,
                                                                    ).toFixed(
                                                                        2,
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
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
                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                            link.active
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
