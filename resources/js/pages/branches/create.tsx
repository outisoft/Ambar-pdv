import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Store, Save, ArrowLeft, MapPin, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

interface Company {
    id: number;
    name: string;
}

interface Props {
    companies: Company[];
    company_id?: string;
}

export default function Create({ companies, company_id }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        company_id: company_id || '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('branches.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Crear Sucursal" />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Registrar Sucursal
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Añade una nueva sede operativa al sistema.
                        </p>
                    </div>
                    <Link href={route('branches.index')}>
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
                                    <Store className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg">Datos de la Sucursal</h2>
                                    <p className="text-sm text-muted-foreground">Información general y ubicación.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Company */}
                                <div className="space-y-2">
                                    <Label>Empresa</Label>
                                    <Select
                                        onValueChange={(value) => setData('company_id', value)}
                                        defaultValue={data.company_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una empresa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={company.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                                        {company.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.company_id && <p className="text-destructive text-sm font-medium mt-1">{errors.company_id}</p>}
                                </div>

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label>Nombre de la Sucursal</Label>
                                    <Input
                                        placeholder="Ej. Sede Central"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-destructive text-sm font-medium mt-1">{errors.name}</p>}
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label>Dirección Física</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder="Calle Principal #123"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                        />
                                    </div>
                                    {errors.address && <p className="text-destructive text-sm font-medium mt-1">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="p-6 bg-muted/20 flex justify-end gap-3">
                            <Link href={route('branches.index')}>
                                <Button variant="ghost">Cancelar</Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90">
                                {processing ? 'Guardando...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> Guardar Sucursal
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
