// resources/js/Pages/Products/Index.tsx
import AuthenticatedLayout from '@/layouts/app-layout'; // Tu layout
import { PageProps, Product } from '@/types'; // Importamos el tipo Product
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FileSpreadsheet, Plus, Search, MoreHorizontal, Pencil, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// 1. Definimos las props que esta página espera recibir de Laravel
type ProductIndexProps = PageProps & {
    products: Product[];
};

export default function Index({ auth, products }: ProductIndexProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null,
    );

    const openDeleteModal = (product: Product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };
    const confirmDelete = () => {
        if (productToDelete) {
            router.delete(route('products.destroy', productToDelete.id), {
                onSuccess: () =>
                    toast.success('Producto eliminado correctamente.'),
                onError: () => toast.error('No se pudo eliminar el producto.'),
                onFinish: () => cancelDelete(),
            });
        }
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'Productos', href: '/products' }]}>
            <Head title="Productos" />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Productos
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona tu inventario y catálogo de productos.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar producto..."
                                className="pl-9 w-full md:w-[250px]"
                            />
                        </div>
                        <a href={route('products.export')}>
                            <Button variant="outline" className="gap-2">
                                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                <span className="hidden sm:inline">Exportar</span>
                            </Button>
                        </a>
                        <Link href={route('products.create')}>
                            <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground transition-colors bg-primary rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Producto
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[300px]">Producto</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No se encontraron productos en el inventario.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-primary">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">{product.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Code: <span className="font-mono">{product.barcode || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-foreground">
                                                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={product.stock > 0 ? "outline" : "destructive"} className={product.stock > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}>
                                                {product.stock} u.
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('products.edit', product.id)}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => openDeleteModal(product)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-foreground">
                            Confirmar eliminación
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            ¿Seguro que deseas eliminar{' '}
                            <span className="font-medium text-foreground">
                                {productToDelete?.name}
                            </span>
                            ? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" onClick={cancelDelete}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
