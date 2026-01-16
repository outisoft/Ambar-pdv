import { Head, Link } from '@inertiajs/react';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';

export default function PrivacyShow() {
    const today = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <AuthSimpleLayout
            title="Política de privacidad"
            description="Conoce cómo protegemos y usamos tus datos."
        >
            <Head title="Política de Privacidad" />

            <div className="space-y-6 mx-auto w-full max-w-[100%] md:max-w-[800px] rounded-xl md:rounded-2xl border border-gray-200/80 dark:border-[#3E3E3A] bg-white dark:bg-[#0a0a0a] px-5 py-6 md:px-10 md:py-10 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Política de privacidad</h1>
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
                        En <span className="font-semibold">Ambar TPV</span> ("Nosotros"),
                        respetamos tu privacidad y estamos comprometidos a proteger los datos personales y
                        comerciales que compartes con nosotros.
                    </p>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">
                            1. Información que recopilamos
                        </h2>
                        <p>Para proveer el servicio de Punto de Venta, recopilamos:</p>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>
                                <span className="font-semibold">Datos de cuenta:</span> Nombre, correo
                                electrónico, contraseña encriptada y teléfono.
                            </li>
                            <li>
                                <span className="font-semibold">Datos operativos:</span> Inventarios, registros
                                de ventas, clientes y cortes de caja que ingresas al sistema.
                            </li>
                            <li>
                                <span className="font-semibold">Datos técnicos:</span> Dirección IP, tipo de
                                navegador y cookies de sesión para mantenerte logueado.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">
                            2. Uso de la información
                        </h2>
                        <p>Utilizamos tus datos exclusivamente para:</p>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>Proveer acceso al sistema y sus funcionalidades (ventas, inventario).</li>
                            <li>Procesar cobros de suscripción.</li>
                            <li>
                                Enviar notificaciones operativas (por ejemplo: reportes de corte de caja o
                                alertas de stock).
                            </li>
                            <li>Mejorar la seguridad del sistema.</li>
                        </ul>
                        <p className="font-semibold">
                            No vendemos ni alquilamos tus datos a terceros con fines publicitarios.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">
                            3. Almacenamiento y seguridad
                        </h2>
                        <p>
                            Tus datos están alojados en servidores seguros en la nube. Implementamos medidas de
                            seguridad como encriptación SSL (HTTPS), aislamiento de bases de datos por empresa y
                            contraseñas hash.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">4. Cookies</h2>
                        <p>
                            Usamos cookies esenciales para mantener tu sesión activa y segura. Al usar el sistema,
                            aceptas el uso de estas cookies.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">
                            5. Tus derechos (ARCO)
                        </h2>
                        <p>
                            Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos.
                            Para solicitar la eliminación completa de tu cuenta y de tu información, contáctanos a
                            través de los canales de soporte.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">6. Contacto</h2>
                        <p>
                            Para dudas sobre privacidad:{' '}
                            <span className="font-semibold">ambar-support@outisoft.com</span>
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