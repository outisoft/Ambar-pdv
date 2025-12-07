// resources/js/Components/Cart.tsx
import { CartItem, Client } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';

interface Props {
    cartItems: CartItem[];
    clients: Client[];
    onRemoveFromCart: (id: number) => void;
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onClearCart: () => void;
}

export default function Cart({
    cartItems,
    clients,
    onRemoveFromCart,
    onUpdateQuantity,
    onClearCart,
}: Props) {
    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    const { data, setData, post, processing, errors } = useForm({
        items: cartItems,
        payment_method: 'cash',
        client_id: '' as string | number, // Inicializamos vacío
    });

    useEffect(() => {
        setData('items', cartItems);
    }, [cartItems]);

    const handlePaymentChange = (method: string) => {
        setData('payment_method', method);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('sales.store'), {
            onError: (formErrors) => {
                if (formErrors.stock) {
                    toast.error(formErrors.stock);
                }
                if (formErrors.general) {
                    toast.error(formErrors.general);
                }
            },
        });
    };

    return (
        <form
            onSubmit={submit}
            className="h-full rounded-xl border bg-white p-4 shadow-md flex flex-col"
        >
            <div className="mb-4 flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-semibold text-gray-900">Carrito</h3>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {cartItems.length} items
                </span>
            </div>

            {/* SECCIÓN DE CLIENTE (Estratégica: Arriba) */}
            <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                </label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                        className="block w-full rounded-lg border-gray-300 pl-10 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.client_id}
                        onChange={(e) => setData('client_id', e.target.value)}
                    >
                        <option value="">-- Público General --</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* LISTA DE ITEMS (Scrollable) */}
            <div className="flex-1 overflow-y-auto pr-1 mb-4 min-h-0">
                {cartItems.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed bg-gray-50 text-gray-500">
                        <p>Carrito vacío</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border bg-white p-3 transition hover:bg-gray-50"
                            >
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {item.name}
                                    </p>
                                    <div className="mt-1 flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                            className="rounded-md border bg-white px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-100"
                                        >
                                            –
                                        </button>
                                        <span className="min-w-[2ch] text-center text-sm text-gray-700 tabular-nums">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.stock}
                                            className="rounded-md border bg-white px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        ${item.price} c/u
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <p className="font-bold text-gray-900 tabular-nums text-sm">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveFromCart(item.id)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER DEL CARRITO (Método de pago y Totales) */}
            <div className="border-t pt-3 mt-auto">
                <div className="mb-3">
                    <label className="mb-2 block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método de Pago
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => handlePaymentChange('cash')}
                            className={`flex flex-col items-center justify-center rounded border p-2 text-xs transition ${data.payment_method === 'cash'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500'
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-lg">💵</span>
                            <span>Efectivo</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePaymentChange('card')}
                            className={`flex flex-col items-center justify-center rounded border p-2 text-xs transition ${data.payment_method === 'card'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-lg">💳</span>
                            <span>Tarjeta</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePaymentChange('transfer')}
                            className={`flex flex-col items-center justify-center rounded border p-2 text-xs transition ${data.payment_method === 'transfer'
                                    ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-500'
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-lg">📱</span>
                            <span>Transf.</span>
                        </button>
                    </div>
                    {errors.payment_method && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.payment_method}
                        </p>
                    )}
                </div>

                <div className="mb-3 flex items-center justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="tabular-nums">${total.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="submit"
                        disabled={cartItems.length === 0 || processing}
                        className="col-span-2 rounded-lg bg-black py-2.5 text-sm font-bold text-white shadow hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Procesando...' : 'Cobrar'}
                    </button>
                    <button
                        type="button"
                        onClick={onClearCart}
                        disabled={cartItems.length === 0 || processing}
                        className="col-span-2 rounded-lg border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
    );
}
