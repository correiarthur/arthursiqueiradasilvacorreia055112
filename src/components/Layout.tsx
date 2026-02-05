import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'sonner';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";

const Layout = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-white">
            <Navbar />

            <main className="w-full px-[41px] py-10 space-y-[30px] focus:outline-none">
                {pathnames.length > 0 && (
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to="/">Início</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {pathnames.map((value, index) => {
                                const last = index === pathnames.length - 1;
                                const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                                const label = value.charAt(0).toUpperCase() + value.slice(1);

                                return (
                                    <React.Fragment key={to}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            {last ? (
                                                <BreadcrumbPage>{label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link to={to}>{label}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                )}

                <Outlet />
            </main>
            <Toaster position="top-right" expand={true} richColors theme="light" />
        </div>
    );
};

export default Layout;
