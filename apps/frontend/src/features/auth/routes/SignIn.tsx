import React, { useEffect } from "react";
import { LoginButton } from "@/features/auth/components/LoginButton.tsx";
import { LogoutButton } from "@/features/auth/components/LogoutButton.tsx";
import { SignupButton } from "@/features/auth/components/SignupButton.tsx";
import { useAuth0 } from "@auth0/auth0-react";

const SignIn = () => {
  const { loginWithRedirect } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();
  const { isAuthenticated, isLoading } = useAuth0();

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
  }, [getAccessTokenSilently, isAuthenticated, isLoading, loginWithRedirect]);

  return (
    <div>
      <h1>Sign In Page:</h1>
      <br></br>
      <LoginButton />
      <br></br>
      <LogoutButton />
      <br></br>
      <SignupButton />
    </div>
  );
};

export { SignIn };
