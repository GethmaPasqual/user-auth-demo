import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import HomePage from "./pages/home/HomePage";
import Dashboard from "./pages/dashboard/Dashboard";
import UserHome from "./pages/user/UserHome";

export default function App() {
  const { state } = useAuthContext();

  // Check if user is authenticated
  if (!state?.isAuthenticated) {
    return <HomePage />;
  }

  // Check user role - you can modify this logic based on how roles are stored in your token
  // For now, checking if user email contains 'admin' or you can check state.idToken for roles
  const userEmail = state?.email || '';
  const isAdmin = userEmail.toLowerCase().includes('admin') || 
                  state?.username?.toLowerCase().includes('admin');

  // Route based on role
  if (isAdmin) {
    return <Dashboard />;  // Admin Dashboard
  } else {
    return <UserHome />;   // Regular User Home
  }
}
