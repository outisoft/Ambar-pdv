import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Building2, Store, ArrowLeft, Pencil, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Header / Company Details */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                {/* Logo */}
                                <div className="h-24 w-24 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                                    {company.logo_path ? (
                                        <img
                                            src={`/storage/${company.logo_path}`}
                                            alt={company.name}
                                            className="h-full w-full object-contain p-2"
                                        />
                                    ) : (
                                        <Building2 className="h-10 w-10 text-gray-400" />
                                    )}
                                </div>

                                {/* Info */}
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                        {company.name}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                        <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            ID: {company.id}
                                        </span>
                                        <span>•</span>
                                        <span>{company.branches.length} Sucursales registradas</span>
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <Link href={route('companies.index')}>
                                    <Button variant="outline" className="w-full md:w-auto">
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                                    </Button>
                                </Link>
                                <Link href={route('companies.edit', company.id)}>
                                    <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Pencil className="w-4 h-4 mr-2" /> Editar Empresa
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Branches Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Store className="w-5 h-5 text-indigo-500" /> Sucursales
                            </h3>
                            <Link href={route('branches.create', { company_id: company.id })}>
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Plus className="w-4 h-4 mr-2" /> Nueva Sucursal
                                </Button>
                            </Link>
                        </div>

                        {company.branches.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {company.branches.map((branch) => (
                                    <div
                                        key={branch.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            {/* Future: Branch actions dropdown */}
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                                            {branch.name}
                                        </h4>
                                        {branch.address && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-2">
                                                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                                {branch.address}
                                            </p>
                                        )}
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500">
                                            <span>ID: {branch.id}</span>
                                            {/* Future: Link to branch details */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
                                <div className="bg-gray-50 dark:bg-gray-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Store className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Sin sucursales</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    Esta empresa aún no tiene sucursales registradas.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
