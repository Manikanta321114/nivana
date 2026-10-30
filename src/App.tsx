import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminAuthProvider } from './hooks/useAdminAuth'
import { UserAuthProvider } from './hooks/useUserAuth'
import { UserAuthModal } from './components/auth/UserAuthModal'

// Layouts
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

// Public Pages
import { HomePage } from './pages/public/HomePage'
import { ExplorePropertiesPage } from './pages/public/ExplorePropertiesPage'
import { PropertyDetailPage } from './pages/public/PropertyDetailPage'
import { RequestPage } from './pages/public/RequestPage'
import { ListPropertyPage } from './pages/public/ListPropertyPage'
import { AboutPage } from './pages/public/AboutPage'
import { ContactPage } from './pages/public/ContactPage'
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage'
import { TermsPage } from './pages/public/TermsPage'
import { NotFoundPage } from './pages/public/NotFoundPage'

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage'
import AdminAddPropertyPage from './pages/admin/AdminAddPropertyPage'
import AdminEditPropertyPage from './pages/admin/AdminEditPropertyPage'
import AdminPendingPage from './pages/admin/AdminPendingPage'
import AdminSubmissionReviewPage from './pages/admin/AdminSubmissionReviewPage'
import AdminRequestsPage from './pages/admin/AdminRequestsPage'
import AdminRequestDetailPage from './pages/admin/AdminRequestDetailPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <BrowserRouter>
          <UserAuthProvider>
            <UserAuthModal />
            <Routes>
              {/* ── Public Routes (Wrapped in PublicLayout with DemoBanner, Navbar, Footer) ── */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<ExplorePropertiesPage />} />
                <Route path="/properties/:propertyRef" element={<PropertyDetailPage />} />
                <Route path="/request/:propertyRef" element={<RequestPage />} />
                <Route path="/list-property" element={<ListPropertyPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* ── Admin Login (Unprotected) ── */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* ── Admin Portal (Protected by ProtectedRoute, wrapped in AdminLayout) ── */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="properties" element={<AdminPropertiesPage />} />
                <Route path="properties/new" element={<AdminAddPropertyPage />} />
                <Route path="properties/:id/edit" element={<AdminEditPropertyPage />} />
                <Route path="pending" element={<AdminPendingPage />} />
                <Route path="pending/:id" element={<AdminSubmissionReviewPage />} />
                <Route path="requests" element={<AdminRequestsPage />} />
                <Route path="requests/:id" element={<AdminRequestDetailPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Routes>
          </UserAuthProvider>
        </BrowserRouter>
      </AdminAuthProvider>
    </QueryClientProvider>
  )
}

export default App
