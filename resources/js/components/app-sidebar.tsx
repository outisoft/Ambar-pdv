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
import { BookOpen, Folder, LayoutDashboard, LayoutGrid, Settings, UsersRound, Building2, MapPinHouse, History, Box, CreditCard } from 'lucide-react';
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
];

const footerNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/users',
        icon: UsersRound,
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
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="space-y-2">
                    <ThemeSwitch />
                    <NavFooter items={footerNavItems} className="mt-2" />
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
