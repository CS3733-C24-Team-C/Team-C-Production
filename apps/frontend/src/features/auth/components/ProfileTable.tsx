import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const ProfileTable: React.FC = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <div>
      {user !== undefined && isAuthenticated && (
        <div>
          <ul>
            <li>Name: {user.name}</li>
            <li>Username: {user.nickname}</li>
            <li>Email: {user.email}</li>
            <li>Last Updated: {user.updated_at}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
