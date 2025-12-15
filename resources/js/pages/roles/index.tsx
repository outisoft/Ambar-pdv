import { AppShell } from '@/components/app-shell';
import { ConfirmDeleteModal } from '@/components/confirm-delete-modal';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AuthenticatedLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import {
    Edit,
    Plus,
    Shield,
    Trash2,
    Users
} from 'lucide-react';
import { useState } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    users_count: number;
    created_at: string;
    updated_at: string;
}

interface RolesIndexProps {
    roles: Role[];
}

export default function RolesIndex({ roles }: RolesIndexProps) {
    const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles & Permissions',
            href: '/roles',
        },
    ];

    const handleDelete = () => {
        if (roleToDelete) {
            setIsDeleting(true);
            router.delete(route('roles.destroy', roleToDelete.id), {
                onFinish: () => {
                    setIsDeleting(false);
                    setRoleToDelete(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <AppShell>
                <Head title="Roles & Permissions" />

                <div className="flex h-full flex-col space-y-4 p-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight">Access Control</h2>
                            <p className="text-muted-foreground">
                                Manage roles and permissions for your team.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800 w-fit">
                        <button
                            onClick={() => setActiveTab('roles')}
                            className={cn(
                                'flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                                activeTab === 'roles'
                                    ? 'bg-white shadow-sm dark:bg-neutral-700 dark:text-white'
                                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                            )}
                        >
                            <Shield className="h-4 w-4" />
                            <span>Roles</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('permissions')}
                            className={cn(
                                'flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                                activeTab === 'permissions'
                                    ? 'bg-white shadow-sm dark:bg-neutral-700 dark:text-white'
                                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                            )}
                        >
                            <Users className="h-4 w-4" />
                            <span>Permissions</span>
                        </button>
                    </div>

                    {activeTab === 'roles' ? (
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <Link href={route('roles.create')} className={buttonVariants()}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Role
                                </Link>
                            </div>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Role Name</TableHead>
                                            <TableHead>Guard</TableHead>
                                            <TableHead>Users</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {roles.map((role) => (
                                            <TableRow key={role.id}>
                                                <TableCell className="font-medium">{role.name}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                        {role.guard_name}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{role.users_count}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            href={route('roles.edit', role.id)}
                                                            className={cn(
                                                                buttonVariants({ variant: 'ghost', size: 'icon' }),
                                                                "h-8 w-8 text-muted-foreground hover:text-primary"
                                                            )}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                            onClick={() => setRoleToDelete(role)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed text-center animate-in fade-in-50">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Users className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">Permissions</h3>
                            <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                                Configure granular permissions for your roles. This view is currently under construction.
                            </p>
                        </div>
                    )}
                </div>

                <ConfirmDeleteModal
                    open={!!roleToDelete}
                    onOpenChange={() => setRoleToDelete(null)}
                    onConfirm={handleDelete}
                    title="Delete Role?"
                    description={
                        <span>
                            Are you sure you want to delete the role <span className="font-medium text-foreground">{roleToDelete?.name}</span>? This action cannot be undone.
                        </span>
                    }
                    processing={isDeleting}
                />
            </AppShell>
        </AuthenticatedLayout>
    );
}
