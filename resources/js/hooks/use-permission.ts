import { usePage } from '@inertiajs/react';
import { PageProps, User } from '@/types';

export function usePermission() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    /**
     * Check if the user has a specific permission.
     */
    const hasPermission = (permission: string): boolean => {
        if (!user || !user.permissions) return false;
        // Admin usually acts as super-admin, but check your logic.
        // If you have a 'Super Admin' role that bypasses everything:
        if (user.roles && user.roles.includes('Super Admin')) return true;

        return user.permissions.includes(permission);
    };

    /**
     * Check if the user has any of the given permissions.
     */
    const hasAnyPermission = (permissions: string[]): boolean => {
        if (!user || !user.permissions) return false;
        if (user.roles && user.roles.includes('Super Admin')) return true;

        return permissions.some((p) => user.permissions.includes(p));
    };

    /**
     * Check if the user has a specific role.
     */
    const hasRole = (role: string): boolean => {
        if (!user || !user.roles) return false;
        return user.roles.includes(role);
    };

    /**
     * Check if the user has any of the given roles.
     */
    const hasAnyRole = (roles: string[]): boolean => {
        if (!user || !user.roles) return false;
        return roles.some((r) => user.roles.includes(r));
    };

    return { user, hasPermission, hasAnyPermission, hasRole, hasAnyRole };
}
