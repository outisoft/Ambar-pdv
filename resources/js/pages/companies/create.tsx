import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Plan {
    id: number;
    name: string;
    price: number;
    duration_in_days: number;
}

interface Props {
    plans: Plan[];
}

export default function Create({ plans }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        admin_name: '',
        admin_email: '',
        password: '',
        plan_id: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('companies.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Crear Empresa" />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Registrar Empresa
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Crea una nueva empresa, asigna un plan y el administrador.
                        </p>
                    </div>
                    <Link href={route('companies.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                        </Button>
                    </Link>
                </div>

                <div className="max-w-3xl mx-auto w-full">
                    <form onSubmit={submit} className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-6 space-y-8">
                            {/* Datos de la Empresa */}
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-lg">Datos de la Empresa</h2>
                                        <p className="text-sm text-muted-foreground">Información básica del negocio.</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Nombre del Negocio</Label>
                                    <Input
                                        placeholder="Ej. Mi Empresa S.A."
                                        value={data.company_name}
                                        onChange={e => setData('company_name', e.target.value)}
                                    />
                                    {errors.company_name && (
                                        <p className="text-destructive text-sm font-medium mt-1">{errors.company_name}</p>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Selección de Plan */}
                            <div>
                                <h2 className="font-semibold text-lg mb-1">Plan de Suscripción</h2>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Elige el plan que mejor se adapte al cliente.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {plans.map(plan => (
                                        <label
                                            key={plan.id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-colors text-sm bg-background hover:bg-muted/60 ${
                                                String(data.plan_id) === String(plan.id)
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border'
                                            }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <input
                                                    type="radio"
                                                    name="plan"
                                                    value={plan.id}
                                                    className="mt-1"
                                                    onChange={e => setData('plan_id', e.target.value)}
                                                />
                                                <div>
                                                    <div className="font-semibold text-foreground">{plan.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        ${plan.price} / {plan.duration_in_days} días
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.plan_id && (
                                    <p className="text-destructive text-sm font-medium mt-2">{errors.plan_id}</p>
                                )}
                            </div>

                            <Separator />

                            {/* Datos del Administrador */}
                            <div>
                                <h2 className="font-semibold text-lg mb-1">Datos del Administrador</h2>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Este usuario será el dueño/gerente inicial de la empresa.</p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Nombre Completo</Label>
                                        <Input
                                            placeholder="Nombre del administrador"
                                            value={data.admin_name}
                                            onChange={e => setData('admin_name', e.target.value)}
                                        />
                                        {errors.admin_name && (
                                            <p className="text-destructive text-sm font-medium mt-1">{errors.admin_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Correo Electrónico (Login)</Label>
                                        <Input
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            value={data.admin_email}
                                            onChange={e => setData('admin_email', e.target.value)}
                                        />
                                        {errors.admin_email && (
                                            <p className="text-destructive text-sm font-medium mt-1">{errors.admin_email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Contraseña Temporal</Label>
                                        <Input
                                            type="text"
                                            placeholder="Mínimo 8 caracteres"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                        />
                                        {errors.password && (
                                            <p className="text-destructive text-sm font-medium mt-1">{errors.password}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="p-6 bg-muted/20 flex justify-end gap-3">
                            <Link href={route('companies.index')}>
                                <Button variant="ghost">Cancelar</Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">
                                {processing ? 'Guardando...' : 'Registrar Empresa y Enviar Accesos'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
