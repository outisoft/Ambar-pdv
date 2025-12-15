
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions?: Permission[];
}

interface RoleEditProps {
    role: Role;
    permissions: Permission[];
}

export default function RoleEdit({ role, permissions }: RoleEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        guard_name: role.guard_name,
        permissions: role.permissions?.map((p) => p.id) || [] as number[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    const togglePermission = (permissionId: number) => {
        const currentPermissions = new Set(data.permissions);
        if (currentPermissions.has(permissionId)) {
            currentPermissions.delete(permissionId);
        } else {
            currentPermissions.add(permissionId);
        }
        setData('permissions', Array.from(currentPermissions));
    };

    const allSelected = permissions.length > 0 && data.permissions.length === permissions.length;

    const toggleAll = () => {
        if (allSelected) {
            setData('permissions', []);
        } else {
            setData('permissions', permissions.map((p) => p.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <AppShell>
                <Head title="Edit Role" />

                <div className="flex h-full flex-col space-y-4 p-8">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('roles.index')}
                            className="rounded-full bg-neutral-100 p-2 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight">Edit Role</h2>
                            <p className="text-muted-foreground">
                                Modify the role and update permissions.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-4xl space-y-4">
                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Role Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. manager"
                                        required
                                        autoFocus
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        The unique name for this role.
                                    </p>
                                </div>
                            </form>
                        </div>

                        <div className="rounded-lg border bg-card p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-medium">Permissions</h3>
                                {permissions.length > 0 && (
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="select-all"
                                            checked={allSelected}
                                            onCheckedChange={toggleAll}
                                        />
                                        <label
                                            htmlFor="select-all"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Select All
                                        </label>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={data.permissions.includes(permission.id)}
                                            onCheckedChange={() => togglePermission(permission.id)}
                                        />
                                        <label
                                            htmlFor={`permission-${permission.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {permission.name}
                                        </label>
                                    </div>
                                ))}
                                {permissions.length === 0 && (
                                    <p className="col-span-full text-sm text-muted-foreground">
                                        No permissions available. Create permissions first.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Link
                                href={route('roles.index')}
                                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Cancel
                            </Link>
                            <Button onClick={submit} disabled={processing}>
                                {processing && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Role
                            </Button>
                        </div>
                    </div>
                </div>
            </AppShell>
        </AuthenticatedLayout>
    );
}
