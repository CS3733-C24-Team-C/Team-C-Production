import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const ProfileTable: React.FC = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <div>
      {user !== undefined && isAuthenticated && (
        <div>
          <ul>
            <li className="text-lg">Name</li>
            <li className="text-xl font-bold">{user.name}</li>
            <hr></hr>
            <br></br>
            <li className="text-lg">Username</li>
            <li className="text-xl font-bold">{user.nickname}</li>
            <hr></hr>
            <br></br>
            <li className="text-lg">Email</li>
            <li className="text-xl font-bold">{user.email}</li>
            <hr></hr>
            <br></br>
            <li className="text-lg">Last Signed In</li>
            <li className="text-xl font-bold">{user.updated_at}</li>
            <hr></hr>
            <br></br>
          </ul>
        </div>
      )}
    </div>
  );
};
