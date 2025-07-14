import Sidebar from '../components/layouts/SideBar';
import Topbar from '../components/layouts/Topbar';
import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SkeletonLoader from '../components/ui/SkeletonLoader';


export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Apply dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Watch for location changes to show loader
  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 1000); // Simulate delay
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'dark' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
      <div className="flex flex-col flex-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 relative">
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onToggleDark={() => setIsDark((prev) => !prev)}
          isDark={isDark}
        />
        <main className="flex-1 p-6 overflow-auto relative">
          {isLoading ? (
            <SkeletonLoader route={location.pathname} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
