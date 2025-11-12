// resources/js/Components/Cart.tsx
import { CartItem } from '@/types';
import { useForm } from '@inertiajs/react'; // <-- ¡Importa useForm!
import { FormEvent, useEffect } from 'react'; // Para el tipo del formulario
import toast from 'react-hot-toast';

// 1. Actualizamos las Props (ya no necesitamos onClearCart)
interface Props {
    cartItems: CartItem[];
    onRemoveFromCart: (id: number) => void; // <-- Nueva prop
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onClearCart: () => void;
}

export default function Cart({
    cartItems,
    onRemoveFromCart,
    onUpdateQuantity,
    onClearCart,
}: Props) {
    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        items: cartItems, // Los datos que enviaremos
    });

    useEffect(() => {
        setData('items', cartItems);
    }, [cartItems]);

    // 4. La función que maneja el envío
    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('sales.store'), {
            // 2. AÑADE EL MANEJADOR 'onError'
            onError: (formErrors) => {
                if (formErrors.stock) {
                    toast.error(formErrors.stock);
                }
                if (formErrors.general) {
                    toast.error(formErrors.general);
                }
                // Puedes añadir más si tienes otros errores
            },
        });
    };

    return (
        // 5. ¡Envolvemos todo en un <form>!
        <form
            onSubmit={submit}
            className="h-full rounded-lg border bg-gray-50 p-4 shadow-sm"
        >
            <h3 className="mb-4 text-lg font-medium text-gray-900">Carrito</h3>

            {cartItems.length === 0 ? (
                <p className="text-gray-500">El carrito está vacío.</p>
            ) : (
                <>
                    {/* ... (tu .map() de cartItems. No cambia nada aquí) ... */}
                    <div className="mb-4 space-y-2">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <div className="mt-1 flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onUpdateQuantity(
                                                    item.id,
                                                    item.quantity - 1,
                                                )
                                            }
                                            className="rounded bg-gray-200 px-2 hover:bg-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            x {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onUpdateQuantity(
                                                    item.id,
                                                    item.quantity + 1,
                                                )
                                            }
                                            // Deshabilitamos el botón si la cantidad alcanza el stock
                                            disabled={
                                                item.quantity >= item.stock
                                            }
                                            className="rounded bg-gray-200 px-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        ${item.price} x {item.quantity}
                                    </p>
                                </div>
                                <p className="font-bold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <button
                                    type="button" // ¡Importante! Para que no envíe el formulario
                                    onClick={() => onRemoveFromCart(item.id)}
                                    className="font-bold text-red-500 hover:text-red-700"
                                    aria-label="Eliminar item"
                                >
                                    &times; {/* Este es el símbolo 'X' */}
                                </button>
                            </div>
                        ))}
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    {/* 6. El botón de envío */}
                    <div className="mt-4 space-y-2">
                        {/* Botón de Procesar Venta */}
                        <button
                            type="submit"
                            disabled={cartItems.length === 0 || processing}
                            className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600 disabled:bg-gray-400"
                        >
                            {processing ? 'Procesando...' : 'Procesar Venta'}
                        </button>

                        {/* 3. AÑADE ESTE BOTÓN */}
                        <button
                            type="button" // ¡Importante! Para que no envíe el formulario
                            disabled={cartItems.length === 0 || processing}
                            onClick={onClearCart} // Llama a la función del padre
                            className="w-full rounded bg-red-500 p-2 text-white hover:bg-red-600 disabled:bg-gray-400"
                        >
                            Vaciar Carrito
                        </button>
                    </div>
                </>
            )}
        </form>
    );
}
