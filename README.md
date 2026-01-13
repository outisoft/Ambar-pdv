# 🛒 Sistema TPV SaaS (Laravel + React)

## 📖 Descripción del Proyecto

Sistema de Punto de Venta (POS) basado en la nube (SaaS), diseñado con arquitectura Multi-Tenant (Multi-Empresa). Permite gestionar inventarios, ventas, créditos, cortes de caja y finanzas de múltiples negocios de forma aislada y segura.

## 🛠️ Stack Tecnológico

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 18 + Inertia.js (TypeScript)
- **Estilos:** Tailwind CSS
- **Base de Datos:** MySQL 8.0
- **Autenticación:** Laravel Breeze + Spatie Permission
- **Reportes & Utilidades:**
    - `barryvdh/laravel-dompdf`: Generación de Tickets y Reportes PDF.
    - `maatwebsite/excel`: Importación masiva de inventarios.
    - `react-chartjs-2`: Gráficas para Dashboard y Utilidades.
    - `react-hotkeys-hook`: Atajos de teclado para el POS.

---

## 🏗️ Arquitectura y Seguridad

### 1. Multi-Tenancy (Aislamiento)

El sistema utiliza una estrategia de "Single Database". Todas las consultas críticas (`Products`, `Sales`, `Clients`) filtran automáticamente por `company_id` para asegurar que una empresa nunca vea datos de otra.

### 2. Control de Suscripciones

Middleware personalizado `CheckSubscription` que verifica la fecha de vencimiento (`subscription_ends_at`).

- **Activo:** Acceso total.
- **Vencido:** Redirección forzada a vista de bloqueo, permitiendo solo acceso al módulo de renovación.

### 3. Roles y Permisos (ACL)

- **Super Admin:** Gestión de Tenants (Empresas) y planes.
- **Gerente:** Administración total de SU empresa (Configuración, Inventario, Reportes).
- **Cajero:** Operativo limitado (Ventas, Cierre de Caja).

---

## 📦 Módulos Principales

### 🛒 1. Punto de Venta (POS)

- **Operación:** Búsqueda por escáner o texto.
- **Pagos:** Efectivo (con cálculo de cambio), Tarjeta, Transferencia y Crédito.
- **Funciones:**
    - Suspensión de ventas (Hold).
    - Atajos de teclado (`F12` Cobrar, `ESC` Cerrar modales).
    - Validación de stock en tiempo real por sucursal.

### 💳 2. Créditos y Cuentas por Cobrar (Fiado)

- Asignación de **Límite de Crédito** por cliente.
- Bloqueo de venta si excede el límite.
- Módulo de abonos parciales con historial de transacciones.

### 📉 3. Inventario Avanzado

- **Stock Multi-Sucursal:** Tabla pivote `branch_product` permite stocks distintos por tienda.
- **Alertas:** Notificación de "Stock Bajo" basada en mínimos configurables.
- **Importación:** Carga masiva desde Excel/CSV con detección automática de columnas.

### 💰 4. Control de Efectivo (Caja)

- **Flujo Blindado:** Apertura -> Operación -> Arqueo Ciego -> Cierre.
- **Corte Z:** Reporte PDF con desglose matemático (Inicial + Ventas + Entradas - Salidas).
- **Notificaciones:** Envío automático del reporte de cierre por correo al Gerente.

### 📊 5. Reporte de Utilidades (Finanzas)

- **Lógica de Negocio:** Se almacena el `cost_price` histórico en cada detalle de venta (`sale_items`).
- **Cálculo:** `Utilidad = (Precio Venta - Costo Histórico)`.
- Esto asegura que los cambios futuros de precio del proveedor no afecten los reportes de ganancias pasadas.

### 🔄 6. Post-Venta

- **Historial:** Buscador por folio, fecha o cliente.
- **Devoluciones:** Módulo transaccional que retorna stock, descuenta dinero de caja y registra el evento.
- **Branding:** Configuración de Logo y Textos del Ticket por empresa.

---

## ⚙️ Instalación y Despliegue

1.  **Clonar repositorio e instalar dependencias:**

    ```bash
    composer install
    npm install
    ```

2.  **Configurar Entorno (`.env`):**

    ```env
    DB_CONNECTION=mysql
    DB_DATABASE=nombre_db
    APP_TIMEZONE='America/Mexico_City'
    MAIL_MAILER=smtp (o log para pruebas)
    ```

3.  **Base de Datos:**

    ```bash
    php artisan migrate --seed
    ```

4.  **Links Simbólicos (Imágenes):**

    ```bash
    php artisan storage:link
    ```

5.  **Compilar Assets:**
    ```bash
    npm run build
    ```

---
