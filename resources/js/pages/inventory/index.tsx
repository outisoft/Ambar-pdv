import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

// Tipos para TypeScript
interface Product {
    id: number;
    name: string;
    barcode: string;
    stock: number;
    min_stock: number;
}

export default function InventoryIndex({ auth, branches, selectedBranchId, products, filters, canEdit }: any) {

    // Estado para búsqueda
    const [search, setSearch] = useState(filters.search || '');

    // Estado para controlar qué fila se edita
    const [editingId, setEditingId] = useState<number | null>(null);

    // Formulario de edición
    const { data, setData, post, processing, reset } = useForm({
        branch_id: selectedBranchId,
        stock: 0,
        min_stock: 0,
    });

    // Manejar cambio de sucursal
    const handleBranchChange = (e: any) => {
        router.get(route('inventory.index'),
            { branch_id: e.target.value, search },
            { preserveState: true }
        );
    };

    // Manejar búsqueda
    const handleSearch = (e: any) => {
        e.preventDefault();
        router.get(route('inventory.index'),
            { branch_id: selectedBranchId, search },
            { preserveState: true }
        );
    };

    // Iniciar edición
    const startEdit = (product: Product) => {
        setEditingId(product.id);
        setData({
            branch_id: selectedBranchId,
            stock: product.stock,
            min_stock: product.min_stock,
        });
    };

    // Guardar cambios
    const saveEdit = (productId: number) => {
        post(route('inventory.update', productId), {
            onSuccess: () => setEditingId(null),
            preserveScroll: true,
        });
    };

    const isCajero = auth.user.roles.includes('cajero');

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Inventario" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Inventario por Sucursal
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Consulta y actualiza el stock disponible en cada sucursal.
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <Card className="bg-card text-card-foreground border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-foreground">
                            Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-4 md:items-end">
                        {/* Selector de Sucursal */}
                        <div className="w-full md:w-1/3 space-y-1">
                            <Label className="text-sm font-medium text-foreground">Sucursal</Label>
                            <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedBranchId}
                                onChange={handleBranchChange}
                                disabled={!branches.length || isCajero}
                            >
                                {branches.map((b: any) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Buscador */}
                        <form
                            onSubmit={handleSearch}
                            className="w-full md:w-1/3 flex flex-col sm:flex-row gap-2 items-end"
                        >
                            <div className="w-full space-y-1">
                                <Label className="text-sm font-medium text-foreground">Buscar producto</Label>
                                <Input
                                    type="text"
                                    placeholder="Nombre o código..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="default"
                                className="sm:w-auto h-10 flex items-center gap-2 sm:self-end"
                            >
                                <Search className="w-4 h-4" />
                                <span className="hidden sm:inline">Buscar</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Tabla de inventario */}
                <Card className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="min-w-[220px]">Producto</TableHead>
                                        <TableHead className="text-center min-w-[120px]">Stock actual</TableHead>
                                        <TableHead className="text-center min-w-[140px]">Alerta mínima</TableHead>
                                        {canEdit && (
                                            <TableHead className="text-right min-w-[140px]">Acciones</TableHead>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.length > 0 ? (
                                        products.data.map((product: Product) => {
                                            const isEditing = editingId === product.id;
                                            const isLowStock = product.stock <= product.min_stock;

                                            return (
                                                <TableRow
                                                    key={product.id}
                                                    className={`${isLowStock && !isEditing
                                                            ? 'bg-amber-50 dark:bg-amber-950/40'
                                                            : ''
                                                        }`}
                                                >
                                                    {/* Info producto */}
                                                    <TableCell>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {product.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                Cod: {product.barcode}
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    {/* Stock actual */}
                                                    <TableCell className="text-center">
                                                        {isEditing ? (
                                                            <Input
                                                                type="number"
                                                                className="w-24 mx-auto text-center"
                                                                value={data.stock}
                                                                onChange={(e) =>
                                                                    setData('stock', parseInt(e.target.value) || 0)
                                                                }
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <Badge
                                                                variant={product.stock === 0 ? 'destructive' : 'secondary'}
                                                                className="min-w-[3rem] justify-center text-sm font-semibold"
                                                            >
                                                                {product.stock}
                                                            </Badge>
                                                        )}
                                                    </TableCell>

                                                    {/* Stock mínimo */}
                                                    <TableCell className="text-center">
                                                        {isEditing ? (
                                                            <Input
                                                                type="number"
                                                                className="w-24 mx-auto text-center"
                                                                value={data.min_stock}
                                                                onChange={(e) =>
                                                                    setData(
                                                                        'min_stock',
                                                                        parseInt(e.target.value) || 0
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">
                                                                {product.min_stock}
                                                            </span>
                                                        )}
                                                    </TableCell>

                                                    {/* Acciones */}
                                                    {canEdit && (
                                                        <TableCell className="text-right">
                                                            {isEditing ? (
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => saveEdit(product.id)}
                                                                        disabled={processing}
                                                                    >
                                                                        Guardar
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            setEditingId(null);
                                                                            reset();
                                                                        }}
                                                                    >
                                                                        Cancelar
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-primary hover:text-primary"
                                                                    onClick={() => startEdit(product)}
                                                                >
                                                                    Editar stock
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={canEdit ? 4 : 3}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                No se encontraron productos.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Paginación simple (si la necesitas más adelante) */}
                        <div className="p-4 border-t border-border text-sm text-muted-foreground">
                            {/* Aquí puedes integrar tu componente de paginación si lo tienes */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}