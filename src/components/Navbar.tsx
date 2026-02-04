import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();

    const links = [
        { name: 'Pets', path: '/pets' },
        { name: 'Tutores', path: '/tutores' },
    ];

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!isAuthenticated && location.pathname === '/login') return null;

    return (
        <nav className="sticky top-0 z-50 bg-white/40 backdrop-blur border-b border-gray-100 p-4 flex items-center justify-between ">
            <div className="flex items-center gap-2">
                <Link to="/" className="text-2xl font-display font-bold text-primary">
                    Amigo<span className="text-secondary">Fiel</span>
                </Link>
            </div>
            {isAuthenticated && (
                <div className="flex items-center gap-6">
                    <ul className="flex gap-6 items-center">
                        {links.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`font-sans font-medium transition-colors hover:text-secondary ${location.pathname === link.path ? 'text-primary font-bold' : 'text-primary/70'}`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                        <LogOut className="h-10 w-10 text-primary font-bold" />
                    </Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
