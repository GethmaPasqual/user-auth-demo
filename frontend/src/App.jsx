import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import SignIn from "./pages/SignIn.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const { state } = useAuthContext();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            state?.isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            state?.isAuthenticated ? <Dashboard /> : <Navigate to="/" />
          } 
        />
      </Routes>
    </Router>
  );
}
