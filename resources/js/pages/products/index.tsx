// resources/js/Pages/Products/Index.tsx
import AuthenticatedLayout from '@/layouts/app-layout'; // Tu layout
import { PageProps, Product } from '@/types'; // Importamos el tipo Product
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FileSpreadsheet, Plus } from 'lucide-react';

// 1. Definimos las props que esta página espera recibir de Laravel
type ProductIndexProps = PageProps & {
    products: Product[];
};

export default function Index({ auth, products }: ProductIndexProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null,
    );

    const openDeleteModal = (product: Product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };
    const confirmDelete = () => {
        if (productToDelete) {
            router.delete(route('products.destroy', productToDelete.id), {
                onSuccess: () =>
                    toast.success('Producto eliminado correctamente.'),
                onError: () => toast.error('No se pudo eliminar el producto.'),
                onFinish: () => cancelDelete(),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Productos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* ... (existing imports) */}

                    {/* ... (inside component) */}

                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl leading-tight font-semibold text-gray-900 dark:text-gray-100">
                            Gestión de Productos
                        </h2>
                        <div className="flex items-center gap-2">
                            <a
                                href={route('products.export')}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                <span className="hidden sm:inline">Exportar Excel</span>
                            </a>
                            <Link
                                href={route('products.create')}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Crear Nuevo</span>
                            </Link>
                        </div>
                    </div>
                    <br />
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
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.stock > 0
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
                                        <thead className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur dark:bg-gray-900/40">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                    Nombre
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                    Precio
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                    Stock
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                            {products.map((product, i) => (
                                                <tr
                                                    key={product.id}
                                                    className={`transition hover:bg-indigo-50/70 dark:hover:bg-indigo-900/20 ${i % 2
                                                            ? 'bg-gray-50/40 dark:bg-gray-800'
                                                            : 'bg-white dark:bg-gray-800'
                                                        }`}
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                        {product.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-indigo-700 tabular-nums dark:text-indigo-300">
                                                        ${product.price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.stock > 0
                                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                                                                }`}
                                                        >
                                                            {product.stock}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <Link
                                                            href={route(
                                                                'products.edit',
                                                                product.id,
                                                            )}
                                                            className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-indigo-600 ring-1 ring-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-300 dark:ring-indigo-400/40 dark:hover:bg-indigo-900/30"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    product,
                                                                )
                                                            }
                                                            className="ml-2 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-300 dark:ring-rose-400/40 dark:hover:bg-rose-900/30"
                                                        >
                                                            Eliminar
                                                        </button>
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

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Confirmar eliminación
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            ¿Seguro que deseas eliminar{' '}
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {productToDelete?.name}
                            </span>
                            ? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={cancelDelete}
                                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700/60"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none dark:bg-rose-600 dark:hover:bg-rose-500"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
