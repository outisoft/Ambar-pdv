// resources/js/Pages/Clients/Edit.tsx
import AuthenticatedLayout from '@/layouts/app-layout';
import { Client, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, User, Hash, Mail, Phone, Home, CreditCard, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

type Company = {
	id: number;
	name: string;
};

type EditClientProps = PageProps & {
	client: Client;
	companies?: Company[];
};

export default function Edit({ auth, client, companies }: EditClientProps) {
	const { data, setData, put, processing, errors } = useForm({
		name: client.name || '',
		email: client.email || '',
		phone: client.phone || '',
		tax_id: client.tax_id || '',
		address: client.address || '',
		credit_limit:
			client.credit_limit !== undefined && client.credit_limit !== null
				? String(client.credit_limit)
				: '',
		company_id:
			client.company_id !== undefined && client.company_id !== null
				? String(client.company_id)
				: '',
	});

	const isGlobalAdmin = !!companies && companies.length > 0;

	const submit = (e: FormEvent) => {
		e.preventDefault();
		put(route('clients.update', client.id), {
			onSuccess: () => {
				toast.success('Cliente actualizado correctamente.');
			},
			onError: (errs) => {
				const first = Object.values(errs)[0];
				toast.error(
					typeof first === 'string'
						? first
						: 'Error al actualizar el cliente.',
				);
			},
		});
	};

	return (
		<AuthenticatedLayout>
			<Head title="Editar Cliente" />

			<div className="flex flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-foreground">
							Editar Cliente
						</h1>
						<p className="text-muted-foreground mt-1">
							Actualiza la información de tu cliente.
						</p>
					</div>
					<Link href={route('clients.index')}>
						<Button variant="outline" size="sm">
							<ArrowLeft className="w-4 h-4 mr-2" /> Volver
						</Button>
					</Link>
				</div>

				<div className="max-w-3xl mx-auto w-full">
					<form onSubmit={submit} className="flex flex-col gap-6">
						{/* Contexto del Cliente */}
						<div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
							<h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
								<Building2 className="w-5 h-5 text-primary" /> Contexto del Cliente
							</h2>

							{isGlobalAdmin ? (
								<div className="space-y-2 max-w-md">
									<Label>Empresa</Label>
									<Select
										value={data.company_id}
										onValueChange={(val) => setData('company_id', val)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Seleccionar Empresa" />
										</SelectTrigger>
										<SelectContent>
											{companies?.map((company) => (
												<SelectItem key={company.id} value={company.id.toString()}>
													{company.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.company_id && (
										<p className="text-destructive text-sm font-medium mt-1">
											{errors.company_id}
										</p>
									)}
								</div>
							) : (
								<div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border border-dashed">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Building2 className="w-4 h-4 opacity-70" />
										<span className="font-medium">Empresa:</span>
										<span className="text-foreground font-semibold">
											{auth.user.company?.name || 'N/A'}
										</span>
									</div>
								</div>
							)}
						</div>

						{/* Datos del Cliente */}
						<div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
							<div className="flex items-center gap-4 mb-6">
								<div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
									<User className="w-5 h-5 text-primary" />
								</div>
								<div>
									<h2 className="font-semibold text-lg">Información del Cliente</h2>
									<p className="text-sm text-muted-foreground">
										Datos básicos y condiciones de crédito.
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2 md:col-span-2">
									<Label className="flex items-center gap-2">
										<User className="w-4 h-4 text-muted-foreground" /> Nombre
									</Label>
									<Input
										placeholder="Ej: Juan Pérez"
										value={data.name}
										onChange={(e) => setData('name', e.target.value)}
									/>
									{errors.name && (
										<p className="text-destructive text-sm font-medium mt-1">
											{errors.name}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<Hash className="w-4 h-4 text-muted-foreground" /> RFC / NIT
									</Label>
									<Input
										placeholder="Opcional"
										value={data.tax_id}
										onChange={(e) => setData('tax_id', e.target.value)}
									/>
									{errors.tax_id && (
										<p className="text-destructive text-sm font-medium mt-1">
											{errors.tax_id}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<Mail className="w-4 h-4 text-muted-foreground" /> Email
									</Label>
									<Input
										type="email"
										placeholder="cliente@correo.com"
										value={data.email}
										onChange={(e) => setData('email', e.target.value)}
									/>
									{errors.email && (
										<p className="text-destructive text-sm font-medium mt-1">
											{errors.email}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<Phone className="w-4 h-4 text-muted-foreground" /> Teléfono
									</Label>
									<Input
										placeholder="Opcional"
										value={data.phone}
										onChange={(e) => setData('phone', e.target.value)}
									/>
									{errors.phone && (
										<p className="text-destructive text-sm font-medium mt-1">
											{errors.phone}
										</p>
									)}
								</div>

								<div className="space-y-2 md:col-span-2">
									<Label className="flex items-center gap-2">
										<Home className="w-4 h-4 text-muted-foreground" /> Dirección
									</Label>
									<Input
										placeholder="Calle, número, ciudad..."
										value={data.address}
										onChange={(e) => setData('address', e.target.value)}
									/>
									{errors.address && (
										<p className="text-destructive text-sm font-medium mt-1">
											{errors.address}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<CreditCard className="w-4 h-4 text-muted-foreground" /> Límite de Crédito
									</Label>
									<div className="relative">
										<span className="absolute left-3 top-2.5 text-muted-foreground">
											$
										</span>
										<Input
											type="number"
											min="0"
											step="0.01"
											placeholder="0.00"
											className="pl-7"
											value={data.credit_limit}
											onChange={(e) => setData('credit_limit', e.target.value)}
										/>
									</div>
									{errors.credit_limit && (
										<p className="text-destructive text-sm font-medium mt-1">
											{errors.credit_limit}
										</p>
									)}
									<p className="text-xs text-muted-foreground mt-1">
										Deja en 0 si el cliente no tendrá crédito.
									</p>
								</div>
							</div>
						</div>

						<div className="p-6 bg-card border shadow-sm flex justify-end gap-3 rounded-xl">
							<Link href={route('clients.index')}>
								<Button variant="ghost">Cancelar</Button>
							</Link>
							<Button
								type="submit"
								disabled={processing}
								className="bg-primary hover:bg-primary/90"
							>
								{processing ? (
									'Guardando...'
								) : (
									<>
										<Save className="w-4 h-4 mr-2" /> Guardar Cambios
									</>
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}

