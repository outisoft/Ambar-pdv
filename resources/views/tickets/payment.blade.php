<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Comprobante de Abono</title>
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/assets/images/symbol.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <style>
        @page {
            margin: 0;
            size: 80mm auto;
        }

        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            margin: 0;
            padding: 0;
        }

        .ticket {
            width: 260px;
            margin: 0 auto;
            padding: 8px 6px 10px;
        }

        .centered {
            text-align: center;
        }

        .right {
            text-align: right;
        }

        .bold {
            font-weight: bold;
        }

        .muted {
            color: #555;
            font-size: 10px;
        }

        .divider {
            border-top: 1px dashed #000;
            margin: 8px 0;
        }

        .logo {
            max-width: 80px;
            margin-bottom: 4px;
        }

        .big-text {
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .label {
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
        }

        .box {
            border: 1px solid #000;
            padding: 6px;
            margin: 6px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            vertical-align: top;
        }
    </style>
</head>

<body>

    <div class="ticket">
        {{-- Encabezado empresa --}}
        <div class="centered">
            @if ($company->logo_path)
                <img src="{{ public_path('storage/' . $company->logo_path) }}" class="logo"
                    alt="Logo {{ $company->name }}">
                <br>
            @endif
            <span class="bold">{{ strtoupper($company->name) }}</span><br>
            <span class="muted">{{ $company->address }}</span><br>
            <span class="muted">Tel: {{ $company->phone }}</span>
        </div>

        <div class="divider"></div>

        {{-- Título comprobante --}}
        <div class="centered">
            <span class="big-text">ABONO A CRÉDITO</span><br>
            <span class="label">COMPROBANTE DE PAGO</span><br>
            <span class="muted">Mov. #{{ $transaction->id }} ·
                {{ $transaction->created_at->format('d/m/Y h:i A') }}</span>
        </div>

        <div class="divider"></div>

        {{-- Datos del cliente --}}
        <div>
            <span class="label">Cliente</span><br>
            <span class="bold">{{ $client->name }}</span><br>
            @if ($client->rfc)
                <span class="muted">RFC: {{ $client->rfc }}</span><br>
            @endif
        </div>

        <div class="divider"></div>

        {{-- Resumen de movimiento --}}
        <table>
            <tr>
                <td><span class="label">Saldo anterior</span></td>
                <td class="right">${{ number_format($transaction->previous_balance, 2) }}</td>
            </tr>
            <tr>
                <td colspan="2" style="height: 4px;"></td>
            </tr>
            <tr>
                <td class="bold">ABONO RECIBIDO</td>
                <td class="right bold">${{ number_format($transaction->amount, 2) }}</td>
            </tr>
            <tr>
                <td colspan="2" style="font-size: 10px; font-style: italic; padding-top: 3px;">
                    ({{ $transaction->description ?? 'Pago a cuenta' }})
                </td>
            </tr>
        </table>

        <div class="divider"></div>

        {{-- Estado de la cuenta --}}
        <div class="box">
            <table>
                <tr>
                    <td class="label bold">Total restante (deuda)</td>
                    <td class="right bold" style="color: #d32f2f;">
                        ${{ number_format($transaction->new_balance, 2) }}
                    </td>
                </tr>
                <tr>
                    <td class="label bold">Crédito disponible</td>
                    <td class="right bold" style="color: #388e3c;">
                        ${{ number_format($available_credit, 2) }}
                    </td>
                </tr>
            </table>
        </div>

        <div class="divider"></div>

        {{-- Firma --}}
        <div style="margin-top: 26px;">
            <div class="centered">
                __________________________<br>
                <span class="label">Firma de conformidad</span><br>
                <span class="bold">{{ $client->name }}</span>
            </div>
        </div>

        {{-- Pie --}}
        <div class="centered" style="margin-top: 16px; font-size: 10px;">
            {{ $company->ticket_footer_message ?? 'Gracias por su pago puntual.' }}
        </div>
    </div>

</body>

</html>
