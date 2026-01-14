// resources/js/Pages/Products/Index.tsx
import AuthenticatedLayout from '@/layouts/app-layout'; // Tu layout
import Can from '@/components/can';
import Modal from '@/components/Modal'; // Modal para importación
import { PageProps, Product } from '@/types'; // Importamos el tipo Product
import { Head, Link, router, useForm } from '@inertiajs/react';
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

    // Estado para el modal de importación
    const [isImportModalOpen, setImportModalOpen] = useState(false);

    // Formulario de importación masiva
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

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
                onSuccess: () => {
                    toast.success('Producto eliminado correctamente.');
                },
                onError: (errors: Record<string, string>) => {
                    const message =
                        errors?.delete ||
                        errors?.general ||
                        'No se pudo eliminar el producto.';
                    toast.error(message);
                },
                onFinish: () => cancelDelete(),
            });
        }
    };

    const submitImport = (e: any) => {
        e.preventDefault();
        post(route('import.products'), {
            // Inertia detecta automáticamente archivos y usa FormData
            onSuccess: () => {
                setImportModalOpen(false);
                reset();
                toast.success('Inventario importado correctamente.');
            },
            onError: () => {
                toast.error('No se pudo importar el inventario.');
            },
        });
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
                        {/* Botón Importar Inventario */}
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            onClick={() => setImportModalOpen(true)}
                        >
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                            <span className="hidden sm:inline">Importar</span>
                        </Button>
                        <a href={route('products.export')}>
                            <Button variant="outline" className="gap-2">
                                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                <span className="hidden sm:inline">Exportar</span>
                            </Button>
                        </a>
                        <Can permission="create_products">
                            <Link href={route('products.create')}>
                                <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground transition-colors bg-primary rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Producto
                                </button>
                            </Link>
                        </Can>
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
                                                <Can permission="edit_products">
                                                    <Link href={route('products.edit', product.id)}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </Can>
                                                <Can permission="delete_products">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => openDeleteModal(product)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </Can>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal de Importación Masiva */}
            <Modal show={isImportModalOpen} onClose={() => setImportModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Importación Masiva de Productos</h2>

                    <div className="mb-4 text-sm text-muted-foreground">
                        <p>1. Descarga la plantilla para ver el formato correcto.</p>
                        <p>2. Llena tus datos respetando las columnas.</p>
                        <p>3. Sube el archivo para importar el inventario.</p>
                    </div>

                    <a
                        href={route('import.template')}
                        className="block w-full text-center border border-border bg-muted py-2 rounded mb-6 text-primary hover:underline"
                    >
                        ⬇️ Descargar Plantilla CSV
                    </a>

                    <form onSubmit={submitImport}>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2 text-sm">
                                Seleccionar Archivo (.xlsx, .csv)
                            </label>
                            <input
                                type="file"
                                onChange={e => setData('file', e.target.files ? e.target.files[0] : null)}
                                className="w-full border border-input p-2 rounded-md text-sm"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            />
                            {errors.file && (
                                <div className="text-destructive text-xs mt-1">
                                    {errors.file}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setImportModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {processing ? 'Subiendo...' : 'Iniciar Importación'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

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
