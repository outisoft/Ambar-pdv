import { Breadcrumbs } from '@/components/breadcrumbs';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const user = auth?.user;
    const notifications = auth?.notifications ?? [];
    const unreadCount = auth?.unreadCount ?? 0;
    const displayName = user ? (user.company?.name ?? user.name) : '';

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {user && (
                <div className="ml-auto flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <AppearanceToggleDropdown />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="relative inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
                                aria-label="Notificaciones"
                            >
                                <Bell className="h-4 w-4" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <div className="flex items-center justify-between px-2 py-1.5 border-b">
                                <span className="text-xs font-semibold text-muted-foreground">
                                    Notificaciones
                                </span>
                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.post(route('notifications.readAll'), {}, {
                                                preserveScroll: true,
                                            })
                                        }
                                        className="text-[11px] font-medium text-primary hover:underline"
                                    >
                                        Marcar todas como leídas
                                    </button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto py-1">
                                {notifications.length > 0 ? (
                                    notifications.map((notification: any) => {
                                        const data = notification.data || {};
                                        const handleItemClick = () => {
                                            // Al hacer clic en toda la notificación:
                                            // 1) marcar como leída
                                            // 2) navegar al action_url si existe
                                            router.post(
                                                route('notifications.read', notification.id),
                                                {},
                                                {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        if (data.action_url) {
                                                            router.visit(data.action_url as string);
                                                        }
                                                    },
                                                },
                                            );
                                        };

                                        return (
                                            <DropdownMenuItem
                                                key={notification.id}
                                                onClick={handleItemClick}
                                                className="flex items-start gap-2 px-2 py-2 focus:bg-muted cursor-pointer"
                                            >
                                                <div className="mt-0.5 h-2 w-2 rounded-full bg-orange-500" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-foreground">
                                                        {data.title || 'Notificación'}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                                                        {data.message}
                                                    </p>
                                                    <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                                                        <span>
                                                            {formatDistanceToNow(new Date(notification.created_at), {
                                                                addSuffix: true,
                                                                locale: es,
                                                            })}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.post(
                                                                    route('notifications.read', notification.id),
                                                                    {},
                                                                    { preserveScroll: true },
                                                                );
                                                            }}
                                                            className="text-[11px] font-medium text-primary hover:underline"
                                                        >
                                                            Marcar leída
                                                        </button>
                                                    </div>
                                                </div>
                                            </DropdownMenuItem>
                                        );
                                    })
                                ) : (
                                    <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                                        No tienes notificaciones pendientes.
                                    </div>
                                )}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <span>{displayName}</span>
                </div>
            )}
        </header>
    );
}
