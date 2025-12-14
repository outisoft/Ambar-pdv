import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Building2, Save, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        logo: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
                            Añade una nueva entidad corporativa al sistema.
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
                                                    Seleccionar Archivo
                                                </label>
                                                {preview && (
                                                    <Button variant="ghost" size="sm" type="button" onClick={() => {
                                                        setData('logo', null);
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
                                        <Save className="w-4 h-4 mr-2" /> Guardar Empresa
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
