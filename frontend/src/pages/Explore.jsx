import React, { useState } from "react";
import api from "../services/api";
import { generateItinerary } from "../utils/itinerary";

function Explore() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [places, setPlaces] = useState([]);
  const [hours, setHours] = useState(4);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!city) return alert("Please enter a city");
    setLoading(true);

    try {
      const weatherRes = await api.get(`/weather/${city}`);
      const placesRes = await api.get(`/places/${city}`);

      setWeather(weatherRes.data);
      setPlaces(placesRes.data.results);

      const planned = generateItinerary(placesRes.data.results, hours);
      setItinerary(planned);
    } catch (err) {
      alert("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
        Explore Your Destination
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter city"
          className="border border-gray-300 rounded-md p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="number"
          min={1}
          max={12}
          className="border border-gray-300 rounded-md p-3 w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Hours"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        />

        <button
          onClick={fetchData}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-3 font-semibold shadow-md transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {weather && (
        <div className="bg-blue-50 p-4 rounded-md mb-6 shadow-sm border border-blue-200">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">
            Weather in {weather.city}
          </h2>
          <p className="capitalize text-gray-700">{weather.description}</p>
          <p className="text-2xl font-bold text-blue-800">{weather.temperature}°C</p>
        </div>
      )}

      {itinerary.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            Suggested Itinerary (Next {hours} hr)
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-800">
            {itinerary.map((item, i) => (
              <li key={i}>
                <span className="font-semibold">{item.name}</span> — {item.address}
              </li>
            ))}
          </ol>
        </section>
      )}

      {places.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            All Recommended Places
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {places.map((place, i) => (
              <div
                key={i}
                className="p-4 rounded-md border border-gray-200 shadow-sm bg-white"
              >
                <h3 className="font-semibold text-gray-900">{place.name}</h3>
                <p className="text-gray-600">{place.address}</p>
                <p className="mt-1 text-yellow-600">
                  Rating: {place.rating ?? "N/A"} ⭐ ({place.userRatingsTotal ?? 0} reviews)
                </p>
                {place.photo && (
                  <img
                    src={place.photo}
                    alt={place.name}
                    className="mt-3 rounded-md w-full h-40 object-cover shadow-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Explore;
