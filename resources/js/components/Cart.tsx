// resources/js/Components/Cart.tsx
import { CartItem, Client } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { User, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from "@/lib/utils";
import { useHotkeys } from 'react-hotkeys-hook';

interface Props {
    cartItems: CartItem[];
    clients: Client[];
    onRemoveFromCart: (id: number) => void;
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onClearCart: () => void;
    onClientChange?: (clientId: string | number | '') => void;
}

export default function Cart({
    cartItems,
    clients,
    onRemoveFromCart,
    onUpdateQuantity,
    onClearCart,
    onClientChange,
}: Props) {
    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    const { data, setData, post, processing, errors } = useForm({
        items: cartItems,
        payment_method: 'cash',
        client_id: '' as string | number,
    });

    const selectedClient = clients.find(
        (client) => String(client.id) === String(data.client_id),
    );
    const hasCreditOption = (selectedClient?.credit_limit ?? 0) > 0;
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const clientSelectRef = useRef<HTMLSelectElement | null>(null);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    useEffect(() => {
        setData('items', cartItems);
    }, [cartItems]);

    useEffect(() => {
        if (cartItems.length === 0) {
            setSelectedItemId(null);
        }
    }, [cartItems.length]);

    const openCancelDialog = () => {
        if (cartItems.length === 0 || processing) return;
        setShowCancelDialog(true);
    };

    const handleConfirmCancel = () => {
        setShowCancelDialog(false);
        onClearCart();
    };

    const submit = (e?: FormEvent) => {
        e?.preventDefault();

        if (data.payment_method === 'credit') {
            if (!selectedClient) {
                toast.error('Selecciona un cliente para usar crédito.');
                return;
            }

            const creditLimit = selectedClient.credit_limit ?? 0;
            const currentBalance = selectedClient.current_balance ?? 0;

            if (creditLimit <= 0) {
                toast.error('Este cliente no tiene crédito disponible.');
                return;
            }

            const available = creditLimit - currentBalance;

            if (total > available) {
                toast.error(
                    `Crédito insuficiente. Disponible: $${available.toFixed(
                        2,
                    )} | Total: $${total.toFixed(2)}`,
                );
                return;
            }
        }

        post(route('sales.store'), {
            onError: (formErrors) => {
                if (formErrors.stock) toast.error(formErrors.stock);
                if (formErrors.general) toast.error(formErrors.general);
            },
        });
    };

    const handlePaymentChange = (method: string) => {
        setData('payment_method', method);
    };

    // Atajo F3: enfocar selector de cliente
    useHotkeys(
        'f3',
        () => {
            clientSelectRef.current?.focus();
        },
        {
            enableOnFormTags: true,
            preventDefault: true,
        },
        [],
    );

    // Atajo F12: cobrar
    useHotkeys(
        'f12',
        () => {
            if (cartItems.length === 0 || processing) return;
            submit();
        },
        {
            enableOnFormTags: true,
            preventDefault: true,
        },
        [submit, cartItems.length, processing],
    );

    // Atajo Supr: eliminar producto seleccionado
    useHotkeys(
        'del',
        () => {
            if (!selectedItemId) return;
            const exists = cartItems.some((item) => item.id === selectedItemId);
            if (!exists) return;
            onRemoveFromCart(selectedItemId);
            setSelectedItemId(null);
        },
        {
            enableOnFormTags: true,
            preventDefault: true,
        },
        [selectedItemId, cartItems],
    );

    // Atajo ESC: cancelar compra
    useHotkeys(
        'esc',
        () => {
            if (!showCancelDialog) {
                openCancelDialog();
            }
        },
        {
            enableOnFormTags: true,
            preventDefault: true,
        },
        [openCancelDialog, cartItems.length, processing, showCancelDialog],
    );

    // Atajos + / - : modificar cantidad del producto seleccionado
    useHotkeys(
        '+',
        () => {
            if (!selectedItemId) return;
            const item = cartItems.find((i) => i.id === selectedItemId);
            if (!item) return;
            if (item.quantity >= item.stock) return;
            onUpdateQuantity(item.id, item.quantity + 1);
        },
        {
            preventDefault: true,
        },
        [selectedItemId, cartItems],
    );

    useHotkeys(
        '-',
        () => {
            if (!selectedItemId) return;
            const item = cartItems.find((i) => i.id === selectedItemId);
            if (!item) return;
            onUpdateQuantity(item.id, item.quantity - 1);
        },
        {
            preventDefault: true,
        },
        [selectedItemId, cartItems],
    );

    return (
        <Card className="h-full flex flex-col shadow-lg border-2 overflow-hidden">
            <CardHeader className="bg-muted/50 p-4 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ShoppingCart className="w-5 h-5" /> Carrito
                    </CardTitle>
                    <Badge variant="secondary" className="font-mono">
                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-4 gap-4 min-h-0">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <User className="w-3 h-3" /> Cliente (F3)
                    </label>
                    {/* Native select for reliability and speed in high-interaction POS */}
                    <div className="relative">
                        <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            ref={clientSelectRef}
                            value={data.client_id}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData('client_id', value);
                                onClientChange?.(value);

                                const client = clients.find(
                                    (c) => String(c.id) === String(value),
                                );

                                if (!client || (client.credit_limit ?? 0) <= 0) {
                                    setData('payment_method', 'cash');
                                }
                            }}
                        >
                            <option value="">-- Público General --</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.name} {client.tax_id ? `(${client.tax_id})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-1 border rounded-md relative overflow-hidden bg-muted/20">
                    <div className="absolute inset-0 overflow-y-auto p-2">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 gap-2">
                                <ShoppingCart className="w-12 h-12" />
                                <p className="text-sm font-medium">Carrito vacío</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "flex flex-col gap-2 rounded-lg border bg-background p-3 shadow-sm cursor-pointer",
                                            selectedItemId === item.id && "ring-2 ring-primary border-primary"
                                        )}
                                        onClick={() => setSelectedItemId(item.id)}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="font-medium text-sm line-clamp-2 leading-tight">
                                                {item.name}
                                            </span>
                                            <span className="font-mono font-bold text-sm shrink-0">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-sm"
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-mono font-medium tabular-nums">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-sm"
                                                    disabled={item.quantity >= item.stock}
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">
                                                    ${item.price.toFixed(2)} c/u
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => onRemoveFromCart(item.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex-col gap-4 bg-muted/50 p-4 pt-2 border-t">
                <div className="w-full space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Método de Pago
                    </label>
                    <div
                        className={cn(
                            'grid gap-2',
                            hasCreditOption
                                ? 'grid-cols-3 md:grid-cols-4'
                                : 'grid-cols-3',
                        )}
                    >
                        <Button
                            type="button"
                            variant={data.payment_method === 'cash' ? "default" : "outline"}
                            onClick={() => handlePaymentChange('cash')}
                            className={cn(
                                "flex items-center justify-center gap-2 h-auto py-2 text-xs",
                                data.payment_method === 'cash' && "bg-emerald-600 hover:bg-emerald-700"
                            )}
                        >
                            <Banknote className="w-3.5 h-3.5" /> Efectivo
                        </Button>
                        <Button
                            type="button"
                            variant={data.payment_method === 'card' ? "default" : "outline"}
                            onClick={() => handlePaymentChange('card')}
                            className={cn(
                                "flex items-center justify-center gap-2 h-auto py-2 text-xs",
                                data.payment_method === 'card' && "bg-blue-600 hover:bg-blue-700"
                            )}
                        >
                            <CreditCard className="w-3.5 h-3.5" /> Tarjeta
                        </Button>
                        <Button
                            type="button"
                            variant={data.payment_method === 'transfer' ? "default" : "outline"}
                            onClick={() => handlePaymentChange('transfer')}
                            className={cn(
                                "flex items-center justify-center gap-2 h-auto py-2 text-xs",
                                data.payment_method === 'transfer' && "bg-purple-600 hover:bg-purple-700"
                            )}
                        >
                            <Smartphone className="w-3.5 h-3.5" /> Transf.
                        </Button>
                        {hasCreditOption && (
                            <Button
                                type="button"
                                variant={
                                    data.payment_method === 'credit'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => handlePaymentChange('credit')}
                                className={cn(
                                    'flex items-center justify-center gap-2 h-auto py-2 text-xs',
                                    data.payment_method === 'credit' &&
                                        'bg-amber-600 hover:bg-amber-700',
                                )}
                            >
                                <CreditCard className="w-3.5 h-3.5" /> Crédito
                            </Button>
                        )}
                    </div>
                    {errors.payment_method && (
                        <p className="text-xs text-destructive font-medium">{errors.payment_method}</p>
                    )}
                    {data.payment_method === 'credit' && selectedClient && (
                        <div className="bg-blue-50 border border-blue-200 p-2 rounded text-xs mt-2 space-y-1">
                            <p>
                                Límite: <b>${selectedClient.credit_limit ?? 0}</b>
                            </p>
                            <p>
                                Deuda actual:{' '}
                                <b className="text-red-600">
                                    ${selectedClient.current_balance ?? 0}
                                </b>
                            </p>
                            <p>
                                Disponible:{' '}
                                <b className="text-green-600">
                                    $
                                    {(
                                        (selectedClient.credit_limit ?? 0) -
                                        (selectedClient.current_balance ?? 0)
                                    ).toFixed(2)}
                                </b>
                            </p>
                        </div>
                    )}
                </div>

                <div className="w-full flex justify-between items-end">
                    <span className="text-muted-foreground font-medium">Total a Pagar</span>
                    <span className="text-3xl font-extrabold tracking-tight text-primary">
                        ${total.toFixed(2)}
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-2 w-full">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={openCancelDialog}
                        disabled={cartItems.length === 0 || processing}
                        className="col-span-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={submit}
                        disabled={cartItems.length === 0 || processing}
                        className="col-span-3 text-lg font-bold shadow-md"
                        size="lg"
                    >
                        {processing ? 'Procesando...' : 'COBRAR'}
                    </Button>
                </div>
                <p className="w-full text-[11px] text-muted-foreground text-right mt-1">
                    ESC: Cancelar · F12: Cobrar
                </p>
            </CardFooter>

            {/* Modal cancelar compra */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancelar compra</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <p className="text-sm text-muted-foreground">
                            ¿Seguro que deseas cancelar la compra actual? Se eliminarán todos los productos del carrito.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowCancelDialog(false)}
                            >
                                No, volver
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleConfirmCancel}
                                disabled={processing}
                            >
                                Sí, cancelar compra
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
