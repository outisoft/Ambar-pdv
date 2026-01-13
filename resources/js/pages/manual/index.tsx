import AuthenticatedLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { manualTopics } from '@/data/UserManual'; // Importamos los datos
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ManualIndexProps {
    auth: any;
}

export default function ManualIndex({ auth }: ManualIndexProps) {
    // Filtrar temas según el rol del usuario
    const userRoles: string[] = auth?.user?.roles ?? [];

    const visibleTopics = useMemo(() => {
        // Si un topic no define roles, se muestra para todos
        return manualTopics.filter((topic) => {
            if (!topic.roles || topic.roles.length === 0) return true;
            return topic.roles.some((r: string) => userRoles.includes(r));
        });
    }, [userRoles]);

    // Artículo activo por defecto: primero visible
    const defaultArticle = visibleTopics[0]?.articles[0];
    const [activeArticle, setActiveArticle] = useState(defaultArticle);
    const [search, setSearch] = useState('');

    // Lista plana de artículos para búsqueda rápida
    const filteredTopics = useMemo(() => {
        if (!search.trim()) return visibleTopics;
        const term = search.toLowerCase();
        return visibleTopics
            .map((topic) => ({
                ...topic,
                articles: topic.articles.filter((article: any) =>
                    article.title.toLowerCase().includes(term) ||
                    article.content.toLowerCase().includes(term)
                ),
            }))
            .filter((topic) => topic.articles.length > 0);
    }, [visibleTopics, search]);

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Dashboard', href: route('dashboard') },
                { title: 'Ayuda y manual', href: route('manual.index') },
            ]}
        >
            
            <Head title="Ayuda y Documentación" />

            <div className="py-6 lg:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                            <span>📘 Manual de Usuario</span>
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                            Aprende a usar todas las funciones del sistema: punto de venta, caja, inventarios, reportes y más.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="w-full md:w-1/3 flex flex-col gap-3">
                            <Input
                                type="search"
                                placeholder="Buscar en el manual (ventas, caja, reportes...)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 text-sm"
                            />
                            <div className="h-[480px] w-full rounded-md border bg-card overflow-y-auto">
                                <div className="p-3 space-y-4">
                                    {filteredTopics.length === 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            No encontramos artículos con "{search}".
                                        </p>
                                    )}

                                    {filteredTopics.map((topic, index) => (
                                        <div key={index} className="space-y-1">
                                            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                                <span>{topic.category}</span>
                                            </div>
                                            <ul className="space-y-1">
                                                {topic.articles.map((article: any) => (
                                                    <li key={article.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveArticle(article)}
                                                            className={cn(
                                                                'w-full text-left text-xs px-3 py-2 rounded-md transition-colors',
                                                                activeArticle?.id === article.id
                                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                                    : 'text-muted-foreground hover:bg-muted'
                                                            )}
                                                        >
                                                            {article.title}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:flex-1">
                            <div className="bg-card border rounded-xl shadow-sm h-full">
                                <div className="px-5 py-4 border-b flex flex-col gap-1">
                                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Artículo</p>
                                    <h2 className="text-xl font-semibold leading-tight">
                                        {activeArticle?.title}
                                    </h2>
                                </div>
                                <div className="px-5 py-5">
                                    {activeArticle ? (
                                        <div
                                            className="prose prose-sm md:prose max-w-none text-foreground leading-relaxed prose-headings:mt-4 prose-headings:mb-2 prose-p:mb-2 prose-ul:my-2 prose-ol:my-2"
                                            // El contenido viene validado desde nuestro propio archivo TS
                                            dangerouslySetInnerHTML={{ __html: activeArticle.content }}
                                        />
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Selecciona un tema en el panel izquierdo para comenzar.
                                        </p>
                                    )}
                                </div>
                                <div className="px-5 py-3 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[11px] text-muted-foreground">
                                    <span>¿Necesitas más ayuda o encontraste un error en el manual?</span>
                                    <span>
                                        Escribe a tu administrador o soporte de Ambar POS.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}