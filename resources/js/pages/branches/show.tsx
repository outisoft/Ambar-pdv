import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Store, Building2, ArrowLeft, Pencil, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Company {
    id: number;
    name: string;
    logo_path: string | null;
}

interface Branch {
    id: number;
    name: string;
    address: string | null;
    company_id: number;
    company: Company;
}

interface Props {
    branch: Branch;
}

export default function Show({ branch }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title={`Sucursal: ${branch.name}`} />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('branches.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {branch.name}
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <Building2 className="w-4 h-4" />
                            {branch.company.name}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <Link href={route('branches.edit', branch.id)}>
                            <Button className="bg-primary hover:bg-primary/90">
                                <Pencil className="w-4 h-4 mr-2" /> Editar
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Info Card */}
                    <div className="md:col-span-2 bg-card text-card-foreground rounded-xl border shadow-sm h-fit">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Información Detallada</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Dirección</p>
                                        <p className="text-sm text-muted-foreground">{branch.address || 'Sin dirección registrada'}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                                        <Store className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Identificador del Sistema</p>
                                        <p className="text-sm text-muted-foreground">ID: #{branch.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Sidebar */}
                    <div className="bg-card text-card-foreground rounded-xl border shadow-sm h-fit">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Empresa Asociada</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                                    {branch.company.logo_path ? (
                                        <img
                                            src={`/storage/${branch.company.logo_path}`}
                                            alt={branch.company.name}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <Building2 className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-semibold truncate text-foreground">{branch.company.name}</h4>
                                    <p className="text-xs text-muted-foreground">ID: {branch.company.id}</p>
                                </div>
                            </div>
                            <Link href={route('companies.show', branch.company.id)} className="w-full">
                                <Button variant="outline" className="w-full">
                                    Ver Empresa <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
