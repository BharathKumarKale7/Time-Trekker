/* eslint-disable */
import { useState, useEffect } from "react";
import api from "../services/api";
import { format } from "date-fns";
import { toast } from "react-toastify";

function Events() {
  const [events, setEvents] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchByCity("London"); // default
  }, []);

  const fetchByCity = async city => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/events", { params: { city } });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load events by city");
    } finally {
      setLoading(false);
    }
  };

  const fetchByLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation unsupported");
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords;
          const res = await api.get("/events", { params: { lat, lng } });
          setEvents(res.data);
        } catch (err) {
          console.error(err);
          setError("Failed to load events by location");
        } finally {
          setLoading(false);
        }
      },
      err => {
        setLoading(false);
        toast.error("Could not fetch location");
      }
    );
  };

  return (
    <div className="container mt-5 py-5">
      <h2 className="text-center mb-4">Events & Festivals</h2>
      <div className="row mb-4 align-items-end">
        <div className="col-md-6">
          <label>Search by City</label>
          <input
            className="form-control"
            placeholder="e.g. Tokyo"
            value={searchCity}
            onChange={e => setSearchCity(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-primary w-100"
            onClick={() => fetchByCity(searchCity)}
            disabled={loading}
          >
            Search City
          </button>
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={fetchByLocation}
            disabled={loading}
          >
            Use My Location
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading events...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : events.length === 0 ? (
        <div className="alert alert-info">No events found.</div>
      ) : (
        <div className="row g-4">
          {events.map(evt => (
            <div className="col-md-6 col-lg-4" key={evt.id}>
              <div className="card h-100 shadow-sm">
                {evt.image && <img src={evt.image} alt={evt.name} className="card-img-top" />}
                <div className="card-body">
                  <h5>{evt.name}</h5>
                  <p className="text-muted">{evt.city}</p>
                  <p><i className="bi bi-calendar-event me-1" />{format(new Date(evt.date), "PPP")}</p>
                  <p className="small mb-3">{evt.description}</p>
                  <a href={evt.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
