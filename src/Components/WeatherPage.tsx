import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Importing video assets for different weather conditions
import snowVideo from "../assets/Videos/snow.mp4";
import rainyVideo from "../assets/Videos/rainy.mp4";
import lightRainVideo from "../assets/Videos/light rain.mp4";
import thunderstromVideo from "../assets/Videos/thunderstrom.mp4";
import showerRainVideo from "../assets/Videos/shower rain.mp4";
import drizzleRainVideo from "../assets/Videos/drizzle.mp4";
import brokenCloudVideo from "../assets/Videos/broken cloud.mp4";
import fewCloudVideo from "../assets/Videos/few cloud.mp4";
import scatteredCloudVideo from "../assets/Videos/scattered cloud.mp4";
import overcastCloudVideo from "../assets/Videos/overcast cloud.mp4";
import clearSkyVideo from "../assets/Videos/clear.mp4";
import defaultVideo from "../assets/Videos/default.mp4";
import hazeVideo from "../assets/Videos/haze.mp4";

// Interfaces for current weather data
interface MainWeather {
  temp: number;
  humidity: number;
  pressure: number;
}

interface Weather {
  description: string;
}

interface Wind {
  speed: number;
}

interface CurrentWeather {
  main: MainWeather;
  weather: Weather[];
  wind: Wind;
}

// Interfaces for forecast data
interface ForecastMain {
  temp_min: number;
  temp_max: number;
}

interface ForecastWeather {
  description: string;
}

interface ForecastList {
  dt_txt: string;
  main: ForecastMain;
  weather: ForecastWeather[];
  pop: number;
}

interface ForecastData {
  list: ForecastList[];
}

function WeatherPage() {
  // State variables
  const [weatherData, setWeatherData] = useState<CurrentWeather | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get the city name from the URL params
  const { cityName } = useParams<{ cityName: string }>();

  // Fetch weather data and forecast data when component mounts
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Fetch current weather data
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=0e0ca64278d9c08173974c0f7236f498&units=metric`
        );
        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const weatherData: CurrentWeather = await weatherResponse.json();
        setWeatherData(weatherData);

        // Fetch forecast data
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=0e0ca64278d9c08173974c0f7236f498&units=metric`
        );
        if (!forecastResponse.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        const forecastData: ForecastData = await forecastResponse.json();
        setForecastData(forecastData);

        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [cityName]);

  // Render loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state if there's an error fetching data
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render if weather data or forecast data is not available
  if (!weatherData || !forecastData) {
    return <div>No weather data available</div>;
  }

  // Determine which video to display based on weather description
  let videoSource = "";
  switch (weatherData.weather[0].description.toLowerCase()) {
    case "clear sky":
      videoSource = clearSkyVideo;
      break;
    case "few clouds":
      videoSource = fewCloudVideo;
      break;
    case "scattered clouds":
      videoSource = scatteredCloudVideo;
      break;
    case "broken clouds":
      videoSource = brokenCloudVideo;
      break;
    case "overcast clouds":
      videoSource = overcastCloudVideo;
      break;
    case "shower rain":
      videoSource = showerRainVideo;
      break;
    case "rain":
      videoSource = rainyVideo;
      break;
    case "thunderstorm":
      videoSource = thunderstromVideo;
      break;
    case "drizzle":
      videoSource = drizzleRainVideo;
      break;
    case "light rain":
      videoSource = lightRainVideo;
      break;
    case "snow":
      videoSource = snowVideo;
      break;
    case "haze":
      videoSource = hazeVideo;
      break;
    default:
      videoSource = defaultVideo;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Weather details container */}
      <div className="rounded-md mb-8 weather-card">
        {/* Weather details text with video background */}
        <div className="weather-details h-80 relative flex items-center justify-center">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 object-cover w-full h-full rounded-lg"
          >
            <source src={videoSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Text content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Weather details text */}
            <div className="text-center text-white z-10 p-4 rounded-md">
              {/* Weather information */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-4"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                Weather for {cityName}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                Temperature: {weatherData.main.temp} °C
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`text-${weatherData.weather[0].description.toLowerCase()}-500`}
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                Weather: {weatherData.weather[0].description}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                Humidity: {weatherData.main.humidity}%
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                Wind Speed: {weatherData.wind.speed} m/s
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                Pressure: {weatherData.main.pressure} hPa
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forecastData.list.map((item: ForecastList, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-100 p-4 rounded-md"
          >
            {/* Forecast information */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold mb-2"
            >
              Forecast
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500"
            >
              Date: {item.dt_txt}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-green-500"
            >
              Min Temperature: {item.main.temp_min} °C
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-red-500"
            >
              Max Temperature: {item.main.temp_max} °C
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-yellow-500"
            >
              Weather: {item.weather[0].description}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-blue-500"
            >
              Probability of Precipitation: {item.pop * 100}%
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default WeatherPage;
