import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts';
import DashboardPage from '../pages/DashboardPage';
import { ClientsPage } from '../pages/ClientsPage';
import ServicesPage from '../pages/ServicesPage';
import SalesPage from '../pages/SalesPage';
import StockPage from '../pages/StockPage';
import ExpensesPage from '../pages/ExpensesPage';
import DebtsPage from '../pages/DebtsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'clients',
        element: <ClientsPage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'sales',
        element: <SalesPage />,
      },
      {
        path: 'stock',
        element: <StockPage />,
      },
      {
        path: 'expenses',
        element: <ExpensesPage />,
      },
      {
        path: 'debts',
        element: <DebtsPage />,
      },
    ],
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
]);
