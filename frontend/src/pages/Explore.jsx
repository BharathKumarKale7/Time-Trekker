/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import authEvent from "../utils/authEvent";
import { generateItinerary } from "../utils/itinerary";
import { motion } from "framer-motion";
import { isLoggedIn } from "../utils/auth";
import { toast } from "react-toastify";
import { getCache, setCache } from "../utils/cache";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  // State variables
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [places, setPlaces] = useState([]);
  const [hours, setHours] = useState(4);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [auth, setAuth] = useState(isLoggedIn());
  const navigate = useNavigate();
  const geolocationRef = useRef(null); // To persist user geolocation

  // Listen for login/logout events and update state
  useEffect(() => {
    const onAuth = () => setAuth(isLoggedIn());
    authEvent.subscribe(onAuth);
    return () => authEvent.unsubscribe(onAuth);
  }, []);

  // Load cached geolocation if available
  useEffect(() => {
    const cachedGeo = getCache('userGeo');
    if (cachedGeo) geolocationRef.current = cachedGeo;
  }, []);

  // Fetch weather and places for a city
  const fetchData = async () => {
    if (!city) return toast.warn('Please enter a city');
    setLoading(true);
    try {
      const [weatherRes, placesRes] = await Promise.all([
        api.get(`/weather/${city}`),
        api.get(`/places/${city}`)
      ]);
      setWeather(weatherRes.data);
      const results = placesRes.data?.results || [];
      setPlaces(results);
      setItinerary(generateItinerary(results, hours));
      setSaveSuccess(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Use geolocation to find nearby places
  const fetchNearbyPlaces = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported.");
    if (geolocationRef.current) return fetchNearbyWithCoords(geolocationRef.current);
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const geo = { lat: coords.latitude, lng: coords.longitude };
      setCache('userGeo', geo, 1000 * 60 * 30); // Cache for 30 mins
      geolocationRef.current = geo;
      await fetchNearbyWithCoords(geo);
      setLoading(false);
    }, (err) => {
      setLoading(false);
      toast.error('Failed to get location');
    });
  };

  // Fetch nearby recommended places using coordinates
  const fetchNearbyWithCoords = async (geo) => {
    try {
      const res = await api.get(`/places/recommend`, {
        params: { lat: geo.lat, lng: geo.lng, hours }
      });
      setWeather(null);
      const results = res.data.results || [];
      setPlaces(results);
      setItinerary(generateItinerary(results, hours));
      setSaveSuccess(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch nearby places');
    }
  };

  // Open Google Maps directions from user location to selected place
  const getDirections = (place) => {
    const cached = geolocationRef.current;
    if (!cached) return toast.info('Allow location to get directions.');
    const origin = `${cached.lat},${cached.lng}`;
    const destination = `${place.location.lat},${place.location.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // Save current itinerary to backend
  const handleSaveItinerary = async () => {
    if (!auth) return toast.info('Please log in to save itineraries.');
    if (!city) return toast.warn('City is required.');
    setSaving(true);
    try {
      const now = new Date();
      const start = now.toISOString();
      const end = new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
      await api.post('/itinerary', {
        city,
        startTime: start,
        endTime: end,
        budget: '',
        interests: [],
        places: itinerary
      });
      setSaveSuccess(true);
      toast.success('Saved itinerary');
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error('Failed to save itinerary');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="container mt-5 py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      {/* Header */}
      <h2 className="text-center fw-bold mb-5">Explore Destinations</h2>

      {/* Search section */}
      <div className="rounded-4 shadow p-4 mb-5 bg-light">
        <div className="row align-items-end g-3">
          <div className="col-md-5">
            <label className="form-label">City</label>
            <input type="text" className="form-control" placeholder="Enter city" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="form-label">Hours</label>
            <input type="number" min={1} max={12} className="form-control" value={hours} onChange={e => setHours(Number(e.target.value))} />
          </div>
          <div className="col-md-5 d-flex gap-2">
            <button className="btn btn-dark flex-fill" onClick={fetchData} disabled={loading}>
              {loading ? 'Loading...' : 'Search City'}
            </button>
            <button className="btn btn-outline-dark flex-fill" onClick={fetchNearbyPlaces} disabled={loading}>
              {loading ? 'Locating...' : 'Use My Location'}
            </button>
          </div>
        </div>
      </div>

      {/* Weather info */}
      {weather && (
        <div className="alert alert-info text-center rounded-3 mb-4">
          <h5 className="mb-1">Weather in {weather.city}</h5>
          <p className="mb-1 text-capitalize">{weather.description}</p>
          <h4 className="fw-bold">{weather.temperature}°C</h4>
        </div>
      )}

      {/* Save itinerary button */}
      {isLoggedIn() && itinerary.length > 0 && (
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-dark" onClick={handleSaveItinerary} disabled={saving}>
            {saving ? 'Saving...' : saveSuccess ? 'Saved ✔' : 'Save Itinerary'}
          </button>
        </div>
      )}

      {/* Suggested itinerary section */}
      {itinerary.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-3">Suggested Itinerary <span className="text-muted">(Next {hours} hrs)</span></h4>
          <ol className="list-group list-group-numbered">
            {itinerary.map((item, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-start gap-3">
                <div className="flex-grow-1">
                  <strong>{item.name}</strong> — <span className="text-muted">{item.address}</span>
                </div>
                {item.photo && (
                  <img src={item.photo} alt={item.name} className="rounded" style={{ width: 100, height: 70, objectFit: 'cover' }} />
                )}
                <button className="btn btn-sm btn-outline-primary" onClick={() => getDirections(item)}>
                  Get Directions
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* All recommended places */}
      {places.length > 0 && (
        <div>
          <h4 className="mb-4 text-dark">All Recommended Places</h4>
          <div className="row g-4 mb-5">
            {places.map((place, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  {place.photo && (
                    <img src={place.photo} alt={place.name} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{place.name}</h5>
                    <p className="card-text text-muted mb-1">{place.address}</p>
                    <p className="text-warning small mb-2">
                      ⭐ {place.rating ?? 'N/A'} ({place.userRatingsTotal ?? 0} reviews)
                    </p>
                    {place.travelTime && (
                      <p className="text-muted small">Travel Time: {place.travelTime}</p>
                    )}
                    <button className="btn btn-sm btn-outline-primary mt-auto" onClick={() => getDirections(place)}>
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Initial prompt if no search */}
      {!places.length && !loading && (
        <div className="alert alert-secondary text-center mt-5">
          Start your search above to explore destinations.
        </div>
      )}
    </motion.div>
  );
}
