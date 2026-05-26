import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthPage } from '@/pages/AuthPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { QuizPage } from '@/pages/QuizPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#16161f',
            color: '#e2e8f0',
            border: '1px solid #1e1e2e',
            borderRadius: '12px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#16161f' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#16161f' },
          },
        }}
      />
    </AuthProvider>
  )
}
