import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Users,
  DollarSign,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/inventory', label: 'Inventory', icon: <Boxes size={18} /> },
  { to: '/pos', label: 'POS', icon: <ShoppingCart size={18} /> },
  { to: '/payroll', label: 'Payroll', icon: <Users size={18} /> },
  { to: '/sales', label: 'Sales', icon: <DollarSign size={18} /> },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll on mobile when sidebar is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      {isMobile ? (
        // Mobile: slide in/out using motion
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: isOpen ? 0 : '-100%' }}
          transition={{ duration: 0.3 }}
          className="fixed z-30 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 md:hidden"
        >
          <SidebarContent isOpen={true} toggleSidebar={toggleSidebar} />
        </motion.aside>
      ) : (
        // Desktop: just toggle width
        <aside
          className={`z-30 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col
          ${isOpen ? 'w-64' : 'w-16'}
        `}
        >
          <SidebarContent isOpen={isOpen} toggleSidebar={toggleSidebar} />
        </aside>
      )}
    </>
  );
}

function SidebarContent({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {isOpen ? (
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
            crave<span className="text-gray-700 dark:text-gray-200">corner</span>
          </span>
        ) : (
          <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">cc</span>
        )}

        <button
          onClick={toggleSidebar}
          className="text-white absolute -right-4 w-[30px] h-[30px] rounded-full bg-gray-700 flex items-center justify-center"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-purple-100 dark:bg-purple-600 text-purple-700 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
            onClick={() => {
              if (window.innerWidth < 768) toggleSidebar();
            }}
          >
            {icon}
            {isOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
