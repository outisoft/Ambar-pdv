import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface AppNotificationData {
    title?: string;
    message?: string;
    stock?: number;
    product_id?: number;
    branch_id?: number;
    action_url?: string;
    icon?: string;
    color?: string;
    [key: string]: unknown;
}

export interface AppNotification {
    id: string;
    type: string;
    data: AppNotificationData;
    created_at: string;
    read_at: string | null;
    [key: string]: unknown;
}

export interface Auth {
    user: User;
    notifications?: AppNotification[];
    unreadCount?: number;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    roles: string[]; // Array de strings
    permissions: string[]; // Array de strings
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    company?: { id: number; name: string };
    branch?: { id: number; name: string };
    [key: string]: unknown; // This allows for additional properties...
}

export type Product = {
    id: number;
    name: string;
    barcode?: string;
    description?: string;
    price: number;
    stock: number;
    min_stock: number;
    // Añade otros campos si los tienes
};

// Un item del carrito es un Producto + una cantidad
export type CartItem = Product & {
    quantity: number;
};

export interface Client {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    tax_id?: string;
    address?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: Auth;
    [key: string]: unknown;
};
