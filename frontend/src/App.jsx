import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute'

import PublicLayout from './layouts/PublicLayout'
import StudentLayout from './layouts/StudentLayout'
import AdminLayout from './layouts/AdminLayout'
import SuperAdminLayout from './layouts/SuperAdminLayout'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PricingPage from './pages/PricingPage'
import InstitutionExplorer from './pages/InstitutionExplorer'
import StudentDashboard from './pages/StudentDashboard'
import ChatPage from './pages/ChatPage'
import NoticesPage from './pages/NoticesPage'
import AdminPanel from './pages/AdminPanel'
import SuperAdminPanel from './pages/SuperAdminPanel'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{
          style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } }
        }} />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/institutions" element={<InstitutionExplorer />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

          {/* Student Routes */}
          <Route element={<ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/notices" element={<NoticesPage />} />
          </Route>

          {/* Institution Admin Routes */}
          <Route element={<ProtectedRoute roles={['institutionAdmin']}><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/*" element={<AdminPanel />} /> {/* Catch-all for CRUD pages we bypassed */}
          </Route>

          {/* Super Admin Routes */}
          <Route element={<ProtectedRoute roles={['superadmin']}><SuperAdminLayout /></ProtectedRoute>}>
            <Route path="/superadmin" element={<SuperAdminPanel />} />
            <Route path="/superadmin/*" element={<SuperAdminPanel />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
