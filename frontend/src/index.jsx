import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "@asgardeo/auth-react";
import App from "./App.jsx";

const config = {
  signInRedirectURL: "http://localhost:3000",
  signOutRedirectURL: "http://localhost:3000",
  clientID: "KYEfJzks5uXRratlXxNpS9dvpRQa",
  baseUrl: "https://api.asgardeo.io/t/testforfinalproject",
  scope: ["openid", "profile"]
};

console.log("Asgardeo config:", config);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider config={config}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
