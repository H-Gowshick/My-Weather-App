import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/Css/cityTable.css";

// Define the structure of a City object
interface City {
  name: string;
  timezone: string;
  population: number;
  country_name_en: string;
}

// Define the CityTable component
const CityTable: React.FC = () => {
  // Define state variables using the useState hook
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>(""); 
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  // Define a ref for the intersection observer
  const observer = useRef<IntersectionObserver>();

  // Function to fetch city data from the API
  const fetchCityData = async (pageNumber: number): Promise<City[]> => {
    // Initialize an array to store fetched cities
    const allCities: City[] = [];
    // Define pagination parameters
    const limit = 50;
    const offset = (pageNumber - 1) * limit;
    try {
      // Fetch data from the API
      const response = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=${limit}&start=${offset}`
      );
      // Parse response to JSON
      const data = await response.json();
      // Check if data is valid and an array of records exists
      if (data && data.records && Array.isArray(data.records)) {
        // Map API records to City objects and push them to allCities array
        const cities = data.records.map((record: any) => ({
          name: record.fields.name,
          timezone: record.fields.timezone,
          population: record.fields.population,
          country_name_en: record.fields.cou_name_en,
        }));
        allCities.push(...cities);
      }
      return allCities; // Return the array of fetched cities
    } catch (error) {
      console.log("Error fetching data from the API", error);
      return []; // Return an empty array if an error occurs
    }
  };

  // useEffect to load initial data and load more data when scrolling
  useEffect(() => {
    // Function to load data
    const loadData = async () => {
      setLoading(true); // Set loading state to true
      try {
        const newCities = await fetchCityData(page); // Fetch cities data
        setCities((prevCities) => [...prevCities, ...newCities]); // Update cities state with new data
        setHasMore(newCities.length > 0); // Update hasMore state based on fetched data
      } catch (error) {
        console.error(error);
        alert(
          "An error occurred while loading the data. Please try again later."
        ); // Alert user if an error occurs during data loading
      }
      setLoading(false); // Set loading state to false after data loading
    };

    // Check if there are more data to load and not currently loading
    if (hasMore && !loading) {
      loadData(); // Load more data
    }
  }, [page]); 

  // useEffect to observe intersection for infinite scrolling
  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create a new observer
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    // Observe the bottom element to trigger infinite scrolling
    if (cities.length > 0) {
      observer.current.observe(document.querySelector("#bottom") as Element);
    }

    // Cleanup observer on component unmount
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [cities, hasMore]); // Trigger useEffect when cities or hasMore state changes

 
  useEffect(() => {
    // Function to filter cities
    const filterCities = () => {
      let filtered = cities; 
      
      // If search input is not empty, filter cities by name
      if (searchInput.trim() !== "") {
        filtered = filtered.filter((city) =>
          city.name.toLowerCase().includes(searchInput.toLowerCase())
        );
      }

      // Update filtered cities state
      setFilteredCities(filtered);
    };

    filterCities(); // Call filterCities function
  }, [cities, searchInput]); // Trigger useEffect when cities or searchInput state changes

  // useEffect to sort filtered cities based on column and order
  useEffect(() => {
    // Function to sort cities
    const sortCities = () => {
      if (sortBy) {
        // Create a copy of filtered cities array
        const sorted = [...filteredCities].sort((a, b) => {
          // Compare cities based on selected column and order
          if (sortBy === "name") {
            return (
              a.name.localeCompare(b.name) * (sortOrder === "asc" ? 1 : -1)
            );
          }
          if (sortBy === "country_name_en") {
            return (
              a.country_name_en.localeCompare(b.country_name_en) *
              (sortOrder === "asc" ? 1 : -1)
            );
          }
          if (sortBy === "timezone") {
            return (
              a.timezone.localeCompare(b.timezone) *
              (sortOrder === "asc" ? 1 : -1)
            );
          }
          if (sortBy === "population") {
            return (
              (a.population - b.population) * (sortOrder === "asc" ? 1 : -1)
            );
          }
          return 0; // Return 0 if sortBy value is not recognized
        });
        // Update filtered cities state with sorted array
        setFilteredCities(sorted);
      }
    };

    sortCities(); // Call sortCities function
  }, [filteredCities, sortBy, sortOrder]); // Trigger useEffect when filteredCities, sortBy or sortOrder state changes

  // Function to handle search input change
  const handleSearchInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchQuery = event.target.value.trim(); // Get search input value
    setSearchInput(searchQuery); // Update search input state

    // If search query is empty, reset to initial state
    if (searchQuery === "") {
      setFilteredCities([]); // Clear filtered cities
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      // Fetch search results from the API based on search query
      const response = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${searchQuery}&rows=50`
      );
      const data = await response.json();
      if (data && data.records && Array.isArray(data.records)) {
        // Map API records to City objects for searched cities
        const searchedCities = data.records.map((record: any) => ({
          name: record.fields.name,
          timezone: record.fields.timezone,
          population: record.fields.population,
          country_name_en: record.fields.cou_name_en,
        }));
        // Update filtered cities state with searched cities
        setFilteredCities(searchedCities);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("An error occurred while fetching search results."); // Alert user if an error occurs during search
    }

    setLoading(false); // Set loading state to false after search
  };

  // Function to handle sorting change
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order if column is already selected
    } else {
      setSortBy(column); // Set sort by column
      setSortOrder("asc"); // Set default sort order to ascending
    }
  };

  // Function to toggle dropdown state
  // const handleDropdownToggle = () => {
  //   setDropdownOpen(!dropdownOpen); // Toggle dropdown state
  // };

  // Return the JSX for the CityTable component
  return (
    <div className="max-w-6xl mx-auto px-4 overflow-y-auto overflow-x-auto md:overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 text-center">WEATHER APP</h1>
      <div className="relative mb-4">
        {/* Input field for city search */}
        <input
          type="text"
          placeholder="Search city..."
          className="w-full px-3 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        {/* Search icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Buttons for sorting */}
      <div className="flex flex-col md:flex-row justify-center items-center mb-4">
        <button
          className="px-3 py-2 w-full rounded-md border border-gray-300 mb-2 md:mb-0 md:mr-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onClick={() => handleSortChange("name")}
        >
          Sort by Name
        </button>
        <button
          className="px-3 py-2 w-full rounded-md border border-gray-300 mb-2 md:mb-0 md:mr-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onClick={() => handleSortChange("country_name_en")}
        >
          Sort by Country
        </button>
        <button
          className="px-3 py-2 w-full rounded-md border border-gray-300 mb-2 md:mb-0 md:mr-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onClick={() => handleSortChange("timezone")}
        >
          Sort by Timezone
        </button>
        <button
          className="px-3 py-2 w-full rounded-md border border-gray-300 mb-2 md:mb-0 md:mr-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onClick={() => handleSortChange("population")}
        >
          Sort by Population
        </button>
      </div>

      {/* Table to display cities data */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                Country
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timezone
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                Population
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Render rows for filtered cities */}
            {filteredCities.map((city: City, index: number) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  {/* Link to weather details page for each city */}
                  <Link
                    to={`/weather/${city.name}`}
                    className="transition duration-300 hover:underline hover:text-indigo-500"
                  >
                    {city.name}
                  </Link>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {city.country_name_en}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{city.timezone}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {city.population}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Display loading indicator if loading */}
        {loading && <div>Loading...</div>}
        {/* Render bottom element for intersection observer */}
        {!loading && hasMore && (
          <div id="bottom" style={{ height: "1px" }}></div>
        )}
        {/* Display message when no more cities to load */}
        {!loading && !hasMore && <div>No more cities to load.</div>}
      </div>
    </div>
  );
};

export default CityTable; // Export the CityTable component
