import { useEffect, useState } from "react";
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
    <div className="container mt-5 py-5">
      <h2 className="fw-bold text-dark mb-4 text-center">Your Saved Itineraries</h2>

      {message && (
        <div className="alert alert-success text-center rounded-3">{message}</div>
      )}

      <div className="input-group mb-4 justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredItineraries.length === 0 ? (
        <div className="alert alert-info text-center rounded-3">
          No itineraries found.
        </div>
      ) : (
        <div className="row">
          {filteredItineraries.map((itin, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
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
                      className="btn btn-outline-dark btn-sm"
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
  );
}

export default Dashboard;
