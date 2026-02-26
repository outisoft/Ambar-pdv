import ConfirmDeleteModal from '@/components/confirm-delete-modal';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Download, Trash2 } from 'lucide-react';
import { useState } from 'react';

type BackupType = 'full' | 'db' | 'files';

type BackupEntry = {
    path: string;
    date: string;
    size_in_bytes: number;
};

type Destination = {
    disk: string;
    is_reachable: boolean;
    total_size_in_bytes: number;
    backups: BackupEntry[];
};

type BackupsPageProps = PageProps<{
    backupName: string;
    destinations: Destination[];
}>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Backups',
        href: '/settings/backups',
    },
];

function formatBytes(bytes: number): string {
    if (bytes <= 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1,
    );
    const value = bytes / 1024 ** index;

    return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

export default function Backups({ backupName, destinations }: BackupsPageProps) {
    const [runningType, setRunningType] = useState<BackupType | null>(null);
    const [deletingKey, setDeletingKey] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [backupToDelete, setBackupToDelete] = useState<{
        disk: string;
        path: string;
    } | null>(null);

    const runBackup = (type: BackupType) => {
        setRunningType(type);

        router.post(
            route('settings.backups.run'),
            { type },
            {
                preserveScroll: true,
                onFinish: () => setRunningType(null),
            },
        );
    };

    const downloadBackup = (disk: string, path: string) => {
        window.location.href = route('settings.backups.download', {
            disk,
            path,
        });
    };

    const openDeleteModal = (disk: string, path: string) => {
        setBackupToDelete({ disk, path });
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setBackupToDelete(null);
    };

    const confirmDeleteBackup = () => {
        if (!backupToDelete) {
            return;
        }

        const key = `${backupToDelete.disk}:${backupToDelete.path}`;
        setDeletingKey(key);

        router.delete(route('settings.backups.destroy'), {
            data: { disk: backupToDelete.disk, path: backupToDelete.path },
            preserveScroll: true,
            onFinish: () => {
                setDeletingKey(null);
                closeDeleteModal();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Backups" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Backups"
                        description="Ejecuta respaldos y revisa el estado actual de almacenamiento."
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>Ejecutar respaldo</CardTitle>
                            <CardDescription>
                                Nombre configurado: {backupName}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Button
                                onClick={() => runBackup('full')}
                                disabled={runningType !== null}
                            >
                                {runningType === 'full'
                                    ? 'Ejecutando...'
                                    : 'Backup completo'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => runBackup('db')}
                                disabled={runningType !== null}
                            >
                                {runningType === 'db'
                                    ? 'Ejecutando...'
                                    : 'Solo base de datos'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => runBackup('files')}
                                disabled={runningType !== null}
                            >
                                {runningType === 'files'
                                    ? 'Ejecutando...'
                                    : 'Solo archivos'}
                            </Button>
                        </CardContent>
                    </Card>

                    {destinations.map((destination) => (
                        <Card key={destination.disk}>
                            <CardHeader>
                                <CardTitle>Disco: {destination.disk}</CardTitle>
                                <CardDescription>
                                    Estado:{' '}
                                    {destination.is_reachable
                                        ? 'Conectado'
                                        : 'No disponible'}{' '}
                                    · Uso total:{' '}
                                    {formatBytes(destination.total_size_in_bytes)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {destination.backups.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No hay respaldos disponibles en este disco.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {destination.backups.map((backup) => (
                                            <div
                                                key={`${destination.disk}:${backup.path}`}
                                                className="rounded-lg border p-3"
                                            >
                                                <p className="text-sm font-medium">
                                                    {backup.path}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Fecha: {backup.date} · Tamaño:{' '}
                                                    {formatBytes(
                                                        backup.size_in_bytes,
                                                    )}
                                                </p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            downloadBackup(
                                                                destination.disk,
                                                                backup.path,
                                                            )
                                                        }
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Descargar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                destination.disk,
                                                                backup.path,
                                                            )
                                                        }
                                                        disabled={
                                                            deletingKey ===
                                                            `${destination.disk}:${backup.path}`
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {deletingKey ===
                                                        `${destination.disk}:${backup.path}`
                                                            ? 'Eliminando...'
                                                            : 'Eliminar'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </SettingsLayout>

            <ConfirmDeleteModal
                open={showDeleteModal}
                itemName={backupToDelete?.path}
                confirming={Boolean(
                    backupToDelete &&
                        deletingKey ===
                            `${backupToDelete.disk}:${backupToDelete.path}`,
                )}
                onCancel={closeDeleteModal}
                onConfirm={confirmDeleteBackup}
            />
        </AppLayout>
    );
}
