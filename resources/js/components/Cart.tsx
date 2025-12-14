// resources/js/Components/Cart.tsx
import { CartItem, Client } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

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
        client_id: '' as string | number,
    });

    useEffect(() => {
        setData('items', cartItems);
    }, [cartItems]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
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
                        <User className="w-3 h-3" /> Cliente
                    </label>
                    {/* Native select for reliability and speed in high-interaction POS */}
                    <div className="relative">
                        <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={data.client_id}
                            onChange={(e) => setData('client_id', e.target.value)}
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
                                        className="flex flex-col gap-2 rounded-lg border bg-background p-3 shadow-sm"
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
                    <div className="grid grid-cols-3 gap-2">
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
                    </div>
                    {errors.payment_method && (
                        <p className="text-xs text-destructive font-medium">{errors.payment_method}</p>
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
                        onClick={onClearCart}
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
            </CardFooter>
        </Card>
    );
}
