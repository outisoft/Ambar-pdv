import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { ThemeSwitch } from '@/components/theme-switch';
import { usePermission } from '@/hooks/use-permission';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutDashboard, LayoutGrid, Settings, UsersRound, Building2, MapPinHouse, History, Box, CreditCard, Shield, Banknote } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'POS',
        href: '/pos',
        icon: CreditCard,
        permissions: ['view_pos'],
    },
    {
        title: 'Products',
        href: '/products',
        icon: Box,
        permissions: ['view_products'],
    },
    {
        title: 'Sales',
        href: '/sales',
        icon: Banknote,
        permissions: ['view_sales'],
    },
    {
        title: 'History',
        href: '/cash-registers/history',
        icon: History,
        permissions: ['view_cash_registers'],
    },
    {
        title: 'Inventory',
        href: '/inventory',
        icon: Folder,
        permissions: ['view_inventory'],
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BookOpen,
        permissions: ['view_reports'],
    },
    {
        title: 'Clients',
        href: '/clients',
        icon: LayoutGrid,
        permissions: ['view_clients'],
    },
    {
        title: 'Accounts Receivable',
        href: '/accounts-receivable',
        icon: CreditCard,
        permissions: ['view_clients'],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/users',
        icon: UsersRound,
        permissions: ['view_users'],
    },
    {
        title: 'Roles & Permissions',
        href: '/roles',
        icon: Shield,
        permissions: ['view_roles'],
    },
    {
        title: 'Companies',
        href: '/companies',
        icon: Building2,
        permissions: ['view_companies'],
    },
    {
        title: 'Branches',
        href: '/branches',
        icon: MapPinHouse,
        permissions: ['view_branches'],
    },
    {
        title: 'Settings',
        href: '/configuracion',
        icon: Settings,
        permissions: ['view_settings'],
    },
];

export function AppSidebar() {
    const { hasPermission, hasRole } = usePermission();

    // Filter items based on permissions/roles
    const filterNavItems = (items: NavItem[]) => {
        return items.filter((item) => {
            // If explicit roles defined
            if (item.roles && item.roles.length > 0) {
                // If user doesn't have any of the required roles, hide
                // (Unless you want ALL roles, but usually it's OR)
                // For safety, let's assume if roles are present, must match one
                // But wait, the hook supports checking roles.
                // Let's implement OR logic: match ANY role
                const matchesRole = item.roles.some(r => hasRole(r));
                if (!matchesRole) return false;
            }

            // If explicit permissions defined
            if (item.permissions && item.permissions.length > 0) {
                const matchesPermission = item.permissions.some(p => hasPermission(p));
                if (!matchesPermission) return false;
            }

            return true;
        });
    };

    const filteredMainNav = filterNavItems(mainNavItems);
    const filteredFooterNav = filterNavItems(footerNavItems);

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch className="flex items-center gap-3">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF750F] to-[#FF4433] text-sidebar-primary-foreground">
                                    <LayoutDashboard className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Ambar<span className="text-[#FF750F]">.</span></span>
                                    <span className="truncate text-xs">Punto de Venta</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNav} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={filteredFooterNav} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
