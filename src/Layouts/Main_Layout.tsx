import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CityTable from "../Components/CityTable";
import WeatherPage from "../Components/WeatherPage";
import Dashboard from "../Components/Dashboard";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CityTable />} />
        <Route path="/Weather/:cityName" element={<WeatherPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default Layout;
