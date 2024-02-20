import React from "react";
import { Avatar } from "flowbite-react";

export const ProfileOut: React.FC = () => {
  return (
    <div
      className="flex flex-wrap gap-2"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Avatar
        bordered
        size="xl"
        status="offline"
        statusPosition="bottom-right"
      ></Avatar>
      <div>
        <h2 className="text-xl">You are currently signed out.</h2>
      </div>
    </div>
  );
};
