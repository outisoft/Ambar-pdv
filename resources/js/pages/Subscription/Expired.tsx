import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, CreditCard, LogOut, MessageCircle } from 'lucide-react';

export default function Expired({ auth }: any) {
    const { post } = useForm();

    const endDate = auth?.user?.company?.subscription_ends_at
        ? new Date(auth.user.company.subscription_ends_at).toLocaleDateString('es-MX')
        : '';

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4">
            <Head title="Suscripción Vencida" />

            <div className="relative max-w-md w-full text-center bg-card text-card-foreground rounded-2xl border shadow-lg shadow-primary/10 px-6 py-8 sm:px-8 sm:py-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10 pointer-events-none" />

                <div className="relative inline-flex items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2 mb-4">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="text-xs font-semibold tracking-wide uppercase">Suscripción vencida</span>
                </div>

                <h1 className="relative text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
                    Tu plan ha expirado
                </h1>

                <p className="relative text-sm sm:text-base text-muted-foreground mb-4">
                    Hola <span className="font-semibold text-foreground">{auth.user.name}</span>, el servicio para{' '}
                    <span className="font-semibold text-foreground">{auth.user.company.name}</span> venció el día{' '}
                    <span className="font-semibold text-foreground">{endDate}</span>.
                </p>

                <p className="relative text-xs sm:text-sm text-muted-foreground mb-6">
                    Para recuperar el acceso a tu información y seguir vendiendo, por favor realiza la renovación de tu plan.
                </p>

                <div className="relative bg-amber-50 text-amber-900 border border-amber-200/70 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-500/40 px-4 py-3 rounded-xl text-xs sm:text-sm mb-6 text-left">
                    <p className="font-semibold mb-1">¿Qué significa esto?</p>
                    <p>
                        Tu cuenta sigue segura, pero mientras la suscripción esté vencida no podrás operar el punto de venta.
                        Una vez renovado el plan, recuperarás el acceso completo.
                    </p>
                </div>

                <div className="relative space-y-3">
                    <button
                        type="button"
                        disabled
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary/80 text-primary-foreground text-sm font-medium py-2.5 shadow-md shadow-primary/30 cursor-not-allowed opacity-80"
                    >
                        <CreditCard className="w-4 h-4" />
                        Pagar renovación online (Próximamente)
                    </button>

                    <a
                        href="https://wa.me/529841786031?text=Hola, quiero renovar mi plan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 shadow-md shadow-emerald-500/30 transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Contactar a soporte (WhatsApp)
                    </a>
                </div>

                <div className="relative mt-8 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span className="hidden sm:inline">Estás autenticado como {auth.user.email}</span>
                    <button
                        type="button"
                        onClick={() => post(route('logout'))}
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                        <LogOut className="w-3 h-3" />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}