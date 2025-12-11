import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <i className="fas fa-robot text-3xl gradient-text"></i>
            <span className="text-2xl font-bold gradient-text">GrokMemeHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-grok-light"><i className="fas fa-home mr-2"></i>Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/my-memes" className="hover:text-grok-light"><i className="fas fa-images mr-2"></i>My Memes</Link>
                <Link to="/upload" className="hover:text-grok-light"><i className="fas fa-upload mr-2"></i>Upload</Link>
              </>
            )}
            <Link to="/search" className="hover:text-grok-light"><i className="fas fa-search mr-2"></i>Search</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">{user?.username}</span>
                <button onClick={handleLogout} className="btn-primary text-sm">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-semibold">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-3">
              <Link to="/" onClick={() => setIsOpen(false)} className="px-4 py-2">Home</Link>
              {isAuthenticated && (
                <>
                  <Link to="/my-memes" onClick={() => setIsOpen(false)} className="px-4 py-2">My Memes</Link>
                  <Link to="/upload" onClick={() => setIsOpen(false)} className="px-4 py-2">Upload</Link>
                </>
              )}
              <Link to="/search" onClick={() => setIsOpen(false)} className="px-4 py-2">Search</Link>
              <button onClick={toggleTheme} className="px-4 py-2 text-left">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
              {isAuthenticated ? (
                <button onClick={handleLogout} className="px-4 py-2 text-left text-red-600">Logout</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-2">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="px-4 py-2">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
