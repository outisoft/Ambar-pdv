<!DOCTYPE html>
<html>

<head>
    <title>Reporte de Horarios</title>
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/assets/images/symbol.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
        }

        .info {
            margin-bottom: 15px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .badge-open {
            color: green;
            font-weight: bold;
        }

        .badge-closed {
            color: red;
        }
    </style>
</head>

<body>

    <div class="header">
        <h2>Reporte de Aperturas y Cierres de Caja</h2>
        <h3>{{ $company_name }}</h3>
    </div>

    <div class="info">
        <strong>Periodo:</strong> {{ $start_date }} al {{ $end_date }} <br>
        <strong>Generado por:</strong> {{ $generated_by }} <br>
        <strong>Fecha reporte:</strong> {{ date('d/m/Y H:i') }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Sucursal</th>
                <th>Cajero</th>
                <th>Apertura (Inicio)</th>
                <th>Cierre (Fin)</th>
                <th>Duración</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($registers as $reg)
                <tr>
                    <td>{{ $reg->branch->name }}</td>
                    <td>{{ $reg->user->name }}</td>
                    <td>{{ \Carbon\Carbon::parse($reg->opened_at)->format('d/m/Y H:i') }}</td>
                    <td>
                        @if ($reg->closed_at)
                            {{ \Carbon\Carbon::parse($reg->closed_at)->format('d/m/Y H:i') }}
                        @else
                            ---
                        @endif
                    </td>
                    <td>
                        {{-- Calculamos horas trabajadas --}}
                        @if ($reg->closed_at)
                            {{ \Carbon\Carbon::parse($reg->opened_at)->diffForHumans(\Carbon\Carbon::parse($reg->closed_at), true) }}
                        @else
                            En curso
                        @endif
                    </td>
                    <td>
                        @if ($reg->status === 'open')
                            <span class="badge-open">ABIERTO</span>
                        @else
                            <span class="badge-closed">CERRADO</span>
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>

</html>
