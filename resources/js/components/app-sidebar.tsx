import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { ThemeSwitch } from '@/components/theme-switch';
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
import { BookOpen, Folder, LayoutDashboard, LayoutGrid, Settings, UsersRound, Building2, MapPinHouse, History, Box, CreditCard, Shield } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    //validacion si su rol tiene acceso a cada item
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
        roles: ['admin'],
    },
    {
        title: 'POS',
        href: '/pos',
        icon: CreditCard,
    },
    {
        title: 'Products',
        href: '/products',
        icon: Box,
        roles: ['admin'],
    },
    {
        title: 'Sales',
        href: '/sales',
        icon: History,
    },
    {
        title: 'History',
        href: '/cash-registers/history',
        icon: History,
    },
    {
        title: 'Inventory',
        href: '/inventory',
        icon: Folder,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/users',
        icon: UsersRound,
    },
    {
        title: 'Roles & Permissions',
        href: '/roles',
        icon: Shield,
    },
    {
        title: 'Companies',
        href: '/companies',
        icon: Building2, //companies
    },
    {
        title: 'Branches',
        href: '/branches',
        icon: MapPinHouse, //branches
    },
    {
        title: 'Settings',
        href: '/configuracion',
        icon: Settings,
    },
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
