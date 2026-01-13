// resources/js/data/UserManual.ts

// Estructura general del manual de usuario.
// Cada topic representa una sección lateral (categoría), con artículos en HTML sencillo.

export const manualTopics = [
    {
        category: "👤 Guía rápida para Cajeros",
        icon: "user",
        roles: ['cajero'],
        articles: [
            {
                id: 'guia-cajero-resumen',
                title: 'Resumen de pantalla para Cajeros',
                content: `
                    <p class="mb-2">Como cajero verás principalmente las pantallas relacionadas con ventas y caja:</p>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><b>Punto de Venta (POS):</b> pantalla principal para escanear productos y cobrar.</li>
                        <li><b>Caja &gt; Abrir / Cerrar:</b> para registrar tu fondo inicial y hacer el cierre de turno.</li>
                        <li><b>Historial de ventas:</b> para consultar tickets recientes y realizar cancelaciones/devoluciones.</li>
                        <li><b>Notificaciones:</b> avisos del sistema (por ejemplo, stock bajo o ventas canceladas).</li>
                    </ul>
                    <p class="mt-3 text-sm">No verás módulos administrativos como configuración, productos o reportes avanzados; esos son exclusivos de gerencia / administración.</p>
                `
            }
        ]
    },
    {
        category: "👑 Guía rápida para Gerentes",
        icon: "crown",
        roles: ['gerente'],
        articles: [
            {
                id: 'guia-gerente-resumen',
                title: 'Resumen de pantalla para Gerentes',
                content: `
                    <p class="mb-2">Como gerente tienes acceso tanto a operaciones diarias como a reportes y administración básica:</p>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><b>Dashboard:</b> resumen de ventas, stock bajo y alertas importantes.</li>
                        <li><b>Reportes:</b> centro de reportes, corte Z diario y reporte de utilidades.</li>
                        <li><b>Inventario y productos:</b> consulta de existencias por sucursal, edición de productos y actualización de stock.</li>
                        <li><b>Cuentas por cobrar:</b> seguimiento de clientes con crédito y registro de abonos.</li>
                        <li><b>Usuarios (opcional):</b> en algunas instalaciones, el gerente también puede administrar usuarios de su empresa.</li>
                    </ul>
                    <p class="mt-3 text-sm">No verás configuraciones globales del sistema ni todas las empresas; esos apartados son exclusivos del super-administrador.</p>
                `
            }
        ]
    },
    {
        category: "🛡️ Guía para Super-Administradores",
        icon: "shield",
        roles: ['super-admin'],
        articles: [
            {
                id: 'guia-superadmin-resumen',
                title: 'Resumen de pantalla para Super-Admin',
                content: `
                    <p class="mb-2">El super-administrador tiene la vista más completa del sistema:</p>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><b>Empresas y planes:</b> alta de empresas, renovación de suscripciones y control de planes.</li>
                        <li><b>Sucursales:</b> creación de puntos de venta y asignación de usuarios.</li>
                        <li><b>Usuarios, roles y permisos:</b> gestión completa de accesos.</li>
                        <li><b>Reportes globales:</b> posibilidad de revisar información consolidada por empresa y sucursal.</li>
                        <li><b>Configuración general:</b> parámetros del sistema, logos por defecto y opciones avanzadas.</li>
                    </ul>
                    <p class="mt-3 text-sm">Usa esta cuenta solo para tareas de administración y configuración; para operar el día a día se recomienda usar cuentas de gerente o cajero.</p>
                `
            }
        ]
    },
    {
        category: "🛒 Punto de Venta (Caja)",
        icon: "shopping-cart",
        roles: ['cajero', 'gerente', 'super-admin'], // Quién puede verlo
        articles: [
            {
                id: 'apertura-caja',
                title: 'Apertura y Cierre de Caja',
                content: `
                    <h3 class="text-lg font-bold mb-2">1. Iniciar el Día</h3>
                    <p class="mb-2">Al entrar al sistema, si su caja está cerrada, verá una pantalla solicitando el <b>Monto Inicial</b>.</p>
                    <p class="mb-4">Ingrese el dinero físico (fondo) con el que inicia el turno y haga clic en "Abrir Caja".</p>
                    
                    <h3 class="text-lg font-bold mb-2">2. Cierre de Turno (Corte Z)</h3>
                    <p class="mb-2">Para cerrar, vaya al menú <b>Caja > Cerrar Caja</b>.</p>
                    <ul class="list-disc pl-5 mb-4">
                        <li>Cuente el dinero físico en su cajón.</li>
                        <li>Ingrese la cantidad en el campo <b>Efectivo reportado</b>.</li>
                        <li>El sistema calculará automáticamente si hay sobrantes o faltantes.</li>
                    </ul>
                    <div class="bg-yellow-50 p-3 border-l-4 border-yellow-400 text-sm">
                        Nota: Al cerrar, se enviará un reporte automático al correo del gerente.
                    </div>
                `
            },
            {
                id: 'cobrar-venta',
                title: 'Cómo realizar una venta',
                content: `
                    <p class="mb-2">El proceso de venta es rápido y sencillo:</p>
                    <ol class="list-decimal pl-5 space-y-2">
                        <li><b>Escanear:</b> Use su lector de código de barras o escriba el nombre del producto en el buscador.</li>
                        <li><b>Cantidad:</b> Puede editar la cantidad manualmente o escanear el producto varias veces.</li>
                        <li><b>Cobrar:</b> Presione la tecla <b>F12</b> o el botón verde <b>COBRAR</b>.</li>
                        <li><b>Pago:</b> Seleccione el método (Efectivo, Tarjeta, Transferencia, Crédito). Si es efectivo, ingrese con cuánto paga el cliente para ver el cambio. También puede confirmar el cobro presionando <b>Enter</b> después de escribir el efectivo recibido.</li>
                    </ol>
                `
            },
            {
                id: 'devoluciones',
                title: 'Devoluciones y Cancelaciones',
                content: `
                    <p>Si un cliente necesita devolver un producto:</p>
                    <ol class="list-decimal pl-5 mt-2">
                        <li>Vaya a <b>Historial de Ventas</b> en el menú lateral.</li>
                        <li>Busque el ticket por folio o nombre del cliente.</li>
                        <li>Haga clic en el botón rojo <b>Cancelar / Devolver</b> según el flujo configurado.</li>
                        <li>Seleccione qué productos regresan. El sistema ajustará el inventario y, según corresponda, el dinero de caja o saldo del cliente.</li>
                    </ol>
                `
            }
        ]
    },
    {
        category: "📦 Inventario y Productos",
        icon: "box",
        roles: ['gerente', 'super-admin'], // Cajeros no ven esto
        articles: [
            {
                id: 'importar-excel',
                title: 'Importación Masiva (Excel)',
                content: `
                    <p class="mb-4">Para cargar muchos productos a la vez:</p>
                    <ol class="list-decimal pl-5 space-y-2">
                        <li>Vaya a la sección <b>Productos</b>.</li>
                        <li>Haga clic en <b>Importar Excel</b> (botón verde superior).</li>
                        <li><b>Descargue la Plantilla:</b> Es importante usar el archivo CSV que provee el sistema.</li>
                        <li>Llene los datos: <i>Nombre, Código de Barras, Precio, Costo, Stock, Stock mínimo</i>.</li>
                        <li>Suba el archivo guardado.</li>
                    </ol>
                `
            },
            {
                id: 'stock-bajo',
                title: 'Alertas de Stock Bajo',
                content: `
                    <p>El sistema le avisará cuando un producto esté por agotarse basado en el <b>Stock Mínimo</b> que configuró.</p>
                    <p class="mt-2">Verá una alerta roja en su Dashboard principal y en la barra de navegación superior.</p>
                `
            }
        ]
    },
    {
        category: "⚙️ Administración",
        icon: "cog",
        roles: ['gerente', 'super-admin'],
        articles: [
            {
                id: 'configuracion-ticket',
                title: 'Personalizar Logo y Ticket',
                content: `
                    <p>Para que su ticket salga con su marca:</p>
                    <ol class="list-decimal pl-5 mt-2">
                        <li>Vaya a <b>Configuración</b> en el menú.</li>
                        <li>Suba su imagen de Logo (Formato PNG o JPG).</li>
                        <li>Edite la dirección y el mensaje de pie de página (ej: "Gracias por su compra").</li>
                        <li>Guarde los cambios. Sus próximos tickets saldrán actualizados.</li>
                    </ol>
                `
            },
            {
                id: 'reporte-utilidades',
                title: 'Ver Ganancias y Reportes',
                content: `
                    <p>El reporte de utilidades calcula la ganancia real (Venta - Costo Histórico).</p>
                    <p class="mt-2">Puede filtrar por fechas para ver cuánto ganó en un día, semana o mes específico.</p>
                    <ul class="list-disc pl-5 mt-2">
                        <li><b>Centro de reportes:</b> desde el menú de <b>Reportes</b> podrá ir a corte Z diario, horarios/turnos y reporte de utilidades.</li>
                        <li><b>Reporte de utilidades:</b> muestra ingresos, costo, utilidad bruta y margen usando el costo histórico de cada producto vendido.</li>
                        <li><b>Corte Z PDF:</b> genera un resumen descargable con las ventas y movimientos de caja del día.</li>
                    </ul>
                `
            },
            {
                id: 'cuentas-por-cobrar',
                title: 'Cuentas por Cobrar y Créditos',
                content: `
                    <p>Cuando realice ventas a crédito, el saldo se acumulará en la cuenta del cliente.</p>
                    <ul class="list-disc pl-5 mt-2">
                        <li>Desde <b>Cuentas por Cobrar</b> podrá ver la lista de clientes con saldo pendiente.</li>
                        <li>En cada cliente podrá registrar <b>abonos</b> que descontarán su saldo.</li>
                        <li>Los abonos en efectivo se registran como entradas de caja y se reflejan en el cierre.</li>
                    </ul>
                `
            },
            {
                id: 'usuarios-y-roles',
                title: 'Gestión de Usuarios y Roles',
                content: `
                    <p>El sistema permite controlar el acceso mediante roles y permisos.</p>
                    <ul class="list-disc pl-5 mt-2">
                        <li><b>Usuarios:</b> desde el módulo de Usuarios puede crear, editar o desactivar cuentas.</li>
                        <li><b>Roles:</b> defina si un usuario es <i>cajero</i>, <i>gerente</i> o <i>super-admin</i>, entre otros.</li>
                        <li><b>Permisos:</b> algunos módulos como reportes de utilidades solo están disponibles para gerentes y administradores.</li>
                    </ul>
                `
            },
            {
                id: 'sucursales-y-empresas',
                title: 'Empresas y Sucursales',
                content: `
                    <p>Si su instancia maneja varias sucursales:</p>
                    <ul class="list-disc pl-5 mt-2">
                        <li>En <b>Empresas</b> puede configurar los datos fiscales y de contacto de la compañía.</li>
                        <li>En <b>Sucursales</b> define cada punto de venta físico y su inventario asociado.</li>
                        <li>Los usuarios (cajeros) están asignados a una sucursal para que las ventas y movimientos se registren en el lugar correcto.</li>
                    </ul>
                `
            }
        ]
    },
    {
        category: "📊 Reportes y Caja",
        icon: "chart-bar",
        roles: ['gerente', 'super-admin'],
        articles: [
            {
                id: 'centro-reportes',
                title: 'Centro de Reportes',
                content: `
                    <p>El centro de reportes concentra los informes clave del sistema.</p>
                    <ul class="list-disc pl-5 mt-2">
                        <li><b>Horarios y turnos:</b> genera un PDF con el detalle de turnos y horarios de caja.</li>
                        <li><b>Corte Z diario:</b> resume ventas, movimientos de caja y totales del día.</li>
                        <li><b>Reporte de utilidades:</b> permite analizar la rentabilidad por periodo y por producto.</li>
                    </ul>
                `
            },
            {
                id: 'arqueo-caja',
                title: 'Arqueo de Caja y Diferencias',
                content: `
                    <p>En el cierre de caja, el sistema compara el efectivo esperado con el efectivo contado.</p>
                    <ul class="list-disc pl-5 mt-2">
                        <li>Se consideran: fondo inicial, ventas en efectivo, entradas y salidas de caja.</li>
                        <li>Las diferencias (sobrantes o faltantes) quedan registradas para control interno.</li>
                        <li>Opcionalmente se pueden enviar notificaciones al gerente cuando hay discrepancias.</li>
                    </ul>
                `
            }
        ]
    }
];