import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Storefront from './pages/Public/Storefront'
import ProductDetail from './pages/Public/ProductDetail'
import CartPage from './pages/Public/CartPage'
import Onboarding from './pages/Onboarding/Onboarding'
import Dashboard from './pages/Dashboard/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import FinanceLayout from './pages/Finance/FinanceLayout'
import FinanceDashboard from './pages/Finance/FinanceDashboard'
import PayablePage from './pages/Finance/PayablePage'
import ReceivablePage from './pages/Finance/ReceivablePage'
import AccountsPage from './pages/Finance/AccountsPage'
import CategoriesPage from './pages/Finance/CategoriesPage'
import CRMLayout from './pages/CRM/CRMLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* CRM Routes */}
          <Route path="/crm" element={<CRMLayout />} />

          {/* Finance Routes */}
          <Route path="/finance" element={<FinanceLayout />}>
            <Route index element={<FinanceDashboard />} />
            <Route path="payable" element={<PayablePage />} />
            <Route path="receivable" element={<ReceivablePage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
          </Route>
        </Route>

        {/* Public Storefront */}
        <Route path="/c/:slug" element={<Storefront />} />
        <Route path="/c/:slug/category/:categoryId" element={<Storefront />} />
        <Route path="/c/:slug/p/:produtoId" element={<ProductDetail />} />
        <Route path="/c/:slug/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
