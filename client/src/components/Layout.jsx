import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Resume AI', path: '/resume', icon: FileText },
    { name: 'Applications', path: '/applications', icon: Briefcase },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-navy-800 border-b border-white/10">
        <h1 className="text-xl font-bold text-blue-400">ResumeAI</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-navy-800 border-r border-white/10 p-6 flex flex-col`}>
        <h1 className="hidden md:block text-2xl font-bold text-blue-400 mb-10">ResumeAI</h1>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-blue-600 text-white' : 'hover:bg-navy-700 text-gray-400'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-6 px-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <span className="truncate">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
