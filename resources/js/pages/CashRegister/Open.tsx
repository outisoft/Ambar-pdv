import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Open({ auth }: any) {
    const { data, setData, post, processing, errors } = useForm({
        initial_amount: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('cash_register.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-900">
                    Apertura de Caja
                </h2>
            }
        >
            <Head title="Abrir Caja" />

            <div className="py-12">
                <div className="mx-auto w-full max-w-lg px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
                        <div className="bg-neutral-900 px-6 py-4 text-white">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl leading-none">
                                    🔓
                                </span>
                                <div>
                                    <p className="text-sm tracking-wide text-neutral-300 uppercase">
                                        Iniciar turno
                                    </p>
                                    <h3 className="text-lg font-semibold">
                                        Apertura de caja
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-8">
                            <p className="mb-6 text-sm text-neutral-500">
                                Ingresa el monto inicial en efectivo para
                                registrar la apertura de la caja y comenzar el
                                turno.
                            </p>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="initial_amount"
                                        className="mb-2 block text-sm font-medium text-neutral-700"
                                    >
                                        Monto inicial ($)
                                    </label>
                                    <input
                                        id="initial_amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.initial_amount}
                                        onChange={(e) =>
                                            setData(
                                                'initial_amount',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-neutral-300 bg-white py-3 text-center text-xl text-neutral-900 shadow-sm transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/20 focus:outline-none"
                                        placeholder="0.00"
                                        autoFocus
                                    />
                                    {errors.initial_amount && (
                                        <p className="mt-2 text-xs font-medium text-rose-600">
                                            {errors.initial_amount}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing
                                        ? 'Abriendo...'
                                        : 'Abrir caja y comenzar'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
