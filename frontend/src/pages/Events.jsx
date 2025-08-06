/* eslint-disable */
import { useState, useEffect } from "react";
import api from "../services/api";
import { format } from "date-fns";
import { motion } from "framer-motion";

function Events() {
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState();
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const res = await api.get("/events", { params: { city } });
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container mt-5 py-5 mb-5">
      <h2 className="mb-4 text-center fw-bold">🎭 Upcoming Events in {city}</h2>

      <div className="row mb-4">
        <div className="col-md-8 mb-3">
          <input
            className="form-control"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-dark w-100"
            onClick={fetchEvents}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search Events"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center">No events found for this city.</p>
      ) : (
        <div className="row g-4">
          {events.map((evt) => (
            <motion.div
              key={evt.id}
              className="col-md-6 col-lg-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card h-100 shadow-sm">
                {evt.image && (
                  <img
                    src={evt.image}
                    alt={evt.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{evt.name}</h5>
                  <p className="mb-1 text-muted">{evt.venue}, {evt.city}</p>
                  <p className="mb-2 small">📅 {format(new Date(evt.date), "PP")} ⏰ {evt.time || "N/A"}</p>
                  <a
                    href={evt.url}
                    className="btn btn-sm btn-outline-primary mt-auto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
