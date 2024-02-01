import { Route, Routes } from "react-router-dom";
import { Map } from "./Map";
import { CSVData } from "./CSVData";

export const MapRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Map />} />
      <Route path="/janitorial" element={<CSVData />} />
    </Routes>
  );
};
