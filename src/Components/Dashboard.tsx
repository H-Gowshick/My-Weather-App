import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Define the interface for city data
interface City {
  name: string;
  timezone: string;
  population: number;
  country_name_en: string;
}

const Dashboard: React.FC = () => {
  // State to store dashboard cities
  const [dashboardCities, setDashboardCities] = useState<City[]>([]);

  // Fetch dashboard cities from localStorage when the component mounts
  useEffect(() => {
    const fetchDashboardCities = async () => {
      try {
        // Fetch dashboard cities from localStorage
        const storedCities = localStorage.getItem("dashboardCities");
        if (storedCities) {
          const cities = JSON.parse(storedCities);
          setDashboardCities(cities);
        }
      } catch (error) {
        console.error("Error fetching dashboard cities:", error);
      }
    };

    fetchDashboardCities();
  }, []);

  // Function to remove a city from the dashboard
  const removeCity = (index: number) => {
    const updatedCities = [...dashboardCities];
    updatedCities.splice(index, 1);
    setDashboardCities(updatedCities);
    localStorage.setItem("dashboardCities", JSON.stringify(updatedCities));
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Weather Dashboard</h1>
      {/* Render a message if no cities are added  */}
      {dashboardCities.length === 0 ? (
        <p>No cities added to the dashboard.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {/* Table headers */}
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Timezone</th>
                <th className="px-4 py-2">Population</th>
                <th className="px-4 py-2">Actions</th>{" "}
              </tr>
            </thead>
            <tbody>
              {/* Map through dashboard cities and render a row for each city */}
              {dashboardCities.map((city, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <Link
                      to={`/Weather/${city.name}`}
                      className="transition duration-300 hover:underline hover:text-indigo-500"
                    >
                      {city.name}
                    </Link>
                  </td>

                  <td className="border px-4 py-2">{city.country_name_en}</td>

                  <td className="border px-4 py-2">{city.timezone}</td>

                  <td className="border px-4 py-2">{city.population}</td>
                  {/* Button to remove city from the dashboard */}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => removeCity(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
