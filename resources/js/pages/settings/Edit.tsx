import { Head, useForm, Link } from '@inertiajs/react'; // Added Link just in case, though might not be used
import { FormEvent, useRef, useState } from 'react';
import { Camera, Upload, Save } from 'lucide-react'; // Keeping Camera/Upload for the logo part
import { Transition } from '@headlessui/react';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { edit as editBranches } from '@/routes/configuracion';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración',
        href: editBranches().url,
    },
];

export default function Edit({ auth, company, logoUrl }: any) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: company.name || '',
        address: company.address || '',
        phone: company.phone || '',
        tax_id: company.tax_id || '',
        ticket_footer_message: company.ticket_footer_message || '',
        logo: null as File | null,
    });

    const [preview, setPreview] = useState(logoUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isManager = Array.isArray(auth?.user?.roles)
        ? auth.user.roles.includes('gerente')
        : false;

    const formattedEndDate = company?.subscription_ends_at
        ? new Date(company.subscription_ends_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null;

    const submit = (e: any) => {
        e.preventDefault();
        post(route('configuracion.update'), {
            preserveScroll: true,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('logo', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Perfil del Negocio"
                        description="Actualiza la información de tu tienda y la imagen de marca."
                    />

                    {isManager && (
                        <div className="rounded-xl border bg-card/60 p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Plan de suscripción
                                </p>
                                <p className="text-sm font-semibold text-foreground mt-1">
                                    {company?.plan?.name ?? 'Sin plan asignado'}
                                </p>
                                {company?.subscription_status && (
                                    <p className="text-xs mt-1 text-muted-foreground">
                                        Estado: <span className="font-medium text-foreground">{company.subscription_status}</span>
                                    </p>
                                )}
                            </div>

                            {formattedEndDate && (
                                <div className="text-sm text-muted-foreground text-right md:text-left">
                                    <p className="text-xs">Fecha de vencimiento</p>
                                    <p className="font-medium text-foreground">{formattedEndDate}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Logo Section */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border flex items-center justify-center bg-gray-50">
                                    {preview ? (
                                        <img src={preview} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="w-8 h-8 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <div className="flex-1 text-center sm:text-left space-y-2">
                                <Label>Logotipo</Label>
                                <p className="text-sm text-muted-foreground">
                                    JPG, PNG o GIF. Máximo 1MB.
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={triggerFileInput}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Subir Imagen
                                </Button>
                                <InputError message={errors.logo} />
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {/* Shop Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="shop_name">Nombre del Negocio</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej. Mi Tienda"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Phone */}
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        className="mt-1 block w-full"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Ej. 555-1234"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                {/* Tax ID */}
                                <div className="grid gap-2">
                                    <Label htmlFor="tax_id">RFC / NIT / RUT</Label>
                                    <Input
                                        id="tax_id"
                                        className="mt-1 block w-full"
                                        value={data.tax_id}
                                        onChange={(e) => setData('tax_id', e.target.value)}
                                        placeholder="Identificación Fiscal"
                                    />
                                    <InputError message={errors.tax_id} />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="grid gap-2">
                                <Label htmlFor="address">Dirección</Label>
                                <textarea
                                    id="address"
                                    className={cn(
                                        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-h-[80px] w-full min-w-0 rounded-lg border bg-white dark:bg-gray-900 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                                    )}
                                    rows={3}
                                    placeholder="Calle Principal #123, Ciudad"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                <InputError message={errors.address} />
                            </div>

                            {/* Ticket footer message */}
                            <div className="grid gap-2">
                                <Label htmlFor="ticket_footer_message">Mensaje en pie de ticket</Label>
                                <textarea
                                    id="ticket_footer_message"
                                    className={cn(
                                        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-h-[60px] w-full min-w-0 rounded-lg border bg-white dark:bg-gray-900 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                                    )}
                                    rows={2}
                                    placeholder="Ej. Gracias por su compra"
                                    value={data.ticket_footer_message}
                                    onChange={(e) => setData('ticket_footer_message', e.target.value)}
                                />
                                <InputError message={errors.ticket_footer_message} />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Cambios
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Guardado
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

// End of file