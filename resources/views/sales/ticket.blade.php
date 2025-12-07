<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Ticket #{{ str_pad($sale->id, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        /* Optimización para impresora térmica 80mm */
        @page { margin: 0; size: 80mm auto; }

        :root {
            --ticket-width: 72mm; /* ancho útil en 80mm (≈72–76mm) */
            --fs-xs: 9px;
            --fs-sm: 10px;
            --fs-md: 11px;
            --fs-lg: 14px;
        }

        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        body {
            margin: 0;
            background: #fff;
            font-family: "Courier New", Courier, monospace;
            font-size: var(--fs-sm);
            color: #000;
        }

        .ticket {
            width: var(--ticket-width);
            margin: 0 auto;
            padding: 6px 8px;
        }

        .header {
            text-align: center;
        }
        .header h1 {
            margin: 2px 0 0 0;
            font-size: var(--fs-lg);
            letter-spacing: 0.5px;
        }
        .header p {
            margin: 2px 0;
            line-height: 1.2;
        }

        .meta { margin-top: 6px; }
        .meta p { margin: 2px 0; }

        .line {
            border-top: 1px dashed #000;
            margin: 8px 0;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed; /* evita saltos y desbordes */
        }
        .table th,
        .table td {
            padding: 2px 0;
            vertical-align: top;
        }
        .table thead th {
            font-size: var(--fs-xs);
            text-transform: uppercase;
            letter-spacing: 0.4px;
            border-bottom: 1px dashed #000;
        }

        .w-qty { width: 12%; }
        .w-name { width: 58%; word-break: break-word; }
        .w-amount { width: 30%; text-align: right; }

        .total {
            font-weight: 700;
            font-size: 13px;
            text-align: right;
        }

        .footer {
            text-align: center;
            margin-top: 8px;
        }
        .footer p { margin: 2px 0; }

        @media print {
            .ticket { width: var(--ticket-width); }
        }
    </style>
</head>
@php
    $settings = \App\Models\Setting::first();
@endphp
<body>

    <div class="ticket">
        <div class="header">
            @if($settings->logo_path)
                {{-- public_path es necesario para dompdf en lugar de asset() --}}
                <img src="{{ public_path('storage/' . $settings->logo_path) }}" style="max-width: 40mm; max-height: 20mm;">
                <br>
            @endif
            <h1>{{ $settings->shop_name }}</h1>
            <p>
                {{ $settings->address }}<br>
                Tel: {{ $settings->phone }}<br>
                @if($settings->tax_id) RFC: {{ $settings->tax_id }} @endif
            </p>
        </div>

        <div class="line"></div>

        <div class="meta">
            <p><strong>Ticket:</strong> #{{ str_pad($sale->id, 6, '0', STR_PAD_LEFT) }}</p>
            <p><strong>Fecha:</strong> {{ $sale->created_at->format('d/m/Y H:i') }}</p>
            {{-- Si tienes cajero: <p><strong>Cajero:</strong> {{ $sale->user->name }}</p> --}}
            <strong>Pago:</strong>
            @switch($sale->payment_method)
                @case('cash') EFECTIVO @break
                @case('card') TARJETA @break
                @case('transfer') TRANSF. @break
            @endswitch
        </div>

        <div class="line"></div>

        <table class="table">
            <thead>
                <tr>
                    <th class="w-qty">Cant.</th>
                    <th class="w-name">Producto</th>
                    <th class="w-amount">Importe</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sale->items as $item)
                <tr>
                    <td class="w-qty">{{ $item->quantity }}</td>
                    <td class="w-name">{{ $item->product->name }}</td>
                    <td class="w-amount">${{ number_format($item->price * $item->quantity, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="line"></div>

        <div class="total">
            TOTAL: ${{ number_format($sale->total, 2) }}
        </div>

        <div class="line"></div>

        <div class="footer">
            <p>¡GRACIAS POR SU COMPRA!</p>
            <p>Vuelva pronto</p>
        </div>
    </div>

    <script>
        // Auto-imprimir al cargar y cerrar la ventana tras imprimir
        window.addEventListener('load', function () {
            setTimeout(function () { window.print(); }, 200);
        });
        window.addEventListener('afterprint', function () {
            window.close();
        });
    </script>
</body>
</html>