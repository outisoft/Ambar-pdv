import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Plus, Pencil, Trash2, MoreHorizontal, Search, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState } from 'react';

interface Company {
    id: number;
    name: string;
    logo_path: string | null;
    plan?: {
        name: string;
    } | null;
}

interface Props {
    companies: Company[];
}

export default function Index({ companies }: Props) {
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isRenewalOpen, setIsRenewalOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        months: 1,
    });

    const openRenewalModal = (company: Company) => {
        setSelectedCompany(company);
        setData('months', 1);
        setIsRenewalOpen(true);
    };

    const closeRenewalModal = () => {
        setIsRenewalOpen(false);
        setSelectedCompany(null);
        reset('months');
    };

    const handleRenewSubmit = () => {
        if (!selectedCompany) return;
        post(route('companies.renew', selectedCompany.id), {
            preserveScroll: true,
            onSuccess: () => closeRenewalModal(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Empresas" />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Empresas
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona las entidades corporativas del sistema.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar empresa..."
                                className="pl-9 w-full md:w-[250px]"
                            />
                        </div>
                        <Link href={route('companies.create')}>
                            <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground transition-colors bg-primary rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva Empresa
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Grid Content */}
                {companies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                className="group relative bg-card text-card-foreground rounded-xl border shadow-sm transition-all hover:shadow-md overflow-hidden"
                            >
                                {/* Card Header / Banner */}
                                <div className="h-32 bg-muted/30 flex items-center justify-center border-b">
                                    {company.logo_path ? (
                                        <div className="h-20 w-20 rounded-xl bg-background shadow-sm p-2 flex items-center justify-center">
                                            <img
                                                src={`/storage/${company.logo_path}`}
                                                alt={company.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-20 w-20 rounded-xl bg-background shadow-sm flex items-center justify-center">
                                            <Building2 className="w-10 h-10 text-muted-foreground/50" />
                                        </div>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Link href={route('companies.show', company.id)} className="block">
                                                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                                    {company.name}
                                                </h3>
                                            </Link>
                                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                                                REF: {company.id.toString().padStart(4, '0')}
                                            </p>
                                            <div className="mt-2">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                                    Plan: {company.plan?.name ?? 'Sin plan'}
                                                </span>
                                            </div>
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
                                                    <Link href={route('companies.show', company.id)} className="cursor-pointer">
                                                        <Building2 className="w-4 h-4 mr-2" /> Ver Detalles
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('companies.edit', company.id)} className="cursor-pointer">
                                                        <Pencil className="w-4 h-4 mr-2" /> Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <button
                                                        type="button"
                                                        onClick={() => openRenewalModal(company)}
                                                        className="flex w-full items-center text-emerald-600 focus:text-emerald-600"
                                                    >
                                                        <RefreshCw className="w-4 h-4 mr-2" />
                                                        Renovar suscripción
                                                    </button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('companies.destroy', company.id)}
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

                                    {/* Footer */}
                                    <Link href={route('companies.show', company.id)} className="mt-4 pt-4 border-t flex items-center justify-end text-xs text-primary font-medium hover:underline">
                                        Gestionar Sucursales <ArrowRight className="w-3 h-3 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="text-center py-20 rounded-2xl border border-dashed">
                        <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No hay empresas registradas</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                            Comienza registrando la primera empresa para gestionar sus sucursales y usuarios.
                        </p>
                        <div className="mt-6">
                            <Link href={route('companies.create')}>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" /> Crear Primera Empresa
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                <Dialog open={isRenewalOpen} onOpenChange={(open) => !open && closeRenewalModal()}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Renovar suscripción</DialogTitle>
                            <DialogDescription>
                                Define por cuántos meses deseas extender la suscripción de esta empresa.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Empresa seleccionada:{' '}
                                <span className="font-medium text-foreground">
                                    {selectedCompany?.name}
                                </span>
                            </p>
                            <label className="flex flex-col gap-1 text-sm">
                                <span className="text-muted-foreground">Meses a renovar</span>
                                <Input
                                    type="number"
                                    min={1}
                                    value={data.months}
                                    onChange={(e) => setData('months', Number(e.target.value) || 1)}
                                    className="w-32"
                                />
                            </label>
                        </div>

                        <DialogFooter className="mt-6 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={closeRenewalModal} disabled={processing}>
                                Cancelar
                            </Button>
                            <Button type="button" onClick={handleRenewSubmit} disabled={processing} className="gap-2">
                                <RefreshCw className="w-4 h-4" />
                                {processing ? 'Actualizando...' : 'Confirmar renovación'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
