import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForcePasswordChange() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.force_update'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Actualiza tu contraseña"
            description="Por seguridad, debes cambiar tu contraseña temporal antes de continuar."
        >
            <Head title="Actualizar contraseña" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span className="font-semibold">Acción requerida:</span>{' '}
                    Debes actualizar tu contraseña para continuar usando el sistema.
                </div>

                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Nueva contraseña</Label>

                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            required
                            autoFocus
                            autoComplete="new-password"
                            placeholder="Escribe tu nueva contraseña"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirmar nueva contraseña
                        </Label>

                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            required
                            autoComplete="new-password"
                            placeholder="Vuelve a escribir la contraseña"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />

                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full bg-[#FF750F] hover:bg-[#e0660d] text-white font-bold transition-all shadow-md hover:shadow-lg focus-visible:ring-[#FF750F]"
                        disabled={processing}
                    >
                        {processing && <Spinner className="mr-2" />}
                        Actualizar y entrar
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}