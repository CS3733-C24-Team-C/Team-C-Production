import React from "react";
import ReactDOM from "react-dom/client";
import "flowbite";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      useRefreshTokens
      cacheLocation="localstorage"
      domain="dev-njtak837ng1u41nc.us.auth0.com"
      clientId="C2UCnUwHJvf1DIbyZHjMGqNyyo56oKS5"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
);
