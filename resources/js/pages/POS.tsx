// resources/js/Pages/POS.tsx
import Cart from '@/components/Cart';
import ProductCard from '@/components/ProductCard';
import AuthenticatedLayout from '@/layouts/app-layout'; // Usando tu ruta correcta
import { CartItem, PageProps, Product } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Definimos las props que esta página recibe de Laravel
type PosProps = PageProps & {
    products: Product[];
};

export default function POS({ auth, products }: PosProps) {
    const { props } = usePage();
    const flash = props.flash as any;
    // ---- ¡AQUÍ ESTÁ LA MAGIA! ----
    // 1. Creamos el estado.
    //    cartItems = el valor actual (un array)
    //    setCartItems = la función para ACTUALIZAR el valor
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // Inicia como array vacío
    // -----------------------------

    // 2. Creamos la función para añadir al carrito
    const handleAddToCart = (productToAdd: Product) => {
        const existingItem = cartItems.find(
            (item) => item.id === productToAdd.id,
        );

        if (existingItem) {
            // --- INICIO DE LA MEJORA ---
            // Comprueba el stock antes de añadir más
            if (existingItem.quantity < productToAdd.stock) {
                setCartItems(
                    cartItems.map((item) =>
                        item.id === productToAdd.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    ),
                );
            } else {
                // Opcional: Avisar al usuario que no hay más stock
                alert(
                    `No puedes añadir más de ${productToAdd.name}, stock máximo alcanzado.`,
                );
            }
            // --- FIN DE LA MEJORA ---
        } else {
            // Solo añade si hay stock disponible
            if (productToAdd.stock > 0) {
                setCartItems([...cartItems, { ...productToAdd, quantity: 1 }]);
            } else {
                alert(`Producto ${productToAdd.name} sin stock.`);
            }
        }
    };

    // ... (justo después de handleAddToCart)

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        // Si la nueva cantidad es 0 o menos, simplemente eliminamos el item
        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
            return;
        }

        // Buscamos el producto original para saber su stock máximo
        const product = products.find((p) => p.id === productId);
        if (!product) return; // No debería pasar, pero es buena práctica

        // Comprobamos contra el stock máximo
        if (newQuantity > product.stock) {
            alert(`Stock máximo alcanzado para ${product.name}.`);
            // Opcional: Seteamos al stock máximo en lugar de no hacer nada
            // newQuantity = product.stock;
            return; // O quitamos este 'return' si usamos la línea de arriba
        }

        // Actualizamos la cantidad para ese item
        setCartItems(
            cartItems.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item,
            ),
        );
    };

    const handleRemoveFromCart = (productIdToRemove: number) => {
        // Usamos .filter() para crear un NUEVO array
        // que incluya solo los items cuyo ID NO coincida
        const newCart = cartItems.filter(
            (item) => item.id !== productIdToRemove,
        );
        setCartItems(newCart);
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    // Barra de búsqueda + filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode?.includes(searchTerm),
    );

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const exactMatch = products.find((p) => p.barcode === searchTerm);
            if (exactMatch) {
                handleAddToCart(exactMatch);
                setSearchTerm('');
                toast.success(`Añadido: ${exactMatch.name}`);
            }
        }
    };

    useEffect(() => {
        // Si de repente llega un 'last_sale_id', abrimos la ventana
        if (flash?.last_sale_id) {
            const url = route('sales.ticket', flash.last_sale_id);

            // Imprimimos en consola para verificar que el dato llega
            console.log('Abriendo ticket para venta ID:', flash.last_sale_id);

            window.open(url, '_blank', 'width=400,height=600');
        }
    }, [flash]); // <-- Se ejecuta cada vez que 'flash' cambia

    // ---------------------------------------------------------
    // EFECTO 2: LIMPIAR CARRITO (Vigila navegación exitosa)
    // ---------------------------------------------------------
    useEffect(() => {
        const handleSuccess = () => {
            handleClearCart();
            // Ya no intentamos abrir el ticket aquí para evitar problemas de sincronización
        };

        // Suscribirse al evento
        const removeListener = router.on('success', handleSuccess);

        // Limpiar suscripción
        return () => {
            removeListener();
        };
    }, []);

    // 3. Renderizamos todo
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">
                    Punto de Venta
                </h2>
            }
        >
            <Head title="Punto de Venta" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Barra de búsqueda */}
                    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                                {/* Icono lupa */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 21-4.35-4.35m1.6-4.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Escanea un código o busca por nombre..."
                                className="w-full rounded-lg border-gray-300 bg-white py-2.5 pr-3 pl-10 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                autoFocus
                                aria-label="Buscar producto por nombre o código de barras"
                            />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Resultados: {filteredProducts.length}</span>
                            <a
                                href={route('cash_register.close')}
                                className="flex items-center gap-2 rounded border border-red-300 bg-red-100 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
                            >
                                🔒 Cerrar Caja
                            </a>
                        </div>
                    </div>

                    {/* Reintroducimos el layout con carrito */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Columna de Productos (ocupa 2 de 3 partes) */}
                        <div className="rounded-xl border bg-white shadow md:col-span-2 dark:border-gray-700 dark:bg-gray-800">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Catálogo de Productos
                                </h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={handleAddToCart}
                                        />
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <div className="col-span-full rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
                                            No se encontraron productos.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Columna del Carrito */}
                        <div className="self-start md:sticky md:top-6">
                            <Cart
                                cartItems={cartItems}
                                onRemoveFromCart={handleRemoveFromCart}
                                onUpdateQuantity={handleUpdateQuantity}
                                onClearCart={handleClearCart}
                            />
                        </div>
                    </div>

                    {/* Eliminamos el contenedor "solo tarjetas" previo */}
                    {/* ...existing code removed (bloque único de cards sin carrito) ... */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
