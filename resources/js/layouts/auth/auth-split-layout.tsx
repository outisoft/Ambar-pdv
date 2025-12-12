import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 bg-white dark:bg-[#0a0a0a]">
            {/* Sidebar with Ambar Branding */}
            <div className="relative hidden h-full flex-col bg-[#1b1b18] p-10 text-white lg:flex dark:border-r border-[#3E3E3A] overflow-hidden">
                <div className="absolute inset-0 bg-[#0a0a0a]" />
                {/* Orange Glow/Blob Effect */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#FF750F] blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FF4433] blur-3xl opacity-10" />

                <Link
                    href={home()}
                    className="relative z-20 flex items-center text-lg font-medium"
                >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF750F] to-[#FF4433] mr-3 shadow-lg shadow-orange-500/20">
                        <AppLogoIcon className="size-6 fill-current text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Ambar<span className="text-[#FF750F]">.</span></span>
                </Link>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <div className="relative">
                                <span className="absolute -top-4 -left-2 text-6xl text-[#FF750F] opacity-30 font-serif">"</span>
                                <p className="text-lg italic font-light relative z-10 leading-relaxed text-gray-200">
                                    {quote.message}
                                </p>
                            </div>
                            <footer className="text-sm font-medium text-[#FF750F]">
                                — {quote.author}
                            </footer>
                        </blockquote>
                    </div>
                )}
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden mb-4"
                    >
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF750F] to-[#FF4433] shadow-lg shadow-orange-500/20">
                            <AppLogoIcon className="h-10 w-10 fill-current text-white" />
                        </div>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-[#1b1b18] dark:text-white">{title}</h1>
                        <p className="text-sm text-balance text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
