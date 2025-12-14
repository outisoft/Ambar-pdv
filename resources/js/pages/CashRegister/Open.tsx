import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, LockOpen } from 'lucide-react';

export default function Open({ auth }: any) {
    const { data, setData, post, processing, errors } = useForm({
        initial_amount: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('cash_register.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Abrir Caja" />

            <div className="flex min-h-[80vh] items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                            <LockOpen className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Apertura de Caja</CardTitle>
                        <CardDescription>
                            Ingresa el monto inicial para comenzar el turno.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="initial_amount" className="text-base">
                                    Monto inicial en efectivo
                                </Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="initial_amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.initial_amount}
                                        onChange={(e) => setData('initial_amount', e.target.value)}
                                        className="pl-10 text-lg h-12"
                                        placeholder="0.00"
                                        autoFocus
                                    />
                                </div>
                                {errors.initial_amount && (
                                    <p className="text-sm font-medium text-destructive">
                                        {errors.initial_amount}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 text-lg font-medium"
                            >
                                {processing ? 'Abriendo...' : 'Abrir Caja y Comenzar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
