import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LockKeyhole, DollarSign, Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
    creditSales: number;
    cashIn: number;
    cashOut: number;
    creditPayments: number;
    otherInputs: number;
}

export default function Close({
    auth,
    register,
    systemSales,
    cashSales,
    nonCashSales,
    creditSales,
    cashIn,
    cashOut,
    creditPayments,
    otherInputs,
    expectedTotal,
}: CloseProps) {
    const { data, setData, post, processing, errors } = useForm({
        reported_amount: '', // Lo que cuenta el cajero (coincide con el backend)
    });

    // Cálculos en tiempo real para mostrar diferencias
    const currentFinal = parseFloat(data.reported_amount) || 0;
    const difference = currentFinal - expectedTotal;
    const isNegative = difference < 0;
    const isPerfect = difference === 0 && data.reported_amount !== '';

    const submit = (e: FormEvent) => {
        e.preventDefault();
        // Usamos la ruta que dispara el envío del correo diario
        post(route('cash_register.close_store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Cerrar Caja" />

            <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Cierre de Caja
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Realiza el arqueo y cierra el turno actual.
                        </p>
                    </div>
                    <Badge variant="outline" className="text-base px-3 py-1 h-auto">
                        Abierta el: {format(new Date(register.opened_at), "d MMM yyyy HH:mm", { locale: es })}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* System Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-primary" />
                                Resumen del Sistema
                            </CardTitle>
                            <CardDescription>
                                Ventas registradas automáticamente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Fondo Inicial</span>
                                <span className="font-mono font-medium">${Number(register.initial_amount).toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground text-emerald-600 dark:text-emerald-400 font-medium">
                                    + Ventas en Efectivo
                                </span>
                                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                    ${Number(cashSales).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground text-blue-600 dark:text-blue-400 font-medium">
                                    i Ventas Tarjeta/Otros
                                </span>
                                <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                                    ${Number(nonCashSales).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground text-purple-600 dark:text-purple-400 font-medium">
                                    ↳ Ventas a Crédito
                                </span>
                                <span className="font-mono font-medium text-purple-600 dark:text-purple-400">
                                    ${Number(creditSales || 0).toFixed(2)}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Total Ventas Turno</span>
                                <span>${Number(systemSales).toFixed(2)}</span>
                            </div>

                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">(+) Abonos a crédito</span>
                                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                        ${Number(creditPayments || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">(+) Otras entradas de caja</span>
                                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                        ${Number(otherInputs || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">(-) Salidas de caja / gastos</span>
                                    <span className="font-mono font-medium text-red-600 dark:text-red-400">
                                        ${Number(cashOut || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 rounded-lg bg-muted p-4 border border-primary/20">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Efectivo Esperado en Caja</p>
                                <div className="text-2xl font-bold flex items-baseline gap-1">
                                    <span className="text-sm font-normal text-muted-foreground">$</span>
                                    {Number(expectedTotal).toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 gap-1 flex items-center">
                                    (Fondo Inicial + Ventas Efectivo + Entradas - Salidas)
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Physical Count Form */}
                    <Card className="border-t-4 border-t-primary shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-primary" />
                                Conteo Físico
                            </CardTitle>
                            <CardDescription>
                                Ingresa el dinero real contado en caja.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="final_amount" className="text-base">
                                        ¿Cuánto dinero hay en caja?
                                    </Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                                        <Input
                                            id="final_amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.reported_amount}
                                            onChange={(e) => setData('reported_amount', e.target.value)}
                                            className="pl-12 text-2xl h-14 font-bold tracking-tight text-right"
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.reported_amount && (
                                        <p className="text-sm font-medium text-destructive">
                                            {errors.reported_amount}
                                        </p>
                                    )}
                                </div>

                                {data.reported_amount !== '' && (
                                    <Alert variant={isPerfect ? "default" : (isNegative ? "destructive" : "default")} className={`border-l-4 ${isPerfect ? 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : (isNegative ? 'border-l-red-500 bg-red-50 dark:bg-red-900/10' : 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10')}`}>
                                        {isPerfect ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className={`h-5 w-5 ${isNegative ? 'text-red-600' : 'text-yellow-600'}`} />}
                                        <AlertTitle className={isPerfect ? 'text-emerald-700' : (isNegative ? 'text-red-700' : 'text-yellow-700')}>
                                            {isPerfect ? "Cuadre Perfecto" : "Discrepancia Detectada"}
                                        </AlertTitle>
                                        <AlertDescription className="mt-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm opacity-80">Diferencia:</span>
                                                <span className={`text-2xl font-bold ${isPerfect ? 'text-emerald-700' : (isNegative ? 'text-red-700' : 'text-yellow-700')}`}>
                                                    {difference > 0 ? '+' : ''}{difference.toFixed(2)}
                                                </span>
                                            </div>
                                            {!isPerfect && (
                                                <p className="text-xs opacity-70 mt-1">
                                                    {isNegative ? "Faltante de dinero." : "Sobrante de dinero."} Revisa el conteo.
                                                </p>
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <Link href={route('pos')} className="flex-1">
                                        <Button variant="outline" type="button" className="w-full h-12">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-[2] h-12 text-base"
                                        variant={isPerfect ? "default" : "destructive"} // Highlight risk of closing with diff
                                    >
                                        {processing ? 'Cerrando...' : 'Confirmar Cierre'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
