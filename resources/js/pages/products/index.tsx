// resources/js/Pages/Products/Index.tsx
import AuthenticatedLayout from '@/layouts/app-layout'; // Tu layout
import { PageProps, Product } from '@/types'; // Importamos el tipo Product
import { Head, Link } from '@inertiajs/react';

// 1. Definimos las props que esta página espera recibir de Laravel
type ProductIndexProps = PageProps & {
    products: Product[];
};

export default function Index({ auth, products }: ProductIndexProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl leading-tight font-semibold text-gray-900 dark:text-gray-100">
                        Gestión de Productos
                    </h2>
                    <Link
                        href={route('products.create')}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:bg-indigo-600 dark:hover:bg-indigo-500"
                    >
                        Crear Nuevo Producto
                    </Link>
                </div>
            }
        >
            <Head title="Productos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
                        {/* Contenido */}
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Vista móvil: tarjetas */}
                            <div className="grid gap-3 md:hidden">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Nombre
                                                </p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                                    {product.name}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    product.stock > 0
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                                                }`}
                                            >
                                                Stock: {product.stock}
                                            </span>
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Precio
                                            </p>
                                            <p className="font-semibold text-indigo-700 tabular-nums dark:text-indigo-300">
                                                ${product.price}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex justify-end gap-3">
                                            <a
                                                href="#"
                                                className="rounded-md px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
                                            >
                                                Editar
                                            </a>
                                            <a
                                                href="#"
                                                className="rounded-md px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/20"
                                            >
                                                Eliminar
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Vista desktop: tabla */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="sticky top-0 z-10 bg-gray-50/70 backdrop-blur dark:bg-gray-900/30">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-300">
                                                    Nombre
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-300">
                                                    Precio
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-300">
                                                    Stock
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-300">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                            {products.map((product) => (
                                                <tr
                                                    key={product.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                        {product.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-indigo-700 tabular-nums dark:text-indigo-300">
                                                        ${product.price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                product.stock >
                                                                0
                                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                                                            }`}
                                                        >
                                                            {product.stock}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                        <a
                                                            href="#"
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200"
                                                        >
                                                            Editar
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="ml-4 text-rose-600 hover:text-rose-900 dark:text-rose-300 dark:hover:text-rose-200"
                                                        >
                                                            Eliminar
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
