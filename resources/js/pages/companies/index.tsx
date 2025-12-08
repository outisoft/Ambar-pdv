import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Building2, Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
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
    logo_path: string | null;
}

interface Props {
    companies: Company[];
}

export default function Index({ companies }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Empresas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                Empresas
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Gestiona las empresas registradas en el sistema.
                            </p>
                        </div>
                        <Link href={route('companies.create')}>
                            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all">
                                <Plus className="w-4 h-4 mr-2" /> Nueva Empresa
                            </Button>
                        </Link>
                    </div>

                    {/* Grid Content */}
                    {companies.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {companies.map((company) => (
                                <div
                                    key={company.id}
                                    className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Card Header / Banner Placeholder */}
                                    <div className="h-24 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 flex items-center justify-center">
                                        {company.logo_path ? (
                                            <img
                                                src={`/storage/${company.logo_path}`}
                                                alt={company.name}
                                                className="h-16 w-16 object-contain rounded-lg bg-white dark:bg-gray-800 p-1 shadow-sm"
                                            />
                                        ) : (
                                            <Building2 className="w-10 h-10 text-indigo-300 dark:text-indigo-700/50" />
                                        )}
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Link href={route('companies.show', company.id)} className="block">
                                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {company.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    ID: {company.id}
                                                </p>
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
                                                        <Link href={route('companies.show', company.id)} className="flex items-center cursor-pointer">
                                                            <Building2 className="w-4 h-4 mr-2 text-gray-500" /> Ver Detalles
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('companies.edit', company.id)} className="flex items-center cursor-pointer">
                                                            <Pencil className="w-4 h-4 mr-2 text-blue-500" /> Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route('companies.destroy', company.id)}
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
                                        <Link href={route('companies.show', company.id)} className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                            <span>Ver detalles</span>
                                            <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            <div className="bg-gray-50 dark:bg-gray-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No hay empresas registradas</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function ArrowRightIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
