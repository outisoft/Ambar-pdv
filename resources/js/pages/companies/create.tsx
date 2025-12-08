import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Building2, Save, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">

                    {/* Header with Back Button */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                Registrar Nueva Empresa
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Añade una nueva empresa al sistema.
                            </p>
                        </div>
                        <Link
                            href={route('companies.index')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Volver
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <form onSubmit={submit} className="divide-y divide-gray-100 dark:divide-gray-700">

                            {/* Section 1: Company Info */}
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                        <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Datos de la Empresa</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Información básica e identidad visual.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Nombre de la Empresa</Label>
                                        <Input
                                            type="text"
                                            placeholder="Ej. Mi Empresa S.A."
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Logotipo (Opcional)</Label>
                                        <div className="flex items-center gap-6">
                                            {/* Preview Circle */}
                                            <div className="shrink-0">
                                                <div className="h-24 w-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
                                                    {preview ? (
                                                        <img src={preview} alt="Logo preview" className="h-full w-full object-contain" />
                                                    ) : (
                                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Upload Button */}
                                            <div className="flex-1">
                                                <label
                                                    htmlFor="logo-upload"
                                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Seleccionar Imagen
                                                </label>
                                                <input
                                                    id="logo-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                    PNG, JPG o SVG. Máximo 2MB.
                                                </p>
                                                {errors.logo && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">⚠️ {errors.logo}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-end gap-4">
                                <Link
                                    href={route('companies.index')}
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
                                            <Save className="w-4 h-4" /> Guardar Empresa
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
