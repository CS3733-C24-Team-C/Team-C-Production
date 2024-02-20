import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar } from "flowbite-react";

export const ProfileIn: React.FC = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <div
      className="flex flex-wrap gap-2"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Avatar
        bordered
        status="online"
        statusPosition="bottom-right"
        size="xl"
      ></Avatar>
      {user !== undefined && isAuthenticated && (
        <h2 className="text-xl">Hello, {user.nickname}!</h2>
      )}
    </div>
  );
};
