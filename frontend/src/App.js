import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import LoginPage from "./pages/loginPage/LoginPage";
import Dashboard from "./pages/dashboard/Dashboard";

export default function App() {
  const { state } = useAuthContext();

  if (!state?.isAuthenticated) {
    return <LoginPage />;
  }

  return <Dashboard />;
}
