import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Storefront from './pages/Public/Storefront'
import Onboarding from './pages/Onboarding/Onboarding'
import Dashboard from './pages/Dashboard/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Public Storefront */}
        <Route path="/c/:slug" element={<Storefront />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
