// src/routes/index.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProductManagement from '../pages/Inventory/ProductManagement';
import DashboardHome from '../pages/Dashboard/Home';
import POSPage from '../pages/POS/POSPage';
import PayrollPage from '../pages/Payroll/PayrollPage';
import SalesPage from '../pages/POS/SalesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardHome /> },
      { path: 'inventory', element: <ProductManagement /> },
      { path: 'pos', element: <POSPage /> },
      { path: 'payroll', element: <PayrollPage /> },
      { path: 'sales', element: <SalesPage /> },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
