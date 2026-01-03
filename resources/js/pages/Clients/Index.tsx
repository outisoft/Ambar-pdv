// resources/js/Pages/Clients/Index.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import Can from '@/components/can';
import { PageProps, Client } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { User, Plus, Search, Pencil, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type ClientIndexProps = PageProps & {
    clients: Client[];
};

export default function Index({ auth, clients }: ClientIndexProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    const openDeleteModal = (client: Client) => {
        setClientToDelete(client);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setClientToDelete(null);
    };

    const confirmDelete = () => {
        if (clientToDelete) {
            router.delete(route('clients.destroy', clientToDelete.id), {
                onSuccess: () => toast.success('Cliente eliminado correctamente.'),
                onError: () => toast.error('No se pudo eliminar el cliente.'),
                onFinish: () => cancelDelete(),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Clientes" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Clientes
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona tu base de datos de clientes.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar cliente..."
                                className="pl-9 w-full md:w-[250px]"
                            />
                        </div>
                        <Can permission="create_clients">
                            <Link href={route('clients.create')}>
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Cliente
                                </Button>
                            </Link>
                        </Can>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[300px]">Cliente</TableHead>
                                <TableHead>Contacto</TableHead>
                                <TableHead>Ubicación</TableHead>
                                <TableHead>Limit Credit</TableHead>
                                <TableHead>Current Balance</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No se encontraron clientes registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                                                    {client.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">{client.name}</div>
                                                    {client.tax_id && (
                                                        <div className="text-xs text-muted-foreground">
                                                            RUT/DNI: {client.tax_id}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-sm">
                                                {client.email && (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Mail className="w-3 h-3" /> {client.email}
                                                    </div>
                                                )}
                                                {client.phone && (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Phone className="w-3 h-3" /> {client.phone}
                                                    </div>
                                                )}
                                                {!client.email && !client.phone && <span className="text-muted-foreground italic">Sin contacto</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {client.address ? (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="w-3 h-3" /> {client.address}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic text-sm">--</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {client.credit_limit != null ? (
                                                <Badge variant="secondary">
                                                    ${Number(client.credit_limit || 0).toFixed(2)}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground italic text-sm">--</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {client.current_balance != null ? (
                                                <Badge
                                                    variant={
                                                        (client.current_balance || 0) > 0
                                                            ? 'destructive'
                                                            : 'default'
                                                    }
                                                >
                                                    ${Number(client.current_balance || 0).toFixed(2)}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground italic text-sm">--</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Can permission="edit_clients">
                                                    <Link href={route('clients.edit', client.id)}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </Can>
                                                <Can permission="delete_clients">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => openDeleteModal(client)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </Can>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-foreground">
                            Confirmar eliminación
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            ¿Seguro que deseas eliminar a{' '}
                            <span className="font-medium text-foreground">
                                {clientToDelete?.name}
                            </span>
                            ? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" onClick={cancelDelete}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
