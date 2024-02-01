// import { createBrowserRouter } from "react-router-dom";
// import MapRoute from "./MapRoute.tsx";
// import NewAccountRoute from "./NewAccountRoute.tsx";
// import CSVDataRoute from "@/routes/CSVDataRoute.tsx";
// import ServiceRequestRoute from "@/routes/ServiceRequestRoute.tsx";
// import JanitorialFormRoute from "@/routes/JanitorialFormRoute.tsx";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MapRoute />,
//   },
//   {
//     path: "/csv-data",
//     element: <CSVDataRoute />,
//   },
//   {
// ]);
import { useRoutes } from "react-router-dom";
import { AuthRoutes } from "@/features/auth";
import { MapRoutes } from "@/features/map";
import { ServicesRoutes } from "@/features/services";

export const AppRoutes = () => {
  const element = useRoutes([
    {
      path: "/auth/*",
      element: <AuthRoutes />,
    },
    {
      path: "/map",
      element: <MapRoutes />,
    },
    {
      path: "/services/*",
      element: <ServicesRoutes />,
    },
  ]);
  return <>{element}</>;
};
