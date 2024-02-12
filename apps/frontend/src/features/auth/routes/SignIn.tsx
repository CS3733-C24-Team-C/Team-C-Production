import React from "react";
import { LoginButton } from "@/features/auth/components/LoginButton.tsx";
import { LogoutButton } from "@/features/auth/components/LogoutButton.tsx";
import { SignupButton } from "@/features/auth/components/SignupButton.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <Auth0Provider
      useRefreshTokens
      cacheLocation="localstorage"
      domain="dev-njtak837ng1u41nc.us.auth0.com"
      clientId="C2UCnUwHJvf1DIbyZHjMGqNyyo56oKS5"
      onRedirectCallback={(appState) => {
        navigate(appState?.returnTo || window.location.pathname);
      }}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <h1>Sign In Page:</h1>
      <br></br>
      <LoginButton />
      <br></br>
      <LogoutButton />
      <br></br>
      <SignupButton />
    </Auth0Provider>
  );
};

export { SignIn };
