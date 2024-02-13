import React /*, { useEffect }*/ from "react";
import { LoginButton } from "@/features/auth/components/LoginButton.tsx";
import { LogoutButton } from "@/features/auth/components/LogoutButton.tsx";
import { SignupButton } from "@/features/auth/components/SignupButton.tsx";
import { Auth0Provider /*useAuth0*/ } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  /*
  const {
    isAuthenticated,
    isLoading,
    user,
  } = useAuth0();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await getAccessTokenSilently();
      } catch (error) {
        await loginWithRedirect({
          appState: {
            returnTo: location.pathname,
          },
        });
      }
    };

    if (!isLoading && isAuthenticated) {
      checkToken();
    }
  }, [
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    location.pathname,
    loginWithRedirect,
  ]);

   */

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
