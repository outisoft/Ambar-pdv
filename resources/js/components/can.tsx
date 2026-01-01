import { ReactNode } from 'react';
import { usePermission } from '@/hooks/use-permission';

interface CanProps {
    permission?: string | string[];
    role?: string | string[];
    children: ReactNode;
}

export default function Can({ permission, role, children }: CanProps) {
    const { hasPermission, hasAnyPermission, hasRole, hasAnyRole } = usePermission();

    if (permission) {
        if (Array.isArray(permission)) {
            if (!hasAnyPermission(permission)) return null;
        } else {
            if (!hasPermission(permission)) return null;
        }
    }

    if (role) {
        if (Array.isArray(role)) {
            if (!hasAnyRole(role)) return null;
        } else {
            if (!hasRole(role)) return null;
        }
    }

    return <>{children}</>;
}
