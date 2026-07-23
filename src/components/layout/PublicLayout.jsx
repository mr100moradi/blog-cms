import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../data/AuthContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import logo from "../../assets/logo.png";

export default function PublicLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className={`sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/80 transition-all duration-500 ease-out ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            {/* <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">B</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight dark:text-gray-100">Blog</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Learn and explore</p>
            </div> */}
          <img src={logo} width={100} height={100} alt="logo" />

          </Link>
          <nav className="flex items-center gap-4 text-sm dark:text-gray-200">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Posts</Link>
            <button 
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} 
              className="btn-outline" 
              aria-label="Toggle theme"
              title="Toggle dark mode"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-blue-600 dark:hover:text-blue-400">Admin</Link>
                )}
                <span className="text-gray-600 dark:text-gray-400">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
                <button onClick={handleLogout} className="btn-outline text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className={`transition-all duration-500 ease-out delay-100 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} origin-center`}> 
          {children}
        </div>
      </main>
      <footer className="mt-auto border-t border-gray-200 bg-white/50">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Blog. All rights reserved.
        </div>
      </footer>
    </div>
  );
}


