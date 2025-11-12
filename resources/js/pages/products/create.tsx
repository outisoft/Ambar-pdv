// resources/js/Pages/Products/Create.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react'; // Importa Link y useForm
import { FormEvent } from 'react'; // Para el tipo del evento del formulario

export default function Create({ auth }: PageProps) {
    // 1. Inicializa el hook useForm con los campos de tu producto
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: 0,
        stock: 0,
    });

    // 2. Función que maneja el envío del formulario
    const submit = (e: FormEvent) => {
        e.preventDefault();
        // 3. 'post' envía los 'data' a la ruta 'products.store'
        post(route('products.store'), {
            onSuccess: () => {
                // Opcional: Mostrar toast de éxito
                // toast.success('Producto creado!');
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl leading-tight font-semibold text-gray-800">
                        Crear Nuevo Producto
                    </h2>
                    <Link
                        href={route('products.index')}
                        className="rounded bg-gray-500 px-4 py-2 text-white shadow-sm hover:bg-gray-600"
                    >
                        Volver
                    </Link>
                </div>
            }
        >
            <Head title="Crear Producto" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* 4. Formulario */}
                            <form onSubmit={submit} className="space-y-4">
                                {/* Nombre */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
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
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {/* Muestra el error de validación de Laravel */}
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Descripción
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Precio */}
                                <div>
                                    <label
                                        htmlFor="price"
                                        className="block text-sm font-medium text-gray-700"
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
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>

                                {/* Stock */}
                                <div>
                                    <label
                                        htmlFor="stock"
                                        className="block text-sm font-medium text-gray-700"
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
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    {errors.stock && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.stock}
                                        </p>
                                    )}
                                </div>

                                {/* Botón de Enviar */}
                                <div className="flex items-center justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600 disabled:bg-blue-300"
                                    >
                                        {processing
                                            ? 'Guardando...'
                                            : 'Guardar Producto'}
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
