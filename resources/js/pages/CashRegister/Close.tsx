import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface CloseProps {
    auth: any;
    register: {
        id: number;
        initial_amount: number;
        opened_at: string;
    };
    systemSales: number;
    cashSales: number;
    nonCashSales: number;
    expectedTotal: number;
}

export default function Close({
    auth,
    register,
    systemSales,
    cashSales,
    nonCashSales,
    expectedTotal,
}: CloseProps) {
    const { data, setData, post, processing, errors } = useForm({
        final_amount: '', // Lo que cuenta el cajero
    });

    // Cálculos en tiempo real para mostrar diferencias
    const currentFinal = parseFloat(data.final_amount) || 0;
    const difference = currentFinal - expectedTotal;
    const isNegative = difference < 0;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        // Enviamos al método update con el ID de la caja
        post(route('cash_register.update', register.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-900">
                    Cierre de Caja (Arqueo)
                </h2>
            }
        >
            <Head title="Cerrar Caja" />

            <div className="py-12">
                <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
                        <div className="bg-neutral-900 px-6 py-4 text-white">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl leading-none">
                                        🔒
                                    </span>
                                    <div>
                                        <p className="text-xs tracking-wide text-neutral-300 uppercase">
                                            Turno en curso
                                        </p>
                                        <h3 className="text-lg font-semibold">
                                            Arqueo y cierre de caja
                                        </h3>
                                    </div>
                                </div>
                                <div className="ml-auto rounded-full border border-white/20 px-3 py-1 text-xs tracking-wide text-white/80 uppercase">
                                    Abierta el:{' '}
                                    {new Date(
                                        register.opened_at,
                                    ).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={submit}
                            className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_1fr]"
                        >
                            {/* Resumen del sistema */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-700 border-b pb-2">Resumen del Sistema</h3>

                                {/* DESGLOSE DETALLADO */}
                                <div className="space-y-2 text-sm border-b pb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Fondo Inicial:</span>
                                        <span className="font-mono">${Number(register.initial_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-green-700 bg-green-50 p-1 rounded">
                                        <span>(+) Ventas Efectivo:</span>
                                        <span className="font-mono font-bold">${Number(cashSales).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-blue-600">
                                        <span>(i) Ventas Tarjeta/Otros:</span>
                                        <span className="font-mono">${Number(nonCashSales).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold pt-2">
                                        <span>(=) Total Ventas Turno:</span>
                                        <span>${Number(systemSales).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* TOTAL ESPERADO (Solo Efectivo) */}
                                <div className="border-t pt-4 flex justify-between items-center bg-yellow-50 p-4 rounded border border-yellow-200">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 text-lg">Efectivo Esperado:</span>
                                        <span className="text-xs text-gray-500">(Fondo + Ventas Efectivo)</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900">${Number(expectedTotal).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Conteo físico */}
                            <section className="space-y-6 rounded-2xl border border-neutral-200 p-6">
                                <header className="border-b border-neutral-200 pb-3">
                                    <h4 className="text-sm font-semibold tracking-wide text-neutral-600 uppercase">
                                        Conteo físico
                                    </h4>
                                    <p className="mt-1 text-xs text-neutral-500">
                                        Registra el efectivo real para validar
                                        la diferencia.
                                    </p>
                                </header>

                                <div>
                                    <label
                                        className="mb-2 block text-sm font-medium text-neutral-600"
                                        htmlFor="final_amount"
                                    >
                                        ¿Cuánto dinero hay en caja?
                                    </label>
                                    <input
                                        id="final_amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full rounded-xl border border-neutral-300 bg-white py-3 text-right text-2xl font-semibold tracking-tight text-neutral-900 shadow-sm focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/20 focus:outline-none"
                                        placeholder="0.00"
                                        value={data.final_amount}
                                        onChange={(e) =>
                                            setData(
                                                'final_amount',
                                                e.target.value,
                                            )
                                        }
                                        autoFocus
                                    />
                                    {errors.final_amount && (
                                        <p className="mt-2 text-xs font-medium text-rose-600">
                                            {errors.final_amount}
                                        </p>
                                    )}
                                </div>

                                {data.final_amount !== '' && (
                                    <div
                                        className={`rounded-2xl border p-4 text-center ${isNegative
                                                ? 'border-rose-200 bg-rose-50'
                                                : 'border-emerald-200 bg-emerald-50'
                                            }`}
                                    >
                                        <p className="text-xs font-medium tracking-wide text-neutral-600 uppercase">
                                            Diferencia vs sistema
                                        </p>
                                        <p
                                            className={`text-3xl font-bold ${isNegative
                                                    ? 'text-rose-600'
                                                    : 'text-emerald-600'
                                                }`}
                                        >
                                            {difference > 0 ? '+' : ''}
                                            {difference.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {difference === 0
                                                ? 'Caja cuadrada perfectamente'
                                                : isNegative
                                                    ? 'Faltante detectado'
                                                    : 'Sobrante detectado'}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Link
                                        href={route('pos')}
                                        className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-center text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-[1.5] rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {processing
                                            ? 'Cerrando...'
                                            : 'Cerrar turno'}
                                    </button>
                                </div>
                            </section>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
