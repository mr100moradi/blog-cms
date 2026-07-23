import Header from './Header';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mainEntered, setMainEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMainEntered(true), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header onMenuClick={() => setMobileOpen(true)} />
      <div className="mx-auto flex max-w-7xl gap-6 px-3 py-6 sm:gap-8 sm:px-4 sm:py-8">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className={`flex-1 space-y-6 transform transition-all duration-700 ease-out delay-400 ${mainEntered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}


