// resources/js/Pages/Users/Index.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, User } from '@/types';
import { Plus, Pencil, Trash2, Shield, Building2, Store } from 'lucide-react';

// Extendemos el tipo User para incluir las relaciones que vienen del backend
interface UserWithRelations extends User {
    roles: { name: string }[];
    branch?: { name: string };
    company?: { name: string };
}

interface Props extends PageProps {
    users: {
        data: UserWithRelations[];
        links: any[];
    };
}

export default function Index({ auth, users }: Props) {

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
            router.delete(route('users.destroy', id));
        }
    };

    const getRoleBadgeColor = (roleName: string) => {
        switch (roleName) {
            case 'super-admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'gerente': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cajero': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Usuarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                Gestión de Usuarios
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Administra los accesos y roles del personal.
                            </p>
                        </div>
                        <Link
                            href={route('users.create')}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Nuevo Usuario</span>
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl border border-gray-200 dark:border-gray-700">

                        {/* Mobile View (Cards) */}
                        <div className="grid gap-4 p-4 sm:hidden">
                            {users.data.map((user) => (
                                <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{user.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(user.roles[0]?.name || '')}`}>
                                            {user.roles[0]?.name || 'Sin rol'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                                        {user.branch && (
                                            <div className="flex items-center gap-2">
                                                <Store className="w-4 h-4 text-gray-400" />
                                                <span>{user.branch.name}</span>
                                            </div>
                                        )}
                                        {auth.user.roles.includes('super-admin') && user.company && (
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <span>{user.company.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2 mt-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                                        <Link
                                            href={route('users.edit', user.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" /> Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View (Table) */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                                        {auth.user.roles.includes('super-admin') && (
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Empresa</th>
                                        )}
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sucursal</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                No se encontraron usuarios registrados.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{user.name}</div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRoleBadgeColor(user.roles[0]?.name || '')}`}>
                                                        <Shield className="w-3 h-3 mr-1" />
                                                        {user.roles[0]?.name || 'Sin rol'}
                                                    </span>
                                                </td>

                                                {auth.user.roles.includes('super-admin') && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {user.company ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                                {user.company.name}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 italic">---</span>
                                                        )}
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {user.branch ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Store className="w-4 h-4 text-gray-400" />
                                                            {user.branch.name}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Global / Ninguna</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-3">
                                                        <Link
                                                            href={route('users.edit', user.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Pencil className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}