import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Building2, Store, ArrowLeft, Pencil, MapPin, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Branch {
    id: number;
    name: string;
    address: string | null;
}

interface Company {
    id: number;
    name: string;
    logo_path: string | null;
    branches: Branch[];
}

interface Props {
    company: Company;
}

export default function Show({ company }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title={`Empresa: ${company.name}`} />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('companies.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {company.name}
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            Ref: #{company.id}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <Link href={route('companies.edit', company.id)}>
                            <Button className="bg-primary hover:bg-primary/90">
                                <Pencil className="w-4 h-4 mr-2" /> Editar
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6 text-center">
                            <div className="h-32 w-32 mx-auto rounded-full bg-muted flex items-center justify-center overflow-hidden border mb-4">
                                {company.logo_path ? (
                                    <img
                                        src={`/storage/${company.logo_path}`}
                                        alt={company.name}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <Building2 className="h-12 w-12 text-muted-foreground" />
                                )}
                            </div>
                            <h2 className="font-bold text-xl">{company.name}</h2>
                            <p className="text-sm text-muted-foreground mt-1">{company.branches.length} Sucursales</p>
                        </div>
                    </div>

                    {/* Branches List */}
                    <div className="md:col-span-2">
                        <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
                            <div className="p-6 border-b flex items-center justify-between">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Store className="w-5 h-5 text-primary" /> Sucursales
                                </h3>
                                <Link href={route('branches.create', { company_id: company.id })}>
                                    <Button size="sm" variant="secondary">
                                        <Plus className="w-4 h-4 mr-2" /> Nueva Sucursal
                                    </Button>
                                </Link>
                            </div>
                            <div className="p-6">
                                {company.branches.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {company.branches.map((branch) => (
                                            <div
                                                key={branch.id}
                                                className="group flex flex-col justify-between rounded-lg border bg-muted/20 p-4 hover:border-primary/50 hover:bg-muted/40 transition-colors"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                            {branch.name}
                                                        </h4>
                                                        <Link href={route('branches.show', branch.id)}>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                <ArrowLeft className="w-4 h-4 rotate-180" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                    {branch.address ? (
                                                        <p className="text-sm text-muted-foreground mt-2 flex items-start gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                                            {branch.address}
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-muted-foreground mt-2 italic">Sin dirección</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-muted-foreground">
                                        <Store className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                        <p>No hay sucursales registradas.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
