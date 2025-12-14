// resources/js/Pages/Products/Edit.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import { PageProps, Product } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Package, Tag, Archive, DollarSign, ArrowLeft, Save, AlignLeft, Barcode, Building2, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 1. Definimos las props
type Company = {
    id: number;
    name: string;
    branches: { id: number; name: string }[];
};

type EditProps = PageProps & {
    product: Product & { company?: { name: string } }; // Extending type to include loaded company relationship if needed
    companies?: Company[]; // In case we want to allow transfer in future, but for now just context
    userBranches?: { id: number; name: string }[];
};

export default function Edit({ auth, product, companies, userBranches }: EditProps) {
    // 2. Inicializamos el formulario CON los datos del producto existente
    const { data, setData, put, processing, errors } = useForm({
        barcode: product.barcode || '',
        name: product.name,
        description: product.description || '', // Manejamos el caso null
        price: product.price,
        stock: product.stock,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        // 3. Usamos 'put' y la ruta 'products.update' pasando el ID del producto
        put(route('products.update', product.id), {
            onSuccess: () =>
                toast.success('Producto actualizado correctamente.'),
            onError: (errs) => {
                const first = Object.values(errs)[0];
                toast.error(
                    typeof first === 'string'
                        ? first
                        : 'Error al actualizar el producto.',
                );
            },
        });
    };

    // Determine context string
    const isGlobalAdmin = !!companies;
    const companyName = isGlobalAdmin
        ? (companies?.find(c => c.id === (product as any).company_id)?.name || 'Desconocida')
        : auth.user.company?.name;

    return (
        <AuthenticatedLayout>
            <Head title="Editar Producto" />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Editar Producto
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Actualiza los detalles de {product.name}.
                        </p>
                    </div>
                    <Link href={route('products.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                        </Button>
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
                    <form onSubmit={submit} className="flex flex-col gap-6">

                        {/* Context Info (Read Only for Edit) */}
                        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
                            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-primary" /> Contexto del Producto
                            </h2>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg border border-dashed">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 opacity-70" />
                                    <span className="font-medium">Empresa Propietaria:</span>
                                    <span className="text-foreground font-semibold">{companyName || 'N/A'}</span>
                                </div>
                                <div className="w-px h-4 bg-border hidden sm:block"></div>

                                {/* Logic: If Manager (no fixed branch), show selection or context info. If Cashier (fixed branch), show fixed. */}
                                {!auth.user.branch && userBranches && userBranches.length > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <Store className="w-4 h-4 opacity-70" />
                                        <span className="font-medium">Sucursal (Stock):</span>
                                        {/* Manager Context */}
                                        <span className="text-foreground font-medium px-2 py-1 bg-background rounded border">
                                            {'(Selección múltiple disponible)'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Store className="w-4 h-4 opacity-70" />
                                        <span className="font-medium">Sucursal (Stock):</span>
                                        <span className="text-foreground">
                                            {auth.user.branch?.name || (isGlobalAdmin ? 'Vista Admin (Global/Pivot)' : 'N/A')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                * Nota: El stock mostrado corresponde a la sucursal actual o principal asociada.
                            </p>
                        </div>


                        {/* Product Details */}
                        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg">Información del Producto</h2>
                                    <p className="text-sm text-muted-foreground">Detalles básicos e inventario.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-muted-foreground" /> Nombre del Producto
                                    </Label>
                                    <Input
                                        placeholder="Ej: Monitor 24''"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-destructive text-sm font-medium mt-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Barcode className="w-4 h-4 text-muted-foreground" /> Código de Barras
                                    </Label>
                                    <Input
                                        placeholder="Ej: 1234567890123"
                                        value={data.barcode}
                                        onChange={(e) => setData('barcode', e.target.value)}
                                    />
                                    {errors.barcode && <p className="text-destructive text-sm font-medium mt-1">{errors.barcode}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Archive className="w-4 h-4 text-muted-foreground" /> Stock Actual
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', parseInt(e.target.value))}
                                    />
                                    {errors.stock && <p className="text-destructive text-sm font-medium mt-1">{errors.stock}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-muted-foreground" /> Precio de Venta
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="pl-7"
                                            value={data.price}
                                            onChange={(e) => setData('price', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    {errors.price && <p className="text-destructive text-sm font-medium mt-1">{errors.price}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label className="flex items-center gap-2">
                                        <AlignLeft className="w-4 h-4 text-muted-foreground" /> Descripción
                                    </Label>
                                    <textarea
                                        rows={3}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Detalles breves del producto"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && <p className="text-destructive text-sm font-medium mt-1">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-card border shadow-sm flex justify-end gap-3 rounded-xl">
                            <Link href={route('products.index')}>
                                <Button variant="ghost">Cancelar</Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">
                                {processing ? 'Actualizando...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> Actualizar Producto
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
