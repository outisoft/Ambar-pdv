
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { User, Lock, Shield, Building2, Store, Save, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function Create({ auth, branches, roles, companies }: any) {

    // Detectar si es super admin para mostrar selector de empresa
    const isSuperAdmin = auth.user.roles.includes('super-admin');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        branch_id: '',
        company_id: '', // Solo usado por super admin
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Crear Usuario" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">

                    {/* Header with Back Button */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                Crear Nuevo Usuario
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Completa la información para registrar un nuevo miembro del equipo.
                            </p>
                        </div>
                        <Link
                            href={route('users.index')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Volver
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <form onSubmit={submit} className="divide-y divide-gray-100 dark:divide-gray-700">

                            {/* Section 1: Account Info */}
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                        <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Información de Cuenta</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Datos básicos del usuario.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Nombre Completo</Label>
                                        <Input
                                            type="text"
                                            placeholder="Ej. Juan Pérez"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Correo Electrónico</Label>
                                        <Input
                                            type="email"
                                            placeholder="ejemplo@correo.com"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.email}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Security */}
                            <div className="p-8 space-y-6 bg-gray-50/50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                                        <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Seguridad</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Establece una contraseña segura.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Contraseña</Label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                        />
                                        {errors.password && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.password}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirmar Contraseña</Label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Roles & Access */}
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                                        <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Roles y Permisos</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Define el nivel de acceso del usuario.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* SELECTOR EMPRESA (Solo Super Admin) */}
                                    {isSuperAdmin && (
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" /> Empresa (Tenant)
                                            </Label>
                                            <Select value={data.company_id} onValueChange={val => setData('company_id', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una empresa..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {companies.map((c: any) => (
                                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.company_id && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.company_id}</p>}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-gray-400" /> Rol de Usuario
                                            </Label>
                                            <Select value={data.role} onValueChange={val => setData('role', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona rol..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((r: any) => (
                                                        <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.role && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.role}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Store className="w-4 h-4 text-gray-400" /> Sucursal Asignada
                                            </Label>
                                            <Select value={data.branch_id} onValueChange={val => setData('branch_id', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="-- Ninguna (Global/Admin) --" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">-- Ninguna (Global/Admin) --</SelectItem> {/* Value 0 or empty string handling might need adjustment depending on backend */}
                                                    {branches.map((b: any) => (
                                                        <SelectItem key={b.id} value={String(b.id)}>
                                                            {b.name} {isSuperAdmin ? `(${b.company?.name})` : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.branch_id && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.branch_id}</p>}
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Requerido para roles operativos como 'Cajero'.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-end gap-4">
                                <Link
                                    href={route('users.index')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Guardando...' : (
                                        <>
                                            <Save className="w-4 h-4" /> Guardar Usuario
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}