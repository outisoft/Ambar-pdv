import { dashboard, login} from '@/routes';
import { type SharedData } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    CheckCircle,
    ChevronRight,
    LayoutDashboard,
    Menu,
    Smartphone,
    Store,
    Zap,
    X,
    MessageCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Plan {
    id: number;
    name: string;
    price: number;
    duration_in_days: number;
    max_users: number | null;
    max_branches: number | null;
    max_products: number | null;
    currency?: string | null;
}

interface WelcomeProps {
    canRegister?: boolean;
    plans?: Plan[];
}

export default function Welcome({
    canRegister = true,
    plans = [],
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    const {
        data: trialData,
        setData: setTrialData,
        post: postTrial,
        processing: trialProcessing,
        errors: trialErrors,
        reset: resetTrial,
    } = useForm({
        name: '',
        email: '',
        phone: '',
        business_name: '',
        notes: '',
        plan_id: '',
    });

    const openTrialModal = (plan?: Plan | null) => {
        setSelectedPlan(plan ?? null);
        setTrialData('plan_id', plan ? String(plan.id) : '');
        setIsTrialModalOpen(true);
    };

    const closeTrialModal = () => {
        setIsTrialModalOpen(false);
        setSelectedPlan(null);
        resetTrial();
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Separar planes mensuales y anuales en base a la duración
    const monthlyPlans = plans.filter((plan) => plan.duration_in_days <= 31);
    const yearlyPlans = plans.filter((plan) => plan.duration_in_days > 31);
    const visiblePlans = billingPeriod === 'monthly' ? monthlyPlans : yearlyPlans;

    return (
        <div className="bg-white text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#ededec] font-sans selection:bg-[#FF750F] selection:text-white">
            <Head title="Ambar - Tu Punto de Venta Inteligente" />

            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-[#3E3E3A] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF750F] to-[#FF4433] group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                            <AppLogoIcon className="size-6 fill-current text-white" />
                        </div>
                        <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white tracking-tight">Ambar<span className="text-[#FF750F]">.</span></span>
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="text-white bg-[#1b1b18] hover:bg-black focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    href={login()}
                                    className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-[#3E3E3A] dark:hover:bg-[#161615] transition-all"
                                >
                                    Iniciar Sesión
                                </Link>
                            </div>
                        )}
                        <button
                            onClick={toggleMobileMenu}
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-[#161615] dark:focus:ring-gray-600 transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`}>
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-[#161615] md:dark:bg-transparent dark:border-[#3E3E3A]">
                            <li>
                                <a href="#beneficios" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#FF750F] md:p-0 dark:text-white md:dark:hover:text-[#FF750F] dark:hover:bg-[#2C2C2A] dark:hover:text-white md:dark:hover:bg-transparent transition-colors">Beneficios</a>
                            </li>
                            <li>
                                <a href="#planes" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#FF750F] md:p-0 dark:text-white md:dark:hover:text-[#FF750F] dark:hover:bg-[#2C2C2A] dark:hover:text-white md:dark:hover:bg-transparent transition-colors">Planes</a>
                            </li>
                            <li>
                                <Link href={login()} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hidden dark:text-white dark:hover:bg-[#2C2C2A]">Iniciar Sesión</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-white dark:from-[#1D0002]/20 dark:via-[#0a0a0a] dark:to-[#0a0a0a]"></div>
                    <div className="absolute right-0 top-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#FF750F]/20 to-[#FF4433]/20 blur-3xl opacity-50 dark:opacity-20 animate-pulse"></div>
                    <div className="absolute left-0 bottom-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl opacity-30 dark:opacity-10"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-orange-600 text-xs font-semibold uppercase tracking-wide dark:bg-[#1D0002] dark:border-[#3E3E3A] dark:text-[#FF750F]">
                            <Zap className="w-3 h-3 mr-1" /> By Outisoft
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                            Gestiona tu negocio <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF750F] to-[#FF4433]">Sin Límites.</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Ambar es la solución de punto de venta definitiva para emprendedores que buscan control total, reportes en tiempo real y la libertad de crecer sin complicaciones.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openTrialModal(null);
                                    }}
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all bg-[#FF750F] rounded-lg hover:bg-[#e0660d] hover:shadow-lg hover:-translate-y-1 focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-900"
                                >
                                    Comenzar Gratis
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Link>
                            <a
                                href="#beneficios"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-900 transition-all border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-orange-600 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-[#3E3E3A] dark:hover:bg-[#161615] dark:hover:text-[#FF750F]"
                            >
                                Descubrir Más
                            </a>
                        </div>
                        <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Sin tarjetas de crédito</div>
                            <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Cancelación inmediata</div>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
                        <div className="relative rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-white/5 dark:ring-white/10">
                            <div className="rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden dark:bg-[#161615] dark:ring-white/5">
                                {/* Decorative UI Mockup */}
                                <div className="aspect-[16/10] bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                                    {/* Background Grid */}
                                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.3 }}></div>

                                    {/* Abstract Dashboard Elements */}
                                    <div className="w-4/5 h-4/5 bg-white dark:bg-[#1C1C1A] rounded-lg shadow-lg border border-gray-100 dark:border-[#3E3E3A] p-4 flex flex-col gap-4 z-10">
                                        <div className="h-8 w-1/3 bg-gray-100 dark:bg-[#2C2C2A] rounded"></div>
                                        <div className="flex gap-4">
                                            <div className="flex-1 h-24 bg-orange-50 dark:bg-[#2C1A10] border border-orange-100 dark:border-orange-900/30 rounded flex items-center justify-center">
                                                <Activity className="text-[#FF750F]" />
                                            </div>
                                            <div className="flex-1 h-24 bg-gray-50 dark:bg-[#2C2C2A] rounded"></div>
                                            <div className="flex-1 h-24 bg-gray-50 dark:bg-[#2C2C2A] rounded"></div>
                                        </div>
                                        <div className="flex-1 bg-gray-50 dark:bg-[#2C2C2A] rounded border border-dashed border-gray-200 dark:border-[#3E3E3A]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="beneficios" className="py-24 bg-gray-50 dark:bg-[#161615]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
                            Todo lo que necesitas para <span className="text-[#FF750F]">triunfar</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Diseñado pensando en la velocidad y la eficiencia. Ambar transforma las operaciones diarias de tu negocio.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Benefit 1: Punto de venta rápido */}
                        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-[#3E3E3A] group">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Activity className="w-6 h-6 text-[#FF750F]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Punto de venta ágil y seguro</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Cobra en segundos con atajos de teclado (F12, Enter), diferentes métodos de pago, tickets listos para imprimir y control de cancelaciones y devoluciones.
                            </p>
                        </div>

                        {/* Benefit 2: Caja y cortes */}
                        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-[#3E3E3A] group">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Control de caja y cortes Z</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Lleva el control de aperturas, arqueos y cierres de caja. El sistema calcula sobrantes o faltantes y envía cortes diarios al correo del gerente.
                            </p>
                        </div>

                        {/* Benefit 3: Inventario y stock */}
                        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-[#3E3E3A] group">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Inventario por sucursal y alertas</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Controla existencias por sucursal, configura stock mínimo, recibe alertas de productos críticos y actualiza masivamente desde Excel en segundos.
                            </p>
                        </div>

                        {/* Benefit 4: Reportes y crédito */}
                        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-[#3E3E3A] group">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Utilidades, créditos y cuentas por cobrar</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Analiza ganancias reales por periodo y por producto, gestiona ventas a crédito, controla cuentas por cobrar y descarga reportes listos para compartir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plans Section (desde BD) */}
            {plans.length > 0 && (
                <section id="planes" className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-[#3E3E3A]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-4 mb-16">
                            <div className="text-center max-w-3xl mx-auto">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
                                    Planes pensados para <span className="text-[#FF750F]">cada etapa</span>
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    Elige el plan que mejor se adapta al tamaño y ritmo de tu negocio. Y obten un mes gratis al pagar anual.
                                </p>
                            </div>

                            {/* Switch Mensual / Anual */}
                            <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 p-1 text-xs font-medium text-gray-600 dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-gray-300">
                                <button
                                    type="button"
                                    onClick={() => setBillingPeriod('monthly')}
                                    className={`px-4 py-1 rounded-full transition-all ${
                                        billingPeriod === 'monthly'
                                            ? 'bg-white text-gray-900 shadow-sm dark:bg-[#0a0a0a] dark:text-white'
                                            : 'bg-transparent text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                    Mensual
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBillingPeriod('yearly')}
                                    className={`px-4 py-1 rounded-full transition-all ${
                                        billingPeriod === 'yearly'
                                            ? 'bg-white text-gray-900 shadow-sm dark:bg-[#0a0a0a] dark:text-white'
                                            : 'bg-transparent text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                    Anual
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {visiblePlans.map((plan) => {
                                const isBasic = plan.name.toLowerCase().includes('emprendedor');
                                const isPopular = plan.name.toLowerCase().includes('pro');
                                const isEnterprise = plan.name.toLowerCase().includes('empresarial');
                                const currency = plan.currency || 'MXN';
                                const formatter = new Intl.NumberFormat('es-MX', {
                                    style: 'currency',
                                    currency,
                                    maximumFractionDigits: 0,
                                });

                                let priceValue = plan.price;
                                let originalAnnualFormatted: string | null = null;
                                let discountLabel: string | null = null;

                                if (billingPeriod === 'yearly') {
                                    // Tomamos el precio anual de la BD como "precio base" y aplicamos descuento en Pro/Empresarial
                                    originalAnnualFormatted = formatter.format(plan.price);

                                    if (isPopular) {
                                        priceValue = plan.price * 0.95; // 5% OFF
                                        discountLabel = '5% OFF anual';
                                    } else if (isEnterprise) {
                                        priceValue = plan.price * 0.9; // 10% OFF
                                        discountLabel = '10% OFF anual';
                                    } else {
                                        priceValue = plan.price; // Básico sin descuento
                                    }
                                }

                                const price = formatter.format(priceValue);

                                const cardBaseClasses = 'relative p-8 rounded-2xl flex flex-col';
                                let cardStyleClasses = 'bg-gray-50 dark:bg-[#161615] shadow-sm border border-gray-200 dark:border-[#3E3E3A]';

                                if (isPopular) {
                                    cardStyleClasses = 'bg-white dark:bg-[#161615] shadow-[0_20px_50px_rgba(15,23,42,0.25)] border border-[#FF750F]/40';
                                } else if (isBasic) {
                                    cardStyleClasses = 'bg-white dark:bg-[#0a0a0a] shadow-md border border-[#FF750F]/25';
                                }

                                return (
                                    <div key={plan.id} className={`${cardBaseClasses} ${cardStyleClasses}`}>
                                        {isPopular && (
                                            <div className="absolute -top-3 right-6">
                                                <span className="inline-flex items-center rounded-full bg-[#FF750F] text-white px-3 py-1 text-xs font-semibold shadow-md">
                                                    Más popular
                                                </span>
                                            </div>
                                        )}

                                        {!isPopular && isBasic && (
                                            <div className="absolute -top-3 right-6">
                                                <span className="inline-flex items-center rounded-full bg-orange-50 text-orange-700 dark:bg-[#1D0002] dark:text-[#FF750F] px-3 py-1 text-xs font-semibold shadow-sm">
                                                    Ideal para comenzar
                                                </span>
                                            </div>
                                        )}

                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            {isEnterprise
                                                ? 'Diseñado para cadenas con múltiples sucursales y equipos grandes.'
                                                : isPopular
                                                    ? 'Para negocios en crecimiento con más puntos de venta.'
                                                    : 'Ideal para pequeños negocios que están comenzando.'}
                                        </p>
                                        <div className="mb-4 flex flex-col gap-1">
                                            {billingPeriod === 'yearly' && originalAnnualFormatted && (
                                                <div className="flex items-baseline gap-2 text-xs">
                                                    <span className="line-through text-gray-400 dark:text-gray-500">
                                                        {originalAnnualFormatted}
                                                    </span>
                                                    {discountLabel && (
                                                        <span className="uppercase font-semibold text-emerald-600 dark:text-emerald-400">
                                                            {discountLabel}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{price}</span>
                                                <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{currency}</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {billingPeriod === 'monthly'
                                                        ? `/ ${plan.duration_in_days} días`
                                                        : '/ 12 meses'}
                                                </span>
                                            </div>
                                        </div>
                                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 flex-1">
                                            <li className="flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />{' '}
                                                {plan.max_users ? `Hasta ${plan.max_users} usuarios` : 'Usuarios ilimitados'}
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />{' '}
                                                {plan.max_branches ? `Hasta ${plan.max_branches} sucursales` : 'Sucursales ilimitadas'}
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />{' '}
                                                {plan.max_products ? `Hasta ${plan.max_products} productos` : 'Productos ilimitados'}
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                                {isEnterprise
                                                    ? 'Soporte prioritario y reportes ejecutivos'
                                                    : isPopular
                                                        ? 'Reportes avanzados y cortes'
                                                        : 'Reportes básicos de ventas'}
                                            </li>
                                        </ul>
                                        <div className="mt-6 flex flex-col gap-3">
                                            <button
                                                type="button"
                                                onClick={() => openTrialModal(plan)}
                                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-[#FF750F] text-white hover:bg-[#e0660d] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                            >
                                                Solicitar prueba gratis
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonial / Social Proof (Simplified) */}
            <section className="py-20 border-t border-gray-100 dark:border-[#3E3E3A] bg-white dark:bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-8 dark:text-white">Confían en nosotros</h2>
                    <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                        {/* Placeholder Logos */}
                        <div className="flex items-center space-x-2 font-bold text-xl text-gray-400 dark:text-gray-600 select-none">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <span>Empresa A</span>
                        </div>
                        <div className="flex items-center space-x-2 font-bold text-xl text-gray-400 dark:text-gray-600 select-none">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <span>Mercado B</span>
                        </div>
                        <div className="flex items-center space-x-2 font-bold text-xl text-gray-400 dark:text-gray-600 select-none">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <span>Tienda C</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-[#1b1b18] to-black dark:from-[#161615] dark:to-[#0a0a0a] text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para modernizar tu negocio?</h2>
                    <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                        Únete a los cientos de negocios que ya están optimizando sus ventas con Ambar.
                    </p>
                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                openTrialModal(null);
                            }}
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#1b1b18] bg-white rounded-lg hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                        >
                            Solicita una Cuenta Gratis
                        </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-[#3E3E3A] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded bg-[#FF750F] flex items-center justify-center">
                            <AppLogoIcon className="size-6 fill-current text-white" />
                        </div>
                        <span className="text-xl font-bold dark:text-white">Ambar</span>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <a href={route('privacy.show')} className="hover:text-[#FF750F] transition-colors">Política de Privacidad</a>
                        <a href={route('terms.show')} className="hover:text-[#FF750F] transition-colors">Términos y Condiciones</a>
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-600">
                        &copy; {new Date().getFullYear()} Ambar PDV. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* Botón flotante de WhatsApp */}
            <a
                href="https://wa.me/529841786031?text=Hola%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Ambar%20PDV"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:bg-[#1ebe5d] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-background"
                aria-label="Contactar por WhatsApp"
            >
                <MessageCircle className="w-6 h-6" />
            </a>

            {isTrialModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 relative">
                        <button
                            type="button"
                            onClick={closeTrialModal}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                            Solicitar prueba gratis
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Déjanos tus datos y nos pondremos en contacto contigo para activar tu periodo de prueba.
                        </p>

                        {selectedPlan && (
                            <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                                Plan seleccionado: <span className="font-semibold">{selectedPlan.name}</span>
                            </div>
                        )}

                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                postTrial(route('trial-requests.store'), {
                                    onSuccess: () => {
                                        closeTrialModal();
                                    },
                                });
                            }}
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    value={trialData.name}
                                    onChange={(e) => setTrialData('name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#3E3E3A] bg-white dark:bg-[#161615] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF750F] focus:border-transparent"
                                    placeholder="Ej. Juan Pérez"
                                />
                                {trialErrors.name && (
                                    <p className="mt-1 text-xs text-red-500">{trialErrors.name}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Correo electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={trialData.email}
                                        onChange={(e) => setTrialData('email', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-[#3E3E3A] bg-white dark:bg-[#161615] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF750F] focus:border-transparent"
                                        placeholder="tucorreo@ejemplo.com"
                                    />
                                    {trialErrors.email && (
                                        <p className="mt-1 text-xs text-red-500">{trialErrors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        value={trialData.phone}
                                        onChange={(e) => setTrialData('phone', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-[#3E3E3A] bg-white dark:bg-[#161615] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF750F] focus:border-transparent"
                                        placeholder="Ej. +52 55 1234 5678"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nombre del negocio
                                </label>
                                <input
                                    type="text"
                                    value={trialData.business_name}
                                    onChange={(e) => setTrialData('business_name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#3E3E3A] bg-white dark:bg-[#161615] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF750F] focus:border-transparent"
                                    placeholder="Ej. Tienda La Esquina"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Comentarios adicionales (opcional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={trialData.notes}
                                    onChange={(e) => setTrialData('notes', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-[#3E3E3A] bg-white dark:bg-[#161615] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF750F] focus:border-transparent resize-none"
                                    placeholder="Cuéntanos brevemente sobre tu negocio o dudas que tengas."
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeTrialModal}
                                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-[#3E3E3A] dark:text-gray-200 dark:hover:bg-[#161615]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={trialProcessing}
                                    className="px-4 py-2 text-sm font-medium rounded-lg bg-[#FF750F] text-white hover:bg-[#e0660d] shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {trialProcessing ? 'Enviando...' : 'Enviar solicitud'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
