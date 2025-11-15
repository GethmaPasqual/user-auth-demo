import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css";

export default function SignIn() {
  const { signIn } = useAuthContext();
  
  const handleSignIn = () => {
    signIn();
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1>Welcome</h1>
        <p className="subtitle">Sign in to continue</p>
        <button className="signin-button" onClick={handleSignIn}>
          Sign In with Asgardeo
        </button>
      </div>
    </div>
  );
}
