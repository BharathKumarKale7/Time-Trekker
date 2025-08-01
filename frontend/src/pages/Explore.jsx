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

  const fetchNearbyPlaces = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported by your browser.");
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await api.get(
            `/places/recommend?lat=${latitude}&lng=${longitude}&hours=${hours}`
          );

          setWeather(null); // No weather if city not used
          setPlaces(res.data.results);

          const planned = generateItinerary(res.data.results, hours);
          setItinerary(planned);
        } catch (err) {
          alert("Failed to fetch nearby places.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Failed to get location.");
        setLoading(false);
      }
    );
  };

  const getDirections = (place) => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        const destination = `${place.location.lat},${place.location.lng}`;
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

        window.open(googleMapsUrl, "_blank");
      },
      () => {
        alert("Could not get your location for directions.");
      }
    );
  };


  return (
    <div className="container mt-5 p-5">
      <h2 className="text-center text-dark fw-bold mb-4">Explore Destinations</h2>

      {/* Search Inputs */}
      <div className="row justify-content-center align-items-end g-3 mb-4">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city (or use location)"
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
        <div className="col-md-3 d-flex gap-2">
          <button
            className="btn btn-dark w-50"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search City"}
          </button>
          <button
            className="btn btn-outline-secondary w-50"
            onClick={fetchNearbyPlaces}
            disabled={loading}
          >
            {loading ? "Locating..." : "Use My Location"}
          </button>
        </div>
      </div>

      {/* Weather Info */}
      {weather && (
        <div className="alert alert-info text-center rounded-3 mb-4">
          <h5 className="mb-1">Weather in {weather.city}</h5>
          <p className="mb-1 text-capitalize">{weather.description}</p>
          <h4>{weather.temperature}°C</h4>
        </div>
      )}

      {/* Suggested Itinerary */}
      {itinerary.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-3 text-dark">
            Suggested Itinerary (Next {hours} hr)
          </h4>
          <ol className="list-group list-group-numbered">
            {itinerary.map((item, i) => (
              <li key={i} className="list-group-item d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                <div className="flex-grow-1">
                  <strong>{item.name}</strong> — {item.address}
                </div>

                {item.photo && (
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="rounded"
                    style={{ width: "100px", height: "80px", objectFit: "cover" }}
                  />
                )}

                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => getDirections(item)}
                >
                  Get Directions
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
      
      {/* Recommended Places */}
      {places.length > 0 ? (
        <div>
          <h4 className="mb-3 text-dark">All Recommended Places</h4>
          <div className="row g-4 mb-5">
            {places.map((place, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{place.name}</h5>
                    <p className="card-text">{place.address}</p>
                    <p className="text-warning mb-0">
                      <p className="text-warning mb-1">
                        Rating: {place.rating ?? "N/A"} ⭐ ({place.userRatingsTotal ?? 0} reviews)
                      </p>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => getDirections(place)}
                      >
                        Get Directions
                      </button>
                    </p>
                    {place.travelTime && (
                      <p className="text-muted small">Travel Time: {place.travelTime}</p>
                    )}
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
      ) : (
        !loading && (
          <div className="alert alert-secondary text-center mt-4 mb-5">
            Start your search above to explore destinations.
          </div>
        )
      )}
    </div>
  );
}

export default Explore;
