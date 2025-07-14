import { Menu, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Topbar({ onToggleSidebar, onToggleDark, isDark }) {
  const location = useLocation();

  const getTitle = (path) => {
    if (path.includes('/inventory')) return 'Inventory';
    if (path.includes('/pos')) return 'POS';
    if (path.includes('/payroll')) return 'Payroll';
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/sales')) return 'Sales';
    return 'Crave Corner';
  };

  const title = getTitle(location.pathname);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 shadow-sm flex items-center justify-between">
      {/* Left side (menu & title) */}
      <div className="flex items-center gap-3">
        {/* <button
          className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onToggleSidebar}
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-200" />
        </button> */}
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
      </div>

      {/* Right side (toggle & avatar) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleDark}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-200" />
          )}
        </button>
        <img
          src="https://i.pravatar.cc/40"
          alt="User avatar"
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
        />
      </div>
    </header>
  );
}
