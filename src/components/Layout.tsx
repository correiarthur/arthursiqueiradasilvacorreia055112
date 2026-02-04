import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'sonner';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-secondary selection:text-primary">
            <Navbar />
            <main className="max-w-7xl mx-auto p-4 w-full">
                <Outlet />
            </main>
            <Toaster position="top-right" expand={true} richColors theme="light" />
        </div>
    );
};

export default Layout;
