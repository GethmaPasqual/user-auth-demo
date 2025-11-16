import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthContext } from "@asgardeo/auth-react"
import Login from "./pages/Login"
import UserPage from "./pages/UserPage"
import AdminPage from "./pages/AdminPage"
import ProtectedRoute from "./components/ProtectedRoute"
import './App.css'

function App() {
  const { state } = useAuthContext()

  // Home route logic: redirect based on authentication
  const HomePage = () => {
    if (!state.isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    // Default authenticated users to user page
    return <Navigate to="/user" replace />
  }

  return (
    <div className="app">
      <Routes>
        {/* Home - redirects based on auth status */}
        <Route path="/" element={<HomePage />} />
        
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
