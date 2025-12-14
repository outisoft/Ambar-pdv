import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { User, Shield, Building2, Store, Save, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Edit({ auth, userToEdit, branches, roles, companies }: any) {

    // Detectar si es super admin para mostrar selector de empresa
    const isSuperAdmin = auth.user.roles.includes('super-admin');

    const { data, setData, put, processing, errors } = useForm({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        role: userToEdit.roles[0]?.name || '',
        branch_id: userToEdit.branch_id ? String(userToEdit.branch_id) : '',
        company_id: userToEdit.company_id ? String(userToEdit.company_id) : '', // Solo usado por super admin
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('users.update', userToEdit.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editar Usuario" />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Editar Usuario
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Actualiza la información de {userToEdit.name}.
                        </p>
                    </div>
                    <Link href={route('users.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                        </Button>
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto w-full">
                    <form onSubmit={submit} className="bg-card text-card-foreground rounded-xl border shadow-sm">

                        {/* Section 1: Account Info */}
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg">Información de Cuenta</h2>
                                    <p className="text-sm text-muted-foreground">Datos básicos del usuario.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Nombre Completo</Label>
                                    <Input
                                        placeholder="Ej. Juan Pérez"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-destructive text-sm font-medium mt-1">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Correo Electrónico</Label>
                                    <Input
                                        type="email"
                                        placeholder="ejemplo@correo.com"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-destructive text-sm font-medium mt-1">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Section 2: Roles & Access */}
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg">Roles y Permisos</h2>
                                    <p className="text-sm text-muted-foreground">Define el nivel de acceso.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* SELECTOR EMPRESA (Solo Super Admin) */}
                                {isSuperAdmin && (
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-muted-foreground" /> Empresa (Tenant)
                                        </Label>
                                        <Select value={data.company_id} onValueChange={val => setData('company_id', val)} disabled={!isSuperAdmin}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una empresa..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((c: any) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.company_id && <p className="text-destructive text-sm font-medium mt-1">{errors.company_id}</p>}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-muted-foreground" /> Rol de Usuario
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
                                        {errors.role && <p className="text-destructive text-sm font-medium mt-1">{errors.role}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Store className="w-4 h-4 text-muted-foreground" /> Sucursal Asignada
                                        </Label>
                                        <Select value={data.branch_id} onValueChange={val => setData('branch_id', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="-- Ninguna (Global/Admin) --" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">-- Ninguna (Global/Admin) --</SelectItem>
                                                {branches.map((b: any) => (
                                                    <SelectItem key={b.id} value={String(b.id)}>
                                                        {b.name} {isSuperAdmin ? `(${b.company?.name})` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.branch_id && <p className="text-destructive text-sm font-medium mt-1">{errors.branch_id}</p>}
                                        <p className="text-xs text-muted-foreground">Requerido para roles operativos como 'Cajero'.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="p-6 bg-muted/20 flex justify-end gap-3">
                            <Link href={route('users.index')}>
                                <Button variant="ghost">Cancelar</Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">
                                {processing ? 'Guardando...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> Actualizar Usuario
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
