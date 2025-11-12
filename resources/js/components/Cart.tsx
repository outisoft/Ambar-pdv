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
            className="h-full rounded-xl border bg-white p-4 shadow-md"
        >
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Carrito</h3>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {cartItems.length} items
                </span>
            </div>

            {cartItems.length === 0 ? (
                <p className="rounded-lg border border-dashed bg-gray-50 p-4 text-center text-gray-500">
                    El carrito está vacío.
                </p>
            ) : (
                <>
                    <div className="mb-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border bg-white p-3 transition hover:bg-gray-50"
                            >
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {item.name}
                                    </p>
                                    <div className="mt-1 flex items-center space-x-2">
                                        <button
                                            type="button"
                                            aria-label={`Disminuir cantidad de ${item.name}`}
                                            onClick={() =>
                                                onUpdateQuantity(
                                                    item.id,
                                                    item.quantity - 1,
                                                )
                                            }
                                            className="rounded-md border bg-white px-2 py-1 text-gray-700 transition hover:bg-gray-100"
                                        >
                                            –
                                        </button>
                                        <span className="min-w-[2ch] text-center text-sm text-gray-700 tabular-nums">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            aria-label={`Aumentar cantidad de ${item.name}`}
                                            onClick={() =>
                                                onUpdateQuantity(
                                                    item.id,
                                                    item.quantity + 1,
                                                )
                                            }
                                            disabled={
                                                item.quantity >= item.stock
                                            }
                                            className="rounded-md border bg-white px-2 py-1 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">
                                        ${item.price} x {item.quantity}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <p className="font-bold text-gray-900 tabular-nums">
                                        $
                                        {(item.price * item.quantity).toFixed(
                                            2,
                                        )}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemoveFromCart(item.id)
                                        }
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                                        aria-label={`Eliminar ${item.name} del carrito`}
                                        title="Eliminar"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="sticky bottom-0 space-y-3 border-t pt-3">
                        <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                            <span>Total</span>
                            <span className="tabular-nums">
                                ${total.toFixed(2)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="submit"
                                disabled={cartItems.length === 0 || processing}
                                className="col-span-2 rounded-lg bg-emerald-600 p-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Procesando...'
                                    : 'Procesar Venta'}
                            </button>

                            <button
                                type="button"
                                disabled={cartItems.length === 0 || processing}
                                onClick={onClearCart}
                                className="col-span-2 rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Vaciar Carrito
                            </button>
                        </div>
                    </div>
                </>
            )}
        </form>
    );
}
