import { Head, Link } from '@inertiajs/react';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';

export default function TermsShow() {
    const today = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <AuthSimpleLayout
            title="Términos y condiciones"
            description="Lee cuidadosamente las condiciones de uso de Ambar TPV."
        >
            <Head title="Términos y Condiciones" />

            <div className="space-y-6 mx-auto w-full max-w-[100%] md:max-w-[800px] rounded-xl md:rounded-2xl border border-gray-200/80 dark:border-[#3E3E3A] bg-white dark:bg-[#0a0a0a] px-5 py-6 md:px-10 md:py-10 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Términos y condiciones de uso</h1>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Última actualización: {today}
                        </p>
                    </div>
                    <Link
                        href={route('login')}
                        className="text-xs font-medium text-muted-foreground hover:text-[#FF750F] transition-colors"
                    >
                        &larr; Volver al inicio de sesión
                    </Link>
                </div>

                <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
                    <p>
                        Bienvenido a <span className="font-semibold">Ambar TPV</span>. Al acceder y utilizar
                        nuestro software de Punto de Venta en la Nube (en adelante, el "Servicio"), usted acepta
                        estar legalmente vinculado por los siguientes términos.
                    </p>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">
                            1. Descripción del servicio
                        </h2>
                        <p>
                            El servicio se entrega "tal cual" bajo modelo SaaS para la administración de comercios.
                            Requiere conexión a internet activa para su funcionamiento.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">
                            2. Cuentas y seguridad
                        </h2>
                        <p>
                            Usted es responsable de mantener la confidencialidad de sus credenciales. El sistema
                            fuerza el cambio de contraseña en el primer inicio por su seguridad. No nos hacemos
                            responsables por daños derivados del robo de credenciales por descuido del usuario.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">
                            3. Suscripción y pagos
                        </h2>
                        <p>
                            El acceso está condicionado al pago de una suscripción. Si su fecha de corte expira, el
                            sistema bloqueará automáticamente el acceso a las funciones operativas hasta la
                            renovación. Los pagos realizados no son reembolsables.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">
                            4. Propiedad de datos
                        </h2>
                        <p>
                            El software es propiedad de <span className="font-semibold">Outisoft</span>. Sin embargo, los datos ingresados (clientes, ventas, productos) son propiedad exclusiva del
                            Cliente. Garantizamos el aislamiento lógico de su información respecto a otras empresas.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">
                            5. Responsabilidades
                        </h2>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>
                                <span className="font-semibold">Utilidades:</span> La veracidad de los reportes
                                financieros depende de que usted ingrese correctamente los costos de compra.
                            </li>
                            <li>
                                <span className="font-semibold">Efectivo:</span> El manejo físico del dinero en
                                caja es responsabilidad exclusiva del Cliente.
                            </li>
                            <li>
                                <span className="font-semibold">Facturación:</span> Los tickets emitidos son
                                comprobantes de control interno.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">
                            6. Disponibilidad (SLA)
                        </h2>
                        <p>
                            Nos esforzamos por una disponibilidad 24/7, pero no garantizamos un servicio libre de
                            interrupciones por mantenimientos o fallos de terceros (servidores, internet).
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">7. Contacto</h2>
                        <p>
                            Para soporte técnico: <span className="font-semibold">ambar-support@outisoft.com</span>
                        </p>
                    </section>
                </div>

                <div className="mt-4 border-t pt-3 text-center text-[11px] text-muted-foreground">
                    &copy; {new Date().getFullYear()} Ambar TPV. Todos los derechos reservados.
                </div>
            </div>
        </AuthSimpleLayout>
    );
}