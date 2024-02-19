import { Outlet, Route, Routes } from "react-router-dom";
import { SignIn } from "./SignIn";
import { ContentLayout } from "@/components";

const AuthLayout = () => {
  return (
    <ContentLayout>
      <Outlet />
    </ContentLayout>
  );
};

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path="sign-in" element={<SignIn />} />
      </Route>
    </Routes>
  );
};
