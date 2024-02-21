import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../components";
import { ProfileContext } from "../components/ProfileContext";
import { ProfileTable } from "../components/ProfileTable.tsx";

const Profile = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      {isAuthenticated && (
        <div className="mx-auto py-8 flex flex-col space-y-4 max-w-md dark:text-white">
          <h1
            className="text-2xl font-bold"
            style={{ display: "flex", justifyContent: "center" }}
          >
            Profile
          </h1>
          <ProfileContext />
          <ProfileTable />
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export { Profile };
