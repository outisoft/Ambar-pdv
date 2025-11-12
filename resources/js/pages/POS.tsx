// resources/js/Pages/POS.tsx
import Cart from '@/components/Cart';
import ProductCard from '@/components/ProductCard';
import AuthenticatedLayout from '@/layouts/app-layout'; // Usando tu ruta correcta
import { CartItem, PageProps, Product } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

    useEffect(() => {
        const handleSuccess = () => {
            handleClearCart();
        };

        // 1. Capturamos la función de "limpieza" que 'router.on' nos devuelve
        const removeListener = router.on('success', handleSuccess);

        // 2. En el 'return', llamamos a esa función de limpieza
        return () => {
            removeListener();
        };
    }, []); // El array vacío [] significa que este efecto se ejecuta solo una vez

    // ↓↓↓ AÑADE ESTO ↓↓↓
    // Inertia nos permite escuchar 'onSuccess' en la navegación.
    // Si la venta es exitosa (paso 2.2), Laravel nos redirige.
    // Escuchamos esa redirección y limpiamos el carrito.

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
                            <Cart
                                cartItems={cartItems}
                                onRemoveFromCart={handleRemoveFromCart}
                                onUpdateQuantity={handleUpdateQuantity}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
