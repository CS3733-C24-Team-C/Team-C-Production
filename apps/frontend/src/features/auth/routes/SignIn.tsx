import { useEffect } from "react";
import { LoginButton, LogoutButton, SignupButton } from "../components";
import { useAuth0 } from "@auth0/auth0-react";
import { Card } from "flowbite-react";
const SignIn = () => {
  const {
    loginWithRedirect,
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
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
  }, [getAccessTokenSilently, isAuthenticated, isLoading, loginWithRedirect]);

  return (
    <div className="mx-auto py-8 flex flex-col space-y-4 max-w-md">
      <Card className="shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
        <h1 className="text-2xl font-bold dark:text-white">Sign In Page</h1>
        {!isAuthenticated && <LoginButton />}
        {!isAuthenticated && <SignupButton />}
        {isAuthenticated && <LogoutButton />}
      </Card>
    </div>
  );
};

export { SignIn };
