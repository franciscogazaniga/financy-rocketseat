import { Layout } from './components/Layout'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from './pages/Auth/Login'
import { SignUp } from './pages/Auth/Signup'
import { useAuthStore } from './stores/auth'
import { Dashboard } from './pages/Dashboard/index'
import { Category } from './pages/Categories'
import { Transaction } from './pages/Transactions'
import { Account } from './pages/Account'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path='/signup' element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path='/' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/transactions' element={
          <ProtectedRoute>
            <Transaction />
          </ProtectedRoute>
        } />
        <Route path='/categories' element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        } />
        <Route path='/account' element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  )
}

export default App
