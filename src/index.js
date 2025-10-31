import React from "react";
import ReactDOM from "react-dom/client";
import { AsgardeoProvider } from "@asgardeo/auth-react";
import App from "./App";
import { asgardeoConfig } from "./asgardeoConfig";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AsgardeoProvider config={asgardeoConfig}>
    <App />
  </AsgardeoProvider>
);
