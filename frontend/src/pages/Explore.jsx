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
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4 fw-bold">Explore Destinations</h2>

      <div className="row justify-content-center mb-5 g-3">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            min={1}
            max={12}
            className="form-control"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-primary w-100"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {weather && (
        <div className="alert alert-info text-center rounded-3">
          <h5 className="mb-1">Weather in {weather.city}</h5>
          <p className="mb-1 text-capitalize">{weather.description}</p>
          <h4>{weather.temperature}°C</h4>
        </div>
      )}

      {itinerary.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-3 text-primary">Suggested Itinerary (Next {hours} hr)</h4>
          <ol className="list-group list-group-numbered">
            {itinerary.map((item, i) => (
              <li key={i} className="list-group-item">
                <strong>{item.name}</strong> — {item.address}
              </li>
            ))}
          </ol>
        </div>
      )}

      {places.length > 0 && (
        <div>
          <h4 className="mb-3 text-primary">All Recommended Places</h4>
          <div className="row g-4">
            {places.map((place, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{place.name}</h5>
                    <p className="card-text">{place.address}</p>
                    <p className="text-warning mb-0">
                      Rating: {place.rating ?? "N/A"} ⭐ ({place.userRatingsTotal ?? 0} reviews)
                    </p>
                  </div>
                  {place.photo && (
                    <img
                      src={place.photo}
                      alt={place.name}
                      className="card-img-bottom img-fluid rounded-bottom"
                      style={{ maxHeight: "180px", objectFit: "cover" }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {places.length === 0 && !loading && (
        <div className="alert alert-secondary text-center mt-4">
          Start your search above to explore destinations.
        </div>
      )}
    </div>
  );
}

export default Explore;
