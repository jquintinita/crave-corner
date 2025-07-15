import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProductManagement from '../pages/Inventory/ProductManagement';
import DashboardHome from '../pages/Dashboard/Home';
import POSPage from '../pages/POS/POSPage';
import PayrollPage from '../pages/Payroll/PayrollPage';
import SalesPage from '../pages/POS/SalesPage';
import UsersPage from '../pages/User/UserManagement';
import LoginPage from '../pages/Login';
import { getToken } from '../utils/auth';

function PrivateRoute({ children }) {
  const token = getToken();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <DashboardHome /> },
      { path: 'inventory', element: <ProductManagement /> },
      { path: 'pos', element: <POSPage /> },
      { path: 'payroll', element: <PayrollPage /> },
      { path: 'sales', element: <SalesPage /> },
      { path: 'user', element: <UsersPage /> },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
