// resources/js/Pages/Products/Edit.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import { PageProps, Product } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';

// 1. Definimos las props: necesitamos el producto a editar
type EditProps = PageProps & {
    product: Product;
};

export default function Edit({ auth, product }: EditProps) {
    // 2. Inicializamos el formulario CON los datos del producto existente
    const { data, setData, put, processing, errors } = useForm({
        barcode: product.barcode || '',
        name: product.name,
        description: product.description || '', // Manejamos el caso null
        price: product.price,
        stock: product.stock,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        // 3. Usamos 'put' y la ruta 'products.update' pasando el ID del producto
        put(route('products.update', product.id), {
            onSuccess: () =>
                toast.success('Producto actualizado correctamente.'),
            onError: (errs) => {
                const first = Object.values(errs)[0];
                toast.error(
                    typeof first === 'string'
                        ? first
                        : 'Error al actualizar el producto.',
                );
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            // Puedes ajustar el header si quieres
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">
                    Editar Producto: {product.name}
                </h2>
            }
        >
            <Head title="Editar Producto" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
                        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Editar: {product.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Actualiza la información del producto.
                            </p>
                        </div>
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="barcode"
                                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Código de Barras
                                        </label>
                                        <input
                                            id="barcode"
                                            type="text"
                                            value={data.barcode}
                                            onChange={(e) =>
                                                setData(
                                                    'barcode',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                                            placeholder="Ej: 1234567890123"
                                        />
                                        {errors.barcode && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.barcode}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Nombre
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="description"
                                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Descripción
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full resize-y rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Precio
                                        </label>
                                        <input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) =>
                                                setData(
                                                    'price',
                                                    parseFloat(e.target.value),
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                                        />
                                        {errors.price && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.price}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="stock"
                                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Stock
                                        </label>
                                        <input
                                            id="stock"
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) =>
                                                setData(
                                                    'stock',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                                        />
                                        {errors.stock && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.stock}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Link
                                        href={route('products.index')}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700/60"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                                    >
                                        {processing
                                            ? 'Actualizando...'
                                            : 'Actualizar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
