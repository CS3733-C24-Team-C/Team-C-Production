import { Route, Routes } from "react-router-dom";
import { SignUp } from "./SignUp";
import { SignIn } from "./SignIn";
import { ResetPassword } from "./ResetPassword";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="sign-up" element={<SignUp />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>
  );
};
