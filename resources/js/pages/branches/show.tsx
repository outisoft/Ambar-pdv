import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Store, Building2, ArrowLeft, Pencil, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Header / Branch Details */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                {/* Icon */}
                                <div className="h-24 w-24 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center shrink-0">
                                    <Store className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                                </div>

                                {/* Info */}
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                        {branch.name}
                                    </h2>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                ID: {branch.id}
                                            </span>
                                        </p>
                                        {branch.address && (
                                            <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {branch.address}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <Link href={route('branches.index')}>
                                    <Button variant="outline" className="w-full md:w-auto">
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                                    </Button>
                                </Link>
                                <Link href={route('branches.edit', branch.id)}>
                                    <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Pencil className="w-4 h-4 mr-2" /> Editar Sucursal
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Company Section */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
                            <Building2 className="w-5 h-5 text-indigo-500" /> Empresa Asociada
                        </h3>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow max-w-md">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                                    {branch.company.logo_path ? (
                                        <img
                                            src={`/storage/${branch.company.logo_path}`}
                                            alt={branch.company.name}
                                            className="h-full w-full object-contain p-1"
                                        />
                                    ) : (
                                        <Building2 className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {branch.company.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        ID Empresa: {branch.company.id}
                                    </p>
                                </div>
                                <Link href={route('companies.show', branch.company.id)}>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                        <ExternalLink className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
