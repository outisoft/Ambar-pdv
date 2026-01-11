// resources/js/Pages/Products/Create.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Package, Tag, Archive, DollarSign, ArrowLeft, Save, AlignLeft, Barcode, Building2, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Company = {
    id: number;
    name: string;
    branches: { id: number; name: string }[];
};

type CreateProps = PageProps & {
    companies?: Company[]; // Optional, valid only for admins
    userBranches?: { id: number; name: string }[]; // Optional, valid for Managers
};

export default function Create({ auth, companies, userBranches }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        barcode: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        cost_price: '',
        company_id: '', // For Admin
        branch_id: '',  // For Admin
    });

    const [availableBranches, setAvailableBranches] = useState<{ id: number; name: string }[]>([]);

    // Effect to filtering branches when company changes
    useEffect(() => {
        if (data.company_id && companies) {
            const selectedCompany = companies.find(c => c.id.toString() === data.company_id.toString());
            setAvailableBranches(selectedCompany?.branches || []);
            setData('branch_id', ''); // Reset branch
        }
    }, [data.company_id]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('products.store'), {
            onSuccess: () => toast.success('Producto creado correctamente.'),
            onError: (errs) => {
                const first = Object.values(errs)[0];
                toast.error(typeof first === 'string' ? first : 'Error al crear el producto.');
            },
        });
    };

    const isGlobalAdmin = !!companies && companies.length > 0;

    return (
        <AuthenticatedLayout>
            <Head title="Crear Producto" />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Crear Producto
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Añade un nuevo artículo al inventario.
                        </p>
                    </div>
                    <Link href={route('products.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                        </Button>
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto w-full">
                    <form onSubmit={submit} className="flex flex-col gap-6">

                        {/* Context Selection (Admin Only) or Display (User) */}
                        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
                            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-primary" /> Contexto del Producto
                            </h2>

                            {isGlobalAdmin ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Empresa</Label>
                                        <Select
                                            value={data.company_id}
                                            onValueChange={(val) => setData('company_id', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar Empresa" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((company) => (
                                                    <SelectItem key={company.id} value={company.id.toString()}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.company_id && <p className="text-destructive text-sm font-medium mt-1">{errors.company_id}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sucursal de Destino</Label>
                                        <Select
                                            value={data.branch_id}
                                            onValueChange={(val) => setData('branch_id', val)}
                                            disabled={!data.company_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={data.company_id ? "Seleccionar Sucursal" : "Seleccione empresa primero"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableBranches.map((branch) => (
                                                    <SelectItem key={branch.id} value={branch.id.toString()}>
                                                        {branch.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.branch_id && <p className="text-destructive text-sm font-medium mt-1">{errors.branch_id}</p>}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border border-dashed">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Building2 className="w-4 h-4 opacity-70" />
                                        <span className="font-medium">Empresa:</span>
                                        <span className="text-foreground font-semibold">{auth.user.company?.name || 'N/A'}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Store className="w-4 h-4 opacity-70" /> Sucursal de Destino
                                        </Label>

                                        {/* Logic: If user has no fixed branch (Manager), let them select. If they have a fixed branch (Cashier), show read-only. */}
                                        {!auth.user.branch && userBranches && userBranches.length > 0 ? (
                                            <Select
                                                value={data.branch_id}
                                                onValueChange={(val) => setData('branch_id', val)}
                                            >
                                                <SelectTrigger className="w-full md:w-[300px] bg-background">
                                                    <SelectValue placeholder="Seleccionar Sucursal" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {userBranches.map((branch) => (
                                                        <SelectItem key={branch.id} value={branch.id.toString()}>
                                                            {branch.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="px-3 py-2 border rounded-md bg-background text-sm font-medium text-foreground max-w-[300px] opacity-80 cursor-not-allowed">
                                                {auth.user.branch?.name || '(Sin asignar)'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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
                                        <Archive className="w-4 h-4 text-muted-foreground" /> Stock Inicial
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
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
                                            onChange={(e) => setData('price', e.target.value)}
                                        />
                                    </div>
                                    {errors.price && <p className="text-destructive text-sm font-medium mt-1">{errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-muted-foreground" /> Costo del Producto
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="pl-7"
                                            value={data.cost_price}
                                            onChange={(e) => setData('cost_price', e.target.value)}
                                        />
                                    </div>
                                    {errors.cost_price && <p className="text-destructive text-sm font-medium mt-1">{errors.cost_price}</p>}
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
                                {processing ? 'Guardando...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> Guardar Producto
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
