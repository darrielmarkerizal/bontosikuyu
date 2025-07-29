"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Cloudy, MapPin } from "lucide-react";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  location: string;
  humidity?: number;
  windSpeed?: number;
}

interface WeatherWidgetProps {
  className?: string;
}

export function WeatherWidget({ className = "" }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Coordinates for location fallback (Kepulauan Selayar, South Sulawesi)
  const coordinates = {
    lat: -6.8167, // Kepulauan Selayar latitude
    lon: 120.8167, // Kepulauan Selayar longitude
  };

  const getWeatherIcon = (weatherCode: number) => {
    // WMO Weather interpretation codes
    if (weatherCode === 0) return <Sun className="h-4 w-4 text-yellow-500" />; // Clear sky
    if (weatherCode >= 1 && weatherCode <= 3)
      return <Cloudy className="h-4 w-4 text-gray-500" />; // Partly cloudy
    if (weatherCode >= 45 && weatherCode <= 48)
      return <Cloud className="h-4 w-4 text-gray-600" />; // Foggy
    if (weatherCode >= 51 && weatherCode <= 67)
      return <CloudRain className="h-4 w-4 text-blue-500" />; // Rain
    if (weatherCode >= 71 && weatherCode <= 77)
      return <CloudRain className="h-4 w-4 text-blue-400" />; // Snow
    if (weatherCode >= 80 && weatherCode <= 82)
      return <CloudRain className="h-4 w-4 text-blue-600" />; // Rain showers
    if (weatherCode >= 85 && weatherCode <= 86)
      return <CloudRain className="h-4 w-4 text-blue-400" />; // Snow showers
    if (weatherCode >= 95 && weatherCode <= 99)
      return <CloudRain className="h-4 w-4 text-purple-500" />; // Thunderstorm

    return <Cloud className="h-4 w-4 text-gray-500" />; // Default
  };

  const getWeatherDescription = (weatherCode: number) => {
    if (weatherCode === 0) return "Cerah";
    if (weatherCode >= 1 && weatherCode <= 3) return "Berawan";
    if (weatherCode >= 45 && weatherCode <= 48) return "Berkabut";
    if (weatherCode >= 51 && weatherCode <= 67) return "Hujan";
    if (weatherCode >= 71 && weatherCode <= 77) return "Salju";
    if (weatherCode >= 80 && weatherCode <= 82) return "Hujan Ringan";
    if (weatherCode >= 85 && weatherCode <= 86) return "Hujan Salju";
    if (weatherCode >= 95 && weatherCode <= 99) return "Badai Petir";

    return "Tidak Diketahui";
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using OpenMeteo API (free, no API key required)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FMakassar`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data cuaca");
        }

        const data = await response.json();

        if (data.current) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
            location: "Kepulauan Selayar",
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
          });
        } else {
          throw new Error("Data cuaca tidak tersedia");
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
        setError("Tidak dapat memuat cuaca");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm ${className}`}
      >
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
          <div className="h-4 w-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm ${className}`}
      >
        <Cloud className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">Cuaca tidak tersedia</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm hover:bg-white/90 transition-colors ${className}`}
    >
      <div className="flex items-center gap-1">
        {getWeatherIcon(weather.weatherCode)}
        <span className="text-sm font-medium text-gray-700">
          {weather.temperature}°C
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <MapPin className="h-3 w-3" />
        <span>{weather.location}</span>
      </div>
      <div className="text-xs text-gray-500">
        {getWeatherDescription(weather.weatherCode)}
      </div>
    </div>
  );
}
