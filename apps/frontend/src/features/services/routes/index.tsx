import { Route, Routes } from "react-router-dom";
import { ServiceRequest } from "./ServiceRequest";
import { Janitorial } from "./Janitorial";

export const ServicesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ServiceRequest />} />
      <Route path="/janitorial" element={<Janitorial />} />
    </Routes>
  );
};
