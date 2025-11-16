import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthContext } from "@asgardeo/auth-react"
import Login from "./pages/Login/Login"
import UserPage from "./pages/UserPage/UserPage"
import AdminPage from "./pages/AdminPage/AdminPage"
import ProtectedRoute from "./components/ProtectedRoute"
import './App.css'

function App() {
  const { state } = useAuthContext()

  // Root route - redirect based on authentication and role
  const RootRedirect = () => {
    if (!state.isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    
    // Check if user has admin role
    const roles = state.roles || []
    const userRoles = typeof roles === 'string' ? roles.split(',').map(r => r.trim()) : roles
    const isAdmin = userRoles.some(role => role.toLowerCase() === 'admin')
    
    // Redirect based on role
    if (isAdmin) {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/user" replace />
    }
  }

  return (
    <div className="app">
      <Routes>
        {/* Root - redirects to login or dashboard based on auth */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Login page */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected User page */}
        <Route 
          path="/user" 
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Admin page */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
