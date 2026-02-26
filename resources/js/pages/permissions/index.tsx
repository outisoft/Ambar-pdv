
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

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    roles_count: number;
    created_at: string;
    updated_at: string;
}

interface PermissionsIndexProps {
    permissions: Permission[];
}

export default function PermissionsIndex({ permissions }: PermissionsIndexProps) {
    const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (permissionToDelete) {
            setIsDeleting(true);
            router.delete(route('permissions.destroy', permissionToDelete.id), {
                onFinish: () => {
                    setIsDeleting(false);
                    setPermissionToDelete(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <AppShell>
                <Head title="Permissions" />

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
                        <Link
                            href={route('roles.index')}
                            className={cn(
                                'flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                                'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                            )}
                        >
                            <Shield className="h-4 w-4" />
                            <span>Roles</span>
                        </Link>
                        <Link
                            href={route('permissions.index')}
                            className={cn(
                                'flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                                'bg-white shadow-sm dark:bg-neutral-700 dark:text-white'
                            )}
                        >
                            <Users className="h-4 w-4" />
                            <span>Permissions</span>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Link href={route('permissions.create')} className={buttonVariants()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Permission
                            </Link>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Permission Name</TableHead>
                                        <TableHead>Guard</TableHead>
                                        <TableHead>Roles</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.map((permission) => (
                                        <TableRow key={permission.id}>
                                            <TableCell className="font-medium">{permission.name}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                    {permission.guard_name}
                                                </span>
                                            </TableCell>
                                            <TableCell>{permission.roles_count}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={route('permissions.edit', permission.id)}
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
                                                        onClick={() => setPermissionToDelete(permission)}
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
                </div>

                <ConfirmDeleteModal
                    open={!!permissionToDelete}
                    itemName={permissionToDelete?.name}
                    onCancel={() => setPermissionToDelete(null)}
                    onConfirm={handleDelete}
                    title="Delete Permission?"
                    confirming={isDeleting}
                />
            </AppShell>
        </AuthenticatedLayout>
    );
}
