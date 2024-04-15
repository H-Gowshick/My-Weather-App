import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CityTable from "../Components/CityTable"; // Assuming Cities page is in pages folder
import WeatherPage from "../Components/WeatherPage";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CityTable />} />
        <Route path="/Weather/:cityName" element={<WeatherPage />} />
      </Routes>
    </Router>
  );
};

export default Layout;
