<!DOCTYPE html>
<html lang="es" class="h-full">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>504 | Tiempo de espera agotado</title>
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>

<body class="h-full bg-[#020617] text-slate-100">
    <div class="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {{-- Capa de "espacio" con nebulosas y estrellas --}}
        <div class="pointer-events-none absolute inset-0 -z-10">
            <div class="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
            <div
                class="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,117,15,0.25),_transparent_60%)] blur-2xl opacity-70">
            </div>
            <div
                class="absolute top-10 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.25),_transparent_60%)] blur-2xl opacity-60">
            </div>
            <div
                class="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.15),_transparent_60%)] blur-3xl opacity-70">
            </div>
            <div
                class="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30">
            </div>
        </div>

        <div class="max-w-xl w-full text-center">
            <div
                class="inline-flex items-center justify-center rounded-2xl bg-slate-900/70 border border-slate-700/60 px-4 py-2 mb-6 shadow-sm backdrop-blur">
                <span class="text-xs font-semibold tracking-wide text-slate-200 uppercase">Error 504</span>
            </div>

            <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-50 mb-3">
                Tiempo de espera agotado
            </h1>

            <p class="text-base sm:text-lg text-slate-300 mb-8">
                El servidor tardó demasiado en responder a tu solicitud.
                Puede tratarse de un problema temporal de red o de un servicio lento.
            </p>

            <div class="relative mb-10">
                <div
                    class="mx-auto h-40 sm:h-48 max-w-md rounded-3xl bg-slate-900/70 border border-slate-700/70 shadow-lg shadow-slate-900/80 flex items-center justify-center overflow-hidden backdrop-blur">
                    <div
                        class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,117,15,0.35),_transparent_60%)] opacity-80">
                    </div>
                    <div class="relative flex flex-col items-center gap-3">
                        <div
                            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/40">
                            <span class="text-2xl font-bold">504</span>
                        </div>
                        <p class="text-sm text-slate-300 max-w-xs">
                            Intenta de nuevo en unos instantes o vuelve al panel principal.
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button type="button" onclick="location.reload()"
                    class="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800 transition-colors w-full sm:w-auto backdrop-blur">
                    Reintentar
                </button>

                @auth
                    <a href="{{ route('dashboard') }}"
                        class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/50 hover:brightness-110 transition-colors w-full sm:w-auto">
                        Ir al dashboard
                    </a>
                @else
                    <a href="{{ route('home') }}"
                        class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/50 hover:brightness-110 transition-colors w-full sm:w-auto">
                        Ir al inicio
                    </a>
                @endauth
            </div>

            <p class="mt-8 text-xs text-slate-400">
                Si este mensaje aparece con frecuencia, informa al equipo técnico para que revise el rendimiento.
            </p>
        </div>
    </div>
</body>

</html>
