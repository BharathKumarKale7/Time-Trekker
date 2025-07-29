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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Explore Your Destination</h1>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Enter city"
          className="border p-2 rounded w-full md:w-64"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="number"
          min={1}
          max={12}
          className="border p-2 rounded w-full md:w-32"
          placeholder="Hours"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        />

        <button
          onClick={fetchData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {weather && (
        <div className="bg-blue-50 p-4 rounded mb-6 shadow">
          <h2 className="text-xl font-semibold mb-2">
            Weather in {weather.city}
          </h2>
          <div className="flex items-center gap-4">
            <div>
              <p className="capitalize">{weather.description}</p>
              <p>{weather.temperature}°C</p>
            </div>
          </div>
        </div>
      )}

      {itinerary.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Suggested Itinerary (Next {hours} hr)</h2>
          <ol className="list-decimal ml-6 mt-2 space-y-2">
            {itinerary.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong> — {item.address}
              </li>
            ))}
          </ol>
        </div>
      )}

      {places.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Recommended Places</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {places.map((place, index) => (
              <div key={index} className="p-4 border rounded shadow bg-white">
                <h3 className="font-bold">{place.name}</h3>
                <p>{place.address}</p>
                <p>Rating: {place.rating} ⭐ ({place.userRatingsTotal} reviews)</p>
                {place.photo && (
                  <img
                    src={place.photo}
                    alt={place.name}
                    className="mt-2 rounded w-full h-40 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;
