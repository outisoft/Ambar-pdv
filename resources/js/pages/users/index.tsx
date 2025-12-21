import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, User } from '@/types';
import { Plus, Pencil, Trash2, Shield, Building2, Store, Search, MoreHorizontal, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge'; // Warning: Verify Badge existence or use custom span style if missing
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Extendemos el tipo User para incluir las relaciones que vienen del backend
interface UserWithRelations extends Omit<User, 'roles'> {
    roles: { name: string }[];
    branch?: { name: string };
    company?: { name: string };
}

interface Props extends PageProps {
    users: {
        data: UserWithRelations[];
        links: any[]; // Pagination links
    };
}

export default function Index({ auth, users }: Props) {

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
            router.delete(route('users.destroy', id));
        }
    };

    const getRoleBadgeVariant = (roleName: string) => {
        switch (roleName) {
            case 'super-admin': return 'default'; // dark/primary
            case 'gerente': return 'secondary'; // gray/secondary
            case 'cajero': return 'outline'; // clear
            default: return 'outline';
        }
    };

    const getRoleBadgeColorClass = (roleName: string) => {
        switch (roleName) {
            case 'super-admin': return 'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100';
            case 'gerente': return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100';
            case 'cajero': return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
            default: return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100';
        }
    }


    return (
        <AuthenticatedLayout breadcrumbs={[{ title: 'Users', href: '/users' }]}>
            <Head title="Usuarios" />

            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Usuarios
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Administra los accesos y roles del equipo.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar usuario..."
                                className="pl-9 w-full md:w-[250px]"
                            />
                        </div>
                        <Link href={route('users.create')}>
                            <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground transition-colors bg-primary rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Usuario
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[300px]">Usuario</TableHead>
                                <TableHead>Rol</TableHead>
                                {auth.user.roles.includes('super-admin') && (
                                    <TableHead>Empresa</TableHead>
                                )}
                                <TableHead>Sucursal</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No se encontraron usuarios registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColorClass(user.roles[0]?.name || '')}`}>
                                                <Shield className="w-3 h-3 mr-1" />
                                                {user.roles[0]?.name || 'Sin rol'}
                                            </span>
                                        </TableCell>
                                        {auth.user.roles.includes('super-admin') && (
                                            <TableCell>
                                                {user.company ? (
                                                    <div className="flex items-center gap-2 text-sm text-foreground">
                                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                                        {user.company.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic text-xs">---</span>
                                                )}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            {user.branch ? (
                                                <div className="flex items-center gap-2 text-sm text-foreground">
                                                    <Store className="w-4 h-4 text-muted-foreground" />
                                                    {user.branch.name}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">Global / Ninguna</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('users.edit', user.id)} className="cursor-pointer">
                                                            <Pencil className="w-4 h-4 mr-2" /> Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(user.id)}
                                                        className="cursor-pointer text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}