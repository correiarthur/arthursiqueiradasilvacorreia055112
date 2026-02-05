import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from './ui/button';
import { LogOut, Menu } from 'lucide-react';

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
        <nav className="sticky top-0 z-50 bg-primary text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative h-12">
                <div className="flex items-center z-10">
                    <Link to="/" className="text-2xl font-display font-bold text-white">
                        Amigo<span className="text-blue-300">Fiel</span>
                    </Link>
                </div>

                {isAuthenticated && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-12">
                            {links.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-xl font-bold transition-all hover:scale-105 ${location.pathname === link.path ? 'text-white border-b-2 border-white' : 'text-white/70 hover:text-white'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center z-10">
                    {isAuthenticated && (
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sair</span>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
