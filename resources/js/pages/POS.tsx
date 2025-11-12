// resources/js/Pages/POS.tsx
import AuthenticatedLayout from '@/layouts/app-layout'; // Usando tu ruta correcta
import { CartItem, PageProps, Product } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react'; // ¡Importamos el hook useState!

// Importamos los nuevos componentes
import Cart from '@/components/Cart';
import ProductCard from '@/components/ProductCard';

// Definimos las props que esta página recibe de Laravel
type PosProps = PageProps & {
    products: Product[];
};

export default function POS({ auth, products }: PosProps) {
    // ---- ¡AQUÍ ESTÁ LA MAGIA! ----
    // 1. Creamos el estado.
    //    cartItems = el valor actual (un array)
    //    setCartItems = la función para ACTUALIZAR el valor
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // Inicia como array vacío
    // -----------------------------

    // 2. Creamos la función para añadir al carrito
    const handleAddToCart = (productToAdd: Product) => {
        // Revisa si el producto ya está en el carrito
        const existingItem = cartItems.find(
            (item) => item.id === productToAdd.id,
        );

        if (existingItem) {
            // Si existe, actualizamos la cantidad (de forma inmutable)
            setCartItems(
                cartItems.map(
                    (item) =>
                        item.id === productToAdd.id
                            ? { ...item, quantity: item.quantity + 1 } // Incrementa cantidad
                            : item, // Retorna los demás sin cambios
                ),
            );
        } else {
            // Si es nuevo, lo añadimos al array (de forma inmutable)
            setCartItems([...cartItems, { ...productToAdd, quantity: 1 }]);
        }
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    // ↓↓↓ AÑADE ESTO ↓↓↓
    // Inertia nos permite escuchar 'onSuccess' en la navegación.
    // Si la venta es exitosa (paso 2.2), Laravel nos redirige.
    // Escuchamos esa redirección y limpiamos el carrito.
    router.on('success', () => {
        handleClearCart();
    });

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

            {/* Cambiamos el layout a 2 columnas */}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Usamos un grid de 2 columnas */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Columna de Productos (ocupa 2 de 3 partes) */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg md:col-span-2">
                            <div className="p-6 text-gray-900">
                                <h3 className="mb-4 text-lg font-medium text-gray-900">
                                    Catálogo de Productos
                                </h3>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {/* 4. Pasamos la función 'handleAddToCart' como prop
                       a cada ProductCard
                  */}
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={handleAddToCart}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Columna del Carrito */}
                        <div className="md:col-span-1">
                            {/* ↓↓↓ MODIFICA ESTA LÍNEA ↓↓↓ */}
                            <Cart cartItems={cartItems} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
