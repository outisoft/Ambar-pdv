<!DOCTYPE html>
<html>

<head>
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/assets/images/symbol.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }

        .container {
            background-color: white;
            max-w: 600px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .total-box {
            background-color: #e8f5e9;
            color: #2e7d32;
            padding: 15px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            border-radius: 5px;
            margin: 20px 0;
        }

        .details {
            width: 100%;
            border-collapse: collapse;
        }

        .details td {
            padding: 8px;
            border-bottom: 1px solid #eee;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h2>Reporte de Cierre (Corte Z)</h2>
            <p>Cajero: {{ $cashRegister->user->name }}</p>
        </div>

        <div class="total-box">
            Reportado en Caja: ${{ number_format($summary['reported'], 2) }}
        </div>

        <table class="details">
            <tr>
                <td>Fondo Inicial:</td>
                <td align="right">${{ number_format($summary['initial'], 2) }}</td>
            </tr>
            <tr>
                <td>(+) Ventas Efectivo:</td>
                <td align="right" style="color:green">${{ number_format($summary['cash_sales'], 2) }}</td>
            </tr>
            <tr>
                <td>(+) Entradas / Abonos:</td>
                <td align="right" style="color:green">${{ number_format($summary['manual_entries'], 2) }}</td>
            </tr>
            <tr>
                <td>(-) Gastos / Retiros:</td>
                <td align="right" style="color:red">-${{ number_format($summary['manual_exits'], 2) }}</td>
            </tr>
            <tr style="background-color: #f9f9f9; font-weight:bold;">
                <td>= Total Esperado:</td>
                <td align="right">${{ number_format($summary['expected'], 2) }}</td>
            </tr>
        </table>

        <div
            style="margin-top: 20px; padding: 15px; border-radius: 5px; text-align: center; 
        background-color: {{ $summary['discrepancy'] == 0 ? '#e8f5e9' : ($summary['discrepancy'] < 0 ? '#ffebee' : '#e3f2fd') }};">

            @if ($summary['discrepancy'] == 0)
                <span style="color: green; font-weight: bold;">✅ Caja Cuadrada (Perfecta)</span>
            @elseif($summary['discrepancy'] < 0)
                <span style="color: red; font-weight: bold;">⚠️ Faltante:
                    ${{ number_format($summary['discrepancy'], 2) }}</span>
            @else
                <span style="color: blue; font-weight: bold;">ℹ️ Sobrante:
                    +${{ number_format($summary['discrepancy'], 2) }}</span>
            @endif
        </div>

        <p style="margin-top: 20px; color: #666; font-size: 12px;">
            * Ventas con Tarjeta/Transferencia: ${{ number_format($summary['card_sales'], 2) }} (No afecta efectivo en
            caja).
        </p>
    </div>
</body>

</html>
