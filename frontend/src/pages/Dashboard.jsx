import React, { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [itineraries, setItineraries] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);

  const fetchItineraries = async () => {
    try {
      const res = await api.get("/itinerary");
      setItineraries(res.data);
    } catch (err) {
      console.error("Failed to fetch itineraries", err);
    }
  };

  const handleDelete = async (index) => {
    const city = itineraries[index].city;
    if (window.confirm(`Are you sure you want to delete the itinerary for ${city}?`)) {
      try {
        // Simulate deletion (replace with real API DELETE call if available)
        const updated = itineraries.filter((_, i) => i !== index);
        setItineraries(updated);
        setMessage(`Itinerary for ${city} deleted.`);
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        console.error("Failed to delete itinerary", err);
      }
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const filteredItineraries = itineraries.filter(itin =>
    itin.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h1 className="mb-4 fw-bold fs-3 text-center text-primary">Your Saved Itineraries</h1>

              {message && <div className="alert alert-success">{message}</div>}

              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {filteredItineraries.length === 0 ? (
                <div className="alert alert-info text-center">No itineraries found.</div>
              ) : (
                <div className="row g-4">
                  {filteredItineraries.map((itin, index) => (
                    <div key={index} className="col-md-6">
                      <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title text-capitalize fw-semibold">{itin.city}</h5>
                          <h6 className="card-subtitle mb-2 text-muted">{itin.date}</h6>
                          <ul className="mt-3 ps-3">
                            {itin.places.map((place, i) => (
                              <li key={i}>{place.name}</li>
                            ))}
                          </ul>
                          <div className="mt-auto d-flex justify-content-between align-items-center pt-3">
                            <a
                              href={`https://www.google.com/maps/search/${encodeURIComponent(itin.city)}`}
                              className="btn btn-outline-primary btn-sm"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Map
                            </a>
                            <button
                              onClick={() => handleDelete(index)}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default Dashboard;
