import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Store, Plus, Pencil, Trash2, MoreHorizontal, MapPin, Building2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Company {
    id: number;
    name: string;
}

interface Branch {
    id: number;
    name: string;
    address: string | null;
    company_id: number;
    company: Company;
}

interface Props {
    branches: Branch[];
}

export default function Index({ branches, canCreateBranch, planName }: Props & { canCreateBranch: boolean; planName?: string | null }) {
    return (
        <AuthenticatedLayout>
            <Head title="Sucursales" />

            <div className="flex flex-col gap-6 p-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Sucursales
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Administra las sedes físicas de tu negocio.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar sucursal..."
                                className="pl-9 w-full md:w-[250px]"
                            />
                        </div>
                        {canCreateBranch ? (
                            <Link href={route('branches.create')}>
                                <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground transition-colors bg-primary rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva Sucursal
                                </button>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                disabled
                                title={`Tu plan ${planName ?? ''} no permite crear más sucursales. Mejora tu plan para continuar.`}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-muted text-muted-foreground cursor-not-allowed border border-dashed border-amber-400/70 shadow-none"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva Sucursal
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid Content */}
                {branches.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {branches.map((branch) => (
                            <div
                                key={branch.id}
                                className="group relative bg-card text-card-foreground rounded-xl border shadow-sm transition-all hover:shadow-md overflow-hidden"
                            >
                                {/* Card Header / Banner */}
                                <div className="h-24 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 flex items-center justify-center relative">
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-background/80 text-muted-foreground backdrop-blur-sm shadow-sm border border-border">
                                            <Building2 className="w-3 h-3 mr-1" />
                                            {branch.company.name}
                                        </span>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-background shadow-sm flex items-center justify-center">
                                        <Store className="w-6 h-6 text-primary" />
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Link href={route('branches.show', branch.id)} className="block">
                                                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                                    {branch.name}
                                                </h3>
                                            </Link>
                                            {branch.address ? (
                                                <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                                                    <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                                                    {branch.address}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-muted-foreground mt-1 italic">
                                                    Sin dirección registrada
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('branches.show', branch.id)} className="cursor-pointer">
                                                        <Store className="w-4 h-4 mr-2" /> Ver Detalles
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('branches.edit', branch.id)} className="cursor-pointer">
                                                        <Pencil className="w-4 h-4 mr-2" /> Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('branches.destroy', branch.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="cursor-pointer text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Footer / Status */}
                                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                                        <span>ID: #BR-{branch.id}</span>
                                        <span className="inline-flex items-center text-green-600 dark:text-green-400 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                            Activa
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="text-center py-20 rounded-2xl border border-dashed">
                        <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Store className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No hay sucursales registradas</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                            Comienza registrando la primera sucursal para una de tus empresas.
                        </p>
                        <div className="mt-6 flex justify-center">
                            {canCreateBranch ? (
                                <Link href={route('branches.create')}>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" /> Crear Primera Sucursal
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    type="button"
                                    disabled
                                    title={`Tu plan ${planName ?? ''} no permite crear más sucursales. Mejora tu plan para continuar.`}
                                    className="cursor-not-allowed bg-muted text-muted-foreground border border-dashed border-amber-400/70 hover:bg-muted"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Crear Primera Sucursal
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
