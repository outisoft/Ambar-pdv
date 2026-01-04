<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva solicitud de prueba · Ambar</title>
    <style>
        /* Estilos básicos compatibles con la mayoría de clientes */
        body {
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #1b1b18;
        }

        a {
            color: #FF750F;
            text-decoration: none;
        }

        .wrapper {
            width: 100%;
            background-color: #f3f4f6;
            padding: 32px 0;
        }

        .container {
            max-width: 640px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #1b1b18, #0a0a0a);
            padding: 20px 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .brand-icon {
            width: 32px;
            height: 32px;
            border-radius: 12px;
            background: linear-gradient(135deg, #FF750F, #FF4433);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 700;
            font-size: 16px;
        }

        .brand-name {
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
        }

        .brand-dot {
            color: #FF750F;
        }

        .badge {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 6px 10px;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.6);
            color: #e5e7eb;
        }

        .content {
            padding: 28px;
        }

        .title {
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 8px;
            color: #111827;
        }

        .subtitle {
            font-size: 14px;
            color: #6b7280;
            margin: 0 0 20px;
        }

        .card {
            border-radius: 14px;
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
            padding: 18px 18px 16px;
            margin-bottom: 16px;
        }

        .card-title {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #6b7280;
            margin-bottom: 10px;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .info-table th,
        .info-table td {
            padding: 6px 0;
            vertical-align: top;
        }

        .info-table th {
            width: 36%;
            font-weight: 600;
            color: #4b5563;
        }

        .info-table td {
            color: #111827;
        }

        .note {
            font-size: 13px;
            line-height: 1.6;
            color: #111827;
            border-left: 3px solid #FF750F;
            padding-left: 10px;
            margin: 0;
        }

        .footer {
            padding: 18px 28px 22px;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }

        .footer strong {
            color: #4b5563;
        }

        .highlight {
            color: #FF750F;
            font-weight: 600;
        }

        @media (max-width: 600px) {
            .container {
                margin: 0 12px;
            }

            .content,
            .footer {
                padding-left: 18px;
                padding-right: 18px;
            }

            .header {
                padding-left: 18px;
                padding-right: 18px;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <div class="brand">
                    <div class="brand-icon">A</div>
                    <div class="brand-name">
                        Ambar<span class="brand-dot">.</span>
                    </div>
                </div>
                <div class="badge">Nueva solicitud de prueba</div>
            </div>

            <div class="content">
                <h1 class="title">Nuevo prospecto interesado en Ambar</h1>
                <p class="subtitle">
                    Se ha registrado una nueva solicitud de <span class="highlight">prueba gratuita</span> desde la
                    página pública
                    de Ambar. Estos son los detalles del contacto:
                </p>

                <div class="card">
                    <div class="card-title">Datos del contacto</div>
                    <table class="info-table" role="presentation">
                        <tr>
                            <th>Nombre completo</th>
                            <td>{{ $name }}</td>
                        </tr>
                        <tr>
                            <th>Correo electrónico</th>
                            <td>{{ $email }}</td>
                        </tr>
                        <tr>
                            <th>Teléfono</th>
                            <td>{{ $phone ?? 'No proporcionado' }}</td>
                        </tr>
                        <tr>
                            <th>Nombre del negocio</th>
                            <td>{{ $businessName ?? 'No proporcionado' }}</td>
                        </tr>
                        <tr>
                            <th>Plan de interés</th>
                            <td>{{ $planName ?? 'No especificado' }}</td>
                        </tr>
                    </table>
                </div>

                @isset($notes)
                    <div class="card">
                        <div class="card-title">Comentarios adicionales</div>
                        <p class="note">{{ $notes }}</p>
                    </div>
                @endisset

                <p class="subtitle" style="margin-top: 18px;">
                    Puedes responder directamente a este correo para ponerte en contacto con el prospecto o registrarlo
                    en tu CRM.
                </p>

                <p class="subtitle" style="margin-top: 10px;">
                    Gracias por seguir haciendo crecer <strong>Ambar</strong>.
                </p>
            </div>

            <div class="footer">
                <p style="margin: 0 0 4px;">
                    Este mensaje fue generado automáticamente desde el formulario de "Solicitar prueba gratis" de tu
                    sitio.
                </p>
                <p style="margin: 0;">
                    &copy; {{ date('Y') }} <strong>{{ config('app.name') }}</strong>. Todos los derechos reservados.
                </p>
            </div>
        </div>
    </div>
</body>

</html>
