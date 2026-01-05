import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Building2, Save, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Company {
    id: number;
    name: string;
    logo_path: string | null;
    phone?: string | null;
    tax_id?: string | null;
    address?: string | null;
    ticket_footer_message?: string | null;
}

interface Plan {
    id: number;
    name: string;
    price: number;
    duration_in_days: number;
}

interface Props {
    company: Company & { plan_id?: number | null };
    plans: Plan[];
}

export default function Edit({ company, plans }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put', // Required for file uploads with PUT in Laravel/Inertia
        name: company.name,
        logo: null as File | null,
        plan_id: company.plan_id ? String(company.plan_id) : '',
        phone: company.phone || '',
        tax_id: company.tax_id || '',
        address: company.address || '',
        ticket_footer_message: company.ticket_footer_message || '',
        remove_logo: false,
    });

    const [preview, setPreview] = useState<string | null>(
        company.logo_path ? `/storage/${company.logo_path}` : null
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setData('remove_logo', false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        // Use post because we are sending a file, but _method: 'put' tells Laravel it's a PUT request
        post(route('companies.update', company.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editar Empresa" />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Editar Empresa
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Actualiza los detalles de la empresa #{company.id}.
                        </p>
                    </div>
                    <Link href={route('companies.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                        </Button>
                    </Link>
                </div>

                <div className="max-w-2xl mx-auto w-full">
                    <form onSubmit={submit} className="bg-card text-card-foreground rounded-xl border shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg">Datos de la Empresa</h2>
                                    <p className="text-sm text-muted-foreground">Información legal e identidad.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label>Nombre de la Empresa</Label>
                                    <Input
                                        placeholder="Ej. Mi Empresa S.A."
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-destructive text-sm font-medium mt-1">{errors.name}</p>}
                                </div>

                                {/* Contact & tax info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Teléfono</Label>
                                        <Input
                                            placeholder="Ej. 555-1234"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                        />
                                        {errors.phone && (
                                            <p className="text-destructive text-sm font-medium mt-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>RFC / NIT / RUT</Label>
                                        <Input
                                            placeholder="Identificación fiscal"
                                            value={data.tax_id}
                                            onChange={e => setData('tax_id', e.target.value)}
                                        />
                                        {errors.tax_id && (
                                            <p className="text-destructive text-sm font-medium mt-1">{errors.tax_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Dirección</Label>
                                    <textarea
                                        className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        rows={3}
                                        placeholder="Calle Principal #123, Ciudad"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                    />
                                    {errors.address && (
                                        <p className="text-destructive text-sm font-medium mt-1">{errors.address}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Mensaje en pie de ticket</Label>
                                    <textarea
                                        className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        rows={2}
                                        placeholder="Ej. Gracias por su compra"
                                        value={data.ticket_footer_message}
                                        onChange={e => setData('ticket_footer_message', e.target.value)}
                                    />
                                    {errors.ticket_footer_message && (
                                        <p className="text-destructive text-sm font-medium mt-1">{errors.ticket_footer_message}</p>
                                    )}
                                </div>

                                {/* Plan de suscripción */}
                                <div className="space-y-2">
                                    <Label>Plan de Suscripción</Label>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Cambia el plan asignado a esta empresa.
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {plans.map((plan) => (
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
                                                        name="plan_id"
                                                        value={plan.id}
                                                        checked={String(data.plan_id) === String(plan.id)}
                                                        onChange={(e) => setData('plan_id', e.target.value)}
                                                        className="mt-1"
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
                                        <p className="text-destructive text-sm font-medium mt-1">{errors.plan_id}</p>
                                    )}
                                </div>

                                {/* Logo Upload */}
                                <div className="space-y-2">
                                    <Label>Logotipo Corporativo</Label>
                                    <div className="flex items-start gap-6 p-4 border rounded-lg bg-muted/20">
                                        {/* Preview */}
                                        <div className="shrink-0">
                                            <div className="h-24 w-24 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-background overflow-hidden relative">
                                                {preview ? (
                                                    <img src={preview} alt="Logo preview" className="h-full w-full object-contain" />
                                                ) : (
                                                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Input */}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <label
                                                    htmlFor="logo-upload"
                                                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
                                                >
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Cambiar Imagen
                                                </label>
                                                {preview && (
                                                    <Button variant="ghost" size="sm" type="button" onClick={() => {
                                                        setData('logo', null);
                                                        setData('remove_logo', true);
                                                        setPreview(null);
                                                    }}>
                                                        Quitar
                                                    </Button>
                                                )}
                                            </div>
                                            <input
                                                id="logo-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Formato PNG, JPG o SVG. Máximo 2MB. Se recomienda fondo transparente.
                                            </p>
                                            {errors.logo && <p className="text-destructive text-sm font-medium mt-1">{errors.logo}</p>}
                                        </div>
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
                                {processing ? 'Guardando...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> Actualizar Empresa
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
