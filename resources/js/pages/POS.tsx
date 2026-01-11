// resources/js/Pages/POS.tsx
import Cart from '@/components/Cart';
import ProductCard from '@/components/ProductCard';
import AuthenticatedLayout from '@/layouts/app-layout';
import { CartItem, PageProps, Product, Client } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCashMovement } from '@/Contexts/CashMovementContext';
import useBarcodeScanner from '@/hooks/use-barcode-scanner';
import { useHotkeys } from 'react-hotkeys-hook';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type PosProps = PageProps & {
    products: Product[];
    clients: Client[];
    suspended_sales: any[];
};

export default function POS({ auth, products, clients, suspended_sales }: PosProps) {
    const { props } = usePage();
    const { openEntry, openExpense } = useCashMovement();
    const flash = props.flash as any;
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | number | ''>('');
    const [lastAddedProductId, setLastAddedProductId] = useState<number | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const handleAddToCart = (productToAdd: Product) => {
        const existingItem = cartItems.find((item) => item.id === productToAdd.id);

        if (existingItem) {
            if (existingItem.quantity < productToAdd.stock) {
                setCartItems(
                    cartItems.map((item) =>
                        item.id === productToAdd.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    ),
                );
                setLastAddedProductId(productToAdd.id);
            } else {
                toast.error(`Stock máximo alcanzado para ${productToAdd.name}`);
            }
        } else {
            if (productToAdd.stock > 0) {
                setCartItems([...cartItems, { ...productToAdd, quantity: 1 }]);
                setLastAddedProductId(productToAdd.id);
            } else {
                toast.error(`Producto ${productToAdd.name} sin stock.`);
            }
        }
    };

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
            return;
        }

        const product = products.find((p) => p.id === productId);
        if (!product) return;

        if (newQuantity > product.stock) {
            toast.error(`Stock máximo alcanzado para ${product.name}`);
            return;
        }

        setCartItems(
            cartItems.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item,
            ),
        );
    };

    const handleRemoveFromCart = (productIdToRemove: number) => {
        const newCart = cartItems.filter((item) => item.id !== productIdToRemove);
        setCartItems(newCart);
        if (lastAddedProductId === productIdToRemove) {
            setLastAddedProductId(null);
        }
    };

    const handleClearCart = () => {
        setCartItems([]);
        setLastAddedProductId(null);
        setSelectedClientId('');
    };

    // --- ESCÁNER DE CÓDIGO DE BARRAS ---
    useBarcodeScanner({
        onScan: (code) => {
            const product = products.find((p) => p.barcode === code);

            if (product) {
                handleAddToCart(product);
                new Audio('/sounds/beep.mp3').play().catch(() => {});
                toast.success(`Producto detectado: ${product.name}`);
            } else {
                toast.error(`Producto no encontrado: ${code}`);
            }
        },
    });

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

    // --- ATAJOS DE TECLADO GLOBALES PARA POS ---
    useHotkeys(
        'f2',
        () => {
            searchInputRef.current?.focus();
        },
        {
            enableOnFormTags: true,
            preventDefault: true,
        },
        [],
    );

    useHotkeys(
        'f4',
        () => {
            if (!lastAddedProductId) return;
            const lastItem = cartItems.find((item) => item.id === lastAddedProductId);
            if (!lastItem) return;

            const result = window.prompt(
                `Nueva cantidad para ${lastItem.name}`,
                String(lastItem.quantity),
            );

            if (!result) return;

            const parsed = Number(result.replace(',', '.'));
            if (!Number.isFinite(parsed) || parsed <= 0) {
                toast.error('Cantidad inválida');
                return;
            }

            handleUpdateQuantity(lastAddedProductId, parsed);
        },
        {
            enableOnFormTags: true,
            preventDefault: true,
        },
        [cartItems, lastAddedProductId],
    );

    // Atajo F8: abrir modal de suspender venta
    useHotkeys(
        'f8',
        () => {
            if (cartItems.length === 0) return;
            setShowSuspendModal(true);
        },
        {
            enableOnFormTags: true,
            preventDefault: true,
        },
        [cartItems.length],
    );

    // Atajo F9: abrir modal de recuperar ventas suspendidas
    useHotkeys(
        'f9',
        () => {
            if (!suspended_sales || suspended_sales.length === 0) return;
            setShowRecoverDialog(true);
        },
        {
            enableOnFormTags: true,
            preventDefault: true,
        },
        [suspended_sales?.length],
    );

    // --- SUSPENDER VENTA ---
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [suspendNote, setSuspendNote] = useState('');
    const [showRecoverDialog, setShowRecoverDialog] = useState(false);

    const handleSuspend = () => {
        if (cartItems.length === 0) return;

        const total = cartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
        );

        router.post(route('suspended_sales.store'), {
            items: cartItems,
            client_id: selectedClientId || null,
            total,
            note: suspendNote,
        }, {
            onSuccess: () => {
                handleClearCart();
                setSelectedClientId('');
                setShowSuspendModal(false);
                setSuspendNote('');
                toast.success('Venta suspendida');
            },
        });
    };

    useEffect(() => {
        if (flash?.last_sale_id) {
            const url = route('sales.ticket', flash.last_sale_id);
            window.open(url, '_blank', 'width=400,height=600');
        }
    }, [flash]);

    // Restaurar venta suspendida si viene del backend
    useEffect(() => {
        if (flash?.restoredSale) {
            setCartItems(flash.restoredSale.items || []);
            if (flash.restoredSale.client_id) {
                setSelectedClientId(flash.restoredSale.client_id);
            }
            toast.success('Venta suspendida restaurada');
        }
    }, [flash]);

    useEffect(() => {
        const handleSuccess = () => {
            handleClearCart();
        };
        const removeListener = router.on('success', handleSuccess);
        return () => {
            removeListener();
        };
    }, []);

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'Punto de Venta', href: '/pos' }]}>
            <Head title="Punto de Venta" />
            <div className="h-[calc(100vh-65px)] flex flex-col p-4 gap-4 overflow-hidden">
                {/* Top Bar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border shadow-sm shrink-0">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Escanea código o busca... (F2)"
                            className="pl-9 bg-background"
                            ref={searchInputRef}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            autoFocus
                        />
                    </div>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex gap-2 order-2 md:order-1">
                            
                            <Button
                                type="button"
                                variant="outline" className="gap-2"
                                onClick={openEntry}
                            >
                                💰
                                <span className="hidden sm:inline">Entrada</span>
                            </Button>
                            <Button
                                type="button"
                                variant="outline" className="gap-2"
                                onClick={openExpense}
                            >
                                💸
                                <span className="hidden sm:inline">Gasto</span>
                            </Button>
                        </div>
                        <div className="flex items-center gap-3 order-1 md:order-2 justify-between md:justify-end">
                            <Badge variant="secondary" className="text-sm h-9 px-3">
                                {filteredProducts.length} productos
                            </Badge>
                            <a href={route('cash_register.close')}>
                                <Button variant="destructive" className="gap-2">
                                    <Lock className="w-4 h-4" />
                                    <span className="hidden sm:inline">Cerrar Caja</span>
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
                    {/* Product Catalog Grid */}
                    <div className="md:col-span-8 lg:col-span-9 bg-muted/30 rounded-xl border p-4 overflow-y-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                                    <Search className="w-12 h-12 mb-2 opacity-20" />
                                    <p>No se encontraron productos.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cart Sidebar */}
                    <div className="md:col-span-4 lg:col-span-3 h-full min-h-0 flex flex-col">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2 flex-1"
                                disabled={cartItems.length === 0}
                                onClick={() => setShowSuspendModal(true)}
                            >
                                ⏸️
                                <span className="hidden sm:inline">Suspender (F8)</span>
                            </Button>

                            {suspended_sales && suspended_sales.length > 0 && (
                                <div className="relative flex-1 flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="gap-2 pr-5"
                                        onClick={() => setShowRecoverDialog(true)}
                                    >
                                        📂
                                        <span className="hidden sm:inline">Recuperar (F9)</span>
                                    </Button>
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {suspended_sales.length}
                                    </span>
                                </div>
                            )}
                        </div>
                        <Cart
                            cartItems={cartItems}
                            clients={clients}
                            onRemoveFromCart={handleRemoveFromCart}
                            onUpdateQuantity={handleUpdateQuantity}
                            onClearCart={handleClearCart}
                            onClientChange={setSelectedClientId}
                        />
                    </div>
                </div>

                {/* Modal suspender venta */}
                <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Suspender venta actual</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-2">
                            <Input
                                type="text"
                                placeholder="Referencia (Ej: Señora blusa verde)"
                                value={suspendNote}
                                onChange={(e) => setSuspendNote(e.target.value)}
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowSuspendModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="button" onClick={handleSuspend}>
                                    Confirmar
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Modal recuperar ventas suspendidas */}
                <Dialog open={showRecoverDialog} onOpenChange={setShowRecoverDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Ventas en espera</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 mt-2 max-h-[60vh] overflow-y-auto">
                            {suspended_sales && suspended_sales.length > 0 ? (
                                suspended_sales.map((sale: any) => (
                                    <div
                                        key={sale.id}
                                        className="flex justify-between items-center bg-muted p-3 rounded border"
                                    >
                                        <div>
                                            <div className="font-bold">{sale.note || 'Sin nota'}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(sale.created_at).toLocaleTimeString()} - ${sale.total}
                                                {sale.items && (
                                                    <span>
                                                        {' '}
                                                        ({sale.items.length} productos)
                                                    </span>
                                                )}
                                            </div>
                                            {sale.user && (
                                                <div className="text-xs text-muted-foreground">
                                                    Cajero: {sale.user.name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => {
                                                    router.delete(
                                                        route('suspended_sales.destroy', sale.id),
                                                        {
                                                            onSuccess: () => {
                                                                setShowRecoverDialog(false);
                                                            },
                                                        },
                                                    );
                                                }}
                                            >
                                                Retomar ➤
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No hay ventas suspendidas.
                                </p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
