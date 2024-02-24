import { Outlet, Route, Routes } from "react-router-dom";
import { Map } from "./Map";

const MapLayout = () => {
  return <Outlet />;
};

export const MapRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MapLayout />}>
        <Route path="/" element={<Map />} />
      </Route>
    </Routes>
  );
};
