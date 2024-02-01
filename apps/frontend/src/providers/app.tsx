import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import ThemeProvider from "./theme";

export const AppProvider = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
