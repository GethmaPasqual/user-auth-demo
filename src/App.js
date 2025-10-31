import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";

export default function App() {
  const { state, signIn, signOut } = useAuthContext();

  if (!state?.isAuthenticated) {
    return (
      <div style={{ padding: 40 }}>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome!</h2>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
