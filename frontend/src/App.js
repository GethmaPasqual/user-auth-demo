import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import HomePage from "./pages/home/HomePage";
import Dashboard from "./pages/dashboard/Dashboard";
import UserHome from "./pages/user/UserHome";
import useUserRole from "./hooks/useUserRole";

export default function App() {
  const { state } = useAuthContext();
  const { userRole, isAdmin, loading } = useUserRole();

  // Check if user is authenticated
  if (!state?.isAuthenticated) {
    return <HomePage />;
  }

  // Show loading while checking role
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  // Route based on role from backend
  if (isAdmin) {
    return <Dashboard />;  // Admin Dashboard
  } else {
    return <UserHome />;   // Regular User Home
  }
}
