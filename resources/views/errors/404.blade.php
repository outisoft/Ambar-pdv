<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>404 - Página no encontrada</title>

    {{-- Mismo comportamiento de modo oscuro que app.blade.php --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Fondo y colores coherentes con la página de bienvenida (welcome.tsx) --}}
    <style>
        html {
            background-color: #ffffff;
        }

        html.dark {
            background-color: #0a0a0a;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            color: #1b1b18;
        }

        body.dark {
            background: #0a0a0a;
            color: #ededec;
        }

        .card {
            max-width: 480px;
            width: 100%;
            padding: 2.5rem 2rem;
            border-radius: 1.25rem;
            background: #ffffff;
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.20);
            border: 1px solid #e5e5e5;
        }

        html.dark .card {
            background: #161615;
            color: #ededec;
            border-color: #3e3e3a;
        }

        .code {
            font-size: 0.9rem;
            font-weight: 600;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #6b7280;
        }

        .title {
            margin: 0.75rem 0 0.5rem;
            font-size: 1.6rem;
            font-weight: 600;
        }

        .message {
            margin: 0 0 1.75rem;
            font-size: 0.98rem;
            line-height: 1.5;
            color: #4b5563;
        }

        html.dark .message {
            color: #9ca3af;
        }

        .actions {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.65rem 1.25rem;
            border-radius: 999px;
            font-size: 0.9rem;
            font-weight: 500;
            text-decoration: none;
            border: 1px solid transparent;
            cursor: pointer;
            transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
        }

        .btn-primary {
            background: #ff750f;
            color: white;
        }

        .btn-primary:hover {
            background: #e0660d;
            transform: translateY(-1px);
        }

        .btn-secondary {
            background: transparent;
            color: #1f2933;
            border-color: #e5e5e5;
        }

        .btn-secondary:hover {
            background: #f9fafb;
            transform: translateY(-1px);
        }

        html.dark .btn-secondary {
            color: #ededec;
            border-color: #3e3e3a;
        }

        html.dark .btn-secondary:hover {
            background: #161615;
        }
    </style>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
    <style>
        body {
            font-family: 'Instrument Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
    </style>
</head>

<body>
    <main class="card">
        <div class="code">Error 404</div>
        <h1 class="title">Página no encontrada</h1>
        <p class="message">
            La página que estás buscando no existe o ha sido movida.
            Verifica la URL o vuelve a la página principal.
        </p>

        <div class="actions">
            <a href="{{ route('home') }}" class="btn-primary">Volver al inicio</a>

            @auth
                <a href="{{ route('dashboard') }}" class="btn-secondary">Ir al panel</a>
            @else
                <button class="btn-secondary" type="button" onclick="history.back()">Regresar</button>
            @endauth
        </div>
    </main>
</body>

</html>
