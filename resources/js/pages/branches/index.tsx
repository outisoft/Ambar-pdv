import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Store, Plus, Pencil, Trash2, MoreHorizontal, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function Index({ branches }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Sucursales" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                Sucursales
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Gestiona las sucursales de tus empresas.
                            </p>
                        </div>
                        <Link href={route('branches.create')}>
                            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all">
                                <Plus className="w-4 h-4 mr-2" /> Nueva Sucursal
                            </Button>
                        </Link>
                    </div>

                    {/* Grid Content */}
                    {branches.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {branches.map((branch) => (
                                <div
                                    key={branch.id}
                                    className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Card Header / Banner Placeholder */}
                                    <div className="h-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center relative">
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 backdrop-blur-sm shadow-sm border border-gray-100 dark:border-gray-700">
                                                <Building2 className="w-3 h-3 mr-1" />
                                                {branch.company.name}
                                            </span>
                                        </div>
                                        <Store className="w-10 h-10 text-blue-300 dark:text-blue-700/50" />
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Link href={route('branches.show', branch.id)} className="block">
                                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {branch.name}
                                                    </h3>
                                                </Link>
                                                {branch.address && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-start gap-1">
                                                        <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                                                        {branch.address}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Actions Dropdown */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('branches.show', branch.id)} className="flex items-center cursor-pointer">
                                                            <Store className="w-4 h-4 mr-2 text-gray-500" /> Ver Detalles
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('branches.edit', branch.id)} className="flex items-center cursor-pointer">
                                                            <Pencil className="w-4 h-4 mr-2 text-blue-500" /> Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route('branches.destroy', branch.id)}
                                                            method="delete"
                                                            as="button"
                                                            className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Footer / Stats (Placeholder for future) */}
                                        <Link href={route('branches.show', branch.id)} className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            <span>ID: {branch.id}</span>
                                            {/* Link to view details if needed */}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            <div className="bg-gray-50 dark:bg-gray-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Store className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No hay sucursales registradas</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                                Comienza registrando la primera sucursal para una de tus empresas.
                            </p>
                            <div className="mt-6">
                                <Link href={route('branches.create')}>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" /> Crear Primera Sucursal
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
