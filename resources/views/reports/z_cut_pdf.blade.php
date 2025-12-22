<!DOCTYPE html>
<html>

<head>
    <title>Corte Z - #{{ $register->id }}</title>
    <style>
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            margin: 0 auto;
            width: 100%;
        }

        .center {
            text-align: center;
        }

        .line {
            border-bottom: 1px dashed #000;
            margin: 10px 0;
        }

        /* ESTILO PARA TABLAS (Más seguro para PDF que divs) */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
        }

        td {
            padding: 2px 0;
            vertical-align: top;
        }

        .text-right {
            text-align: right;
        }

        .text-left {
            text-align: left;
        }

        .bold {
            font-weight: bold;
        }

        .title {
            font-size: 14px;
            font-weight: bold;
        }

        .subtitle {
            font-size: 10px;
        }

        .section-title {
            font-weight: bold;
            margin-top: 10px;
            margin-bottom: 5px;
            text-decoration: underline;
            text-align: center;
        }
    </style>
</head>

<body>

    <div class="center">
        @if ($company->logo_path)
            {{-- Aseguramos que la ruta sea accesible localmente para DomPDF --}}
            <img src="{{ public_path('storage/' . $company->logo_path) }}" style="max-width: 80px; margin-bottom: 5px;">
        @endif
        <div class="title">{{ $company->name }}</div>
        <div class="subtitle">{{ $register->branch->name }}</div>
        <div class="line"></div>
        <div class="title">CORTE Z</div>
        <div>ID Cierre: #{{ $register->id }}</div>
        <div>Fecha:
            {{ $register->closed_at ? \Carbon\Carbon::parse($register->closed_at)->format('d/m/Y H:i') : 'EN CURSO' }}
        </div>
        <div>Cajero: {{ $register->user->name }}</div>
    </div>

    <div class="line"></div>

    <div class="section-title">VENTAS POR MÉTODO</div>
    <table>
        @forelse($payment_methods as $method => $amount)
            <tr>
                <td class="text-left">{{ ucfirst($method) }}</td>
                <td class="text-right bold">${{ number_format($amount, 2) }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="2" class="center">Sin ventas registradas</td>
            </tr>
        @endforelse
    </table>

    <div class="line"></div>

    <table>
        <tr>
            <td class="text-left" style="font-size: 14px;">VENTA TOTAL</td>
            <td class="text-right bold" style="font-size: 14px;">${{ number_format($total_sales, 2) }}</td>
        </tr>
    </table>

    <div class="section-title">ESTADÍSTICAS</div>
    <table>
        <tr>
            <td class="text-left">Tickets Pagados:</td>
            <td class="text-right">{{ $sales_count }}</td>
        </tr>
        <tr>
            <td class="text-left">Tickets Anulados:</td>
            <td class="text-right">{{ $cancelled_count }}</td>
        </tr>
        <tr>
            <td class="text-left">Monto Anulado:</td>
            <td class="text-right">-${{ number_format($cancelled_sales, 2) }}</td>
        </tr>
    </table>

    <div class="line"></div>
    <div class="section-title">ARQUEO DE EFECTIVO</div>

    <table>
        <tr>
            <td class="text-left">Fondo Inicial:</td>
            <td class="text-right">${{ number_format($register->initial_amount, 2) }}</td>
        </tr>
        <tr>
            <td class="text-left">(+) Ventas Efec.:</td>
            <td class="text-right">${{ number_format($payment_methods->get('cash', 0), 2) }}</td>
        </tr>
        <tr>
            <td colspan="2" style="border-bottom: 1px solid #000; height: 1px;"></td>
        </tr>
        <tr>
            <td class="text-left">Efectivo Esperado:</td>
            <td class="text-right bold">${{ number_format($expected_cash, 2) }}</td>
        </tr>
        <tr>
            <td class="text-left">Efectivo Real:</td>
            <td class="text-right bold">${{ number_format($register->final_amount, 2) }}</td>
        </tr>
    </table>

    <div class="line"></div>
    <table>
        <tr>
            <td class="text-left bold" style="font-size: 13px;">DIFERENCIA:</td>
            <td class="text-right bold"
                style="font-size: 13px; color: {{ $difference < 0 ? 'red' : ($difference > 0 ? 'blue' : 'black') }}">
                {{ number_format($difference, 2) }}
            </td>
        </tr>
    </table>

    <div class="line"></div>
    <div class="center" style="margin-top: 40px;">
        ___________________________<br>
        Firma de Conformidad
    </div>

</body>

</html>
