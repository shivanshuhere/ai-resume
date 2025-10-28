import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, LogOut, Upload, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-primary-600" />
                            <span className="text-xl font-bold text-gray-900">AI Resume Analyzer</span>
                        </Link>
                    </div>

                    {user && (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/dashboard"
                                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/upload"
                                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                            >
                                <Upload className="h-4 w-4" />
                                <span>Upload Resume</span>
                            </Link>
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-700">{user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;