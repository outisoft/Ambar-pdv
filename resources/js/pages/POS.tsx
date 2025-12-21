// resources/js/Pages/POS.tsx
import Cart from '@/components/Cart';
import ProductCard from '@/components/ProductCard';
import AuthenticatedLayout from '@/layouts/app-layout';
import { CartItem, PageProps, Product, Client } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type PosProps = PageProps & {
    products: Product[];
    clients: Client[];
};

export default function POS({ auth, products, clients }: PosProps) {
    const { props } = usePage();
    const flash = props.flash as any;
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
            } else {
                toast.error(`Stock máximo alcanzado para ${productToAdd.name}`);
            }
        } else {
            if (productToAdd.stock > 0) {
                setCartItems([...cartItems, { ...productToAdd, quantity: 1 }]);
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
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

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
        if (flash?.last_sale_id) {
            const url = route('sales.ticket', flash.last_sale_id);
            window.open(url, '_blank', 'width=400,height=600');
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
                            placeholder="Escanea código o busca..."
                            className="pl-9 bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            autoFocus
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
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
                        <Cart
                            cartItems={cartItems}
                            clients={clients}
                            onRemoveFromCart={handleRemoveFromCart}
                            onUpdateQuantity={handleUpdateQuantity}
                            onClearCart={handleClearCart}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
