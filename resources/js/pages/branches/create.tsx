import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Store, Save, ArrowLeft, MapPin, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">

                    {/* Header with Back Button */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                Registrar Nueva Sucursal
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Añade una nueva sucursal a una empresa existente.
                            </p>
                        </div>
                        <Link
                            href={route('branches.index')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Volver
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <form onSubmit={submit} className="divide-y divide-gray-100 dark:divide-gray-700">

                            {/* Section 1: Branch Info */}
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                        <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Datos de la Sucursal</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Información básica y ubicación.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Company Selection */}
                                    <div className="space-y-2">
                                        <Label>Empresa</Label>
                                        <Select
                                            onValueChange={(value) => setData('company_id', value)}
                                            defaultValue={data.company_id}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona una empresa" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((company) => (
                                                    <SelectItem key={company.id} value={company.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="w-4 h-4 text-gray-400" />
                                                            {company.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.company_id && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.company_id}</p>}
                                    </div>

                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label>Nombre de la Sucursal</Label>
                                        <Input
                                            type="text"
                                            placeholder="Ej. Sucursal Centro"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.name}</p>}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <Label>Dirección</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Ej. Av. Principal 123"
                                                className="pl-9"
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                            />
                                        </div>
                                        {errors.address && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.address}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-end gap-4">
                                <Link
                                    href={route('branches.index')}
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
                                            <Save className="w-4 h-4" /> Guardar Sucursal
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
