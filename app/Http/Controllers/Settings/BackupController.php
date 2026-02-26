<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Backup\BackupDestination\BackupDestination;
use Throwable;

class BackupController extends Controller
{
    public function index(): Response
    {
        $backupName = config('backup.backup.name');
        $disks = config('backup.backup.destination.disks', []);

        $destinations = collect($disks)
            ->map(function (string $disk) use ($backupName): array {
                $destination = BackupDestination::create($disk, $backupName);
                $backups = $destination->backups()->map(function ($backup): array {
                    return [
                        'path' => $backup->path(),
                        'date' => $backup->date()->toDateTimeString(),
                        'size_in_bytes' => (int) $backup->sizeInBytes(),
                    ];
                })->values();

                return [
                    'disk' => $disk,
                    'is_reachable' => $destination->isReachable(),
                    'total_size_in_bytes' => (int) $destination->usedStorage(),
                    'backups' => $backups,
                ];
            })
            ->values();

        return Inertia::render('settings/backups', [
            'backupName' => $backupName,
            'destinations' => $destinations,
        ]);
    }

    public function run(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:full,db,files'],
        ]);

        $options = [
            '--disable-notifications' => true,
        ];

        if ($validated['type'] === 'db') {
            $options['--only-db'] = true;
        }

        if ($validated['type'] === 'files') {
            $options['--only-files'] = true;
        }

        try {
            Artisan::call('backup:run', $options);

            return back()->with('success', 'Backup ejecutado correctamente.');
        } catch (Throwable $exception) {
            report($exception);

            return back()->with('error', 'No se pudo ejecutar el backup. Revisa logs para más detalles.');
        }
    }

    public function download(Request $request)
    {
        ['disk' => $disk, 'path' => $path] = $this->validatedBackupFile($request);

        $filesystem = Storage::disk($disk);

        abort_unless($filesystem->exists($path), 404);

        $stream = $filesystem->readStream($path);

        abort_unless(is_resource($stream), 500);

        return response()->streamDownload(function () use ($stream): void {
            fpassthru($stream);

            if (is_resource($stream)) {
                fclose($stream);
            }
        }, basename($path), [
            'Content-Type' => 'application/octet-stream',
        ]);
    }

    public function destroy(Request $request): RedirectResponse
    {
        ['disk' => $disk, 'path' => $path] = $this->validatedBackupFile($request);

        $filesystem = Storage::disk($disk);

        if (! $filesystem->exists($path)) {
            return back()->with('error', 'El respaldo ya no existe en el disco seleccionado.');
        }

        if (! $filesystem->delete($path)) {
            return back()->with('error', 'No se pudo eliminar el respaldo seleccionado.');
        }

        return back()->with('success', 'Respaldo eliminado correctamente.');
    }

    protected function validatedBackupFile(Request $request): array
    {
        $validated = $request->validate([
            'disk' => ['required', 'string'],
            'path' => ['required', 'string'],
        ]);

        $backupName = config('backup.backup.name');
        $destination = BackupDestination::create($validated['disk'], $backupName);

        $existsInConfiguredBackup = $destination->backups()->contains(
            fn($backup) => $backup->path() === $validated['path']
        );

        abort_unless($existsInConfiguredBackup, 404);

        return $validated;
    }
}
