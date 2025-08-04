/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "../services/api";
import authEvent from "../utils/authEvent";
import { generateItinerary } from "../utils/itinerary";
import { motion } from "framer-motion";
import { isLoggedIn } from "../utils/auth";

function Explore() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [places, setPlaces] = useState([]);
  const [hours, setHours] = useState(4);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [auth, setAuth] = useState(isLoggedIn());

  useEffect(() => {
    const onAuthChange = () => {
      setAuth(isLoggedIn());
    };
    authEvent.subscribe(onAuthChange);
    return () => authEvent.unsubscribe(onAuthChange);
  }, []);

  const fetchData = async () => {
    if (!city) return alert("Please enter a city");
    setLoading(true);
    try {
      const weatherRes = await api.get(`/weather/${city}`);
      const placesRes = await api.get(`/places/${city}`);
      setWeather(weatherRes.data);
      setPlaces(placesRes.data.results);
      setItinerary(generateItinerary(placesRes.data.results, hours));
      setSaveSuccess(false);
    } catch (err) {
      alert("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyPlaces = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await api.get(
            `/places/recommend?lat=${coords.latitude}&lng=${coords.longitude}&hours=${hours}`
          );
          setWeather(null);
          setPlaces(res.data.results);
          setItinerary(generateItinerary(res.data.results, hours));
          setSaveSuccess(false);
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
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        const destination = `${place.location.lat},${place.location.lng}`;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        window.open(url, "_blank");
      },
      () => alert("Could not get your location for directions.")
    );
  };

  const handleSaveItinerary = async () => {
    if (!auth) return alert("Please log in to save itineraries.");
    if (!city) return alert("City is required.");

    setSaving(true);
    try {
      const now = new Date();
      const start = now.toISOString();
      const end = new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();

      await api.post("/itinerary", {
        city,
        startTime: start,
        endTime: end,
        budget: "",
        interests: [],
        places: itinerary,
      });
      setSaveSuccess(true);
    } catch (err) {
      alert("Failed to save itinerary");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="container mt-5 py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center fw-bold mb-5">Explore Destinations</h2>

      {/* Search Input Section */}
      <div className="rounded-4 shadow p-4 mb-5 bg-light">
        <div className="row align-items-end g-3">
          <div className="col-md-5">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Hours</label>
            <input
              type="number"
              className="form-control"
              min={1}
              max={12}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          </div>
          <div className="col-md-5 d-flex gap-2">
            <button
              className="btn btn-primary flex-fill"
              onClick={fetchData}
              disabled={loading}
            >
              {loading ? "Loading..." : "Search City"}
            </button>
            <button
              className="btn btn-outline-dark flex-fill"
              onClick={fetchNearbyPlaces}
              disabled={loading}
            >
              {loading ? "Locating..." : "Use My Location"}
            </button>
          </div>
        </div>
      </div>

      {/* Weather Info */}
      {weather && (
        <div className="alert alert-info text-center rounded-3 mb-4">
          <h5 className="mb-1">Weather in {weather.city}</h5>
          <p className="mb-1 text-capitalize">{weather.description}</p>
          <h4 className="fw-bold">{weather.temperature}°C</h4>
        </div>
      )}

      {/* Save Itinerary */}
      {auth && itinerary.length > 0 && (
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-success"
            onClick={handleSaveItinerary}
            disabled={saving}
          >
            {saving ? "Saving..." : saveSuccess ? "Saved ✔" : "Save Itinerary"}
          </button>
        </div>
      )}

      {/* Itinerary Results */}
      {itinerary.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-3">
            Suggested Itinerary{" "}
            <span className="text-muted">(Next {hours} hrs)</span>
          </h4>
          <ol className="list-group list-group-numbered">
            {itinerary.map((item, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-start gap-3"
              >
                <div className="flex-grow-1">
                  <strong>{item.name}</strong> —{" "}
                  <span className="text-muted">{item.address}</span>
                </div>
                {item.photo && (
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="rounded"
                    style={{ width: "100px", height: "70px", objectFit: "cover" }}
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

      {/* All Recommended Places */}
      {places.length > 0 && (
        <div>
          <h4 className="mb-4 text-dark">All Recommended Places</h4>
          <div className="row g-4 mb-5">
            {places.map((place, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  {place.photo && (
                    <img
                      src={place.photo}
                      alt={place.name}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{place.name}</h5>
                    <p className="card-text text-muted mb-1">{place.address}</p>
                    <p className="text-warning small mb-2">
                      ⭐ {place.rating ?? "N/A"} ({place.userRatingsTotal ?? 0} reviews)
                    </p>
                    {place.travelTime && (
                      <p className="text-muted small">Travel Time: {place.travelTime}</p>
                    )}
                    <button
                      className="btn btn-sm btn-outline-primary mt-auto"
                      onClick={() => getDirections(place)}
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!places.length && !loading && (
        <div className="alert alert-secondary text-center mt-5">
          Start your search above to explore destinations.
        </div>
      )}
    </motion.div>
  );
}

export default Explore;
