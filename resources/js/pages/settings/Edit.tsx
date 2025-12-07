import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState, useRef } from 'react';
import { Camera, Save, Store, MapPin, Phone, FileText, Upload } from 'lucide-react';

export default function Edit({ auth, setting, logoUrl }: any) {
    const { data, setData, post, processing, errors } = useForm({
        shop_name: setting.shop_name,
        address: setting.address || '',
        phone: setting.phone || '',
        tax_id: setting.tax_id || '',
        logo: null as File | null,
    });

    const [preview, setPreview] = useState(logoUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('configuracion.update'));
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
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Configuración</h2>}
        >
            <Head title="Configuración" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-200">
                        <div className="p-8">
                            <div className="mb-8 border-b border-gray-100 pb-4">
                                <h3 className="text-lg font-medium text-gray-900">Perfil del Negocio</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Actualiza la información de tu tienda y la imagen de marca.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-8">

                                {/* Logo Section */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                                            {preview ? (
                                                <img src={preview} alt="Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <Store className="w-12 h-12 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <h4 className="text-sm font-medium text-gray-900">Logotipo</h4>
                                        <p className="text-xs text-gray-500 mt-1 mb-3">
                                            JPG, PNG o GIF. Máximo 1MB.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={triggerFileInput}
                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Subir Imagen
                                        </button>
                                        {errors.logo && <p className="text-red-600 text-xs mt-2">{errors.logo}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Shop Name */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Store className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5"
                                                placeholder="Ej. Mi Tienda"
                                                value={data.shop_name}
                                                onChange={(e) => setData('shop_name', e.target.value)}
                                            />
                                        </div>
                                        {errors.shop_name && <p className="text-red-600 text-xs mt-1">{errors.shop_name}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5"
                                                placeholder="Ej. 555-1234"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Tax ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">RFC / NIT / RUT</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5"
                                                placeholder="Identificación Fiscal"
                                                value={data.tax_id}
                                                onChange={(e) => setData('tax_id', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <textarea
                                                className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:border-black focus:ring-black sm:text-sm"
                                                rows={3}
                                                placeholder="Calle Principal #123, Ciudad"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-3 bg-black border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-800 focus:bg-gray-800 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}