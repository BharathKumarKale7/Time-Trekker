/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../services/api";
import axios from "axios";
import { motion } from "framer-motion";
import { format } from "date-fns";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function Dashboard() {
  const [itineraries, setItineraries] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);
  const [cityImages, setCityImages] = useState({});

  // Fetch itineraries
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await api.get("/itinerary");
        setItineraries(res.data);
      } catch (err) {
        console.error("Failed to fetch itineraries", err);
      }
    };
    fetchItineraries();
  }, []);

  // Fetch images from Unsplash
  useEffect(() => {
    const fetchImages = async () => {
      const images = {};
      await Promise.all(
        itineraries.map(async (itin) => {
          try {
            const res = await axios.get("https://api.unsplash.com/search/photos", {
              params: { query: itin.city, per_page: 1 },
              headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
              },
            });
            images[itin.city] = res.data.results[0]?.urls?.regular;
          } catch (err) {
            console.error(`Image fetch failed for ${itin.city}`, err);
          }
        })
      );
      setCityImages(images);
    };

    if (itineraries.length > 0) fetchImages();
  }, [itineraries]);

  const handleDelete = async (index) => {
    const itinerary = itineraries[index];
    const city = itinerary.city;
    const id = itinerary._id;

    if (window.confirm(`Delete itinerary for ${city}?`)) {
      try {
        await api.delete(`/itinerary/${id}`);
        const updated = itineraries.filter((_, i) => i !== index);
        setItineraries(updated);
        setMessage(`Itinerary for ${city} deleted.`);
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        console.error("Failed to delete itinerary", err);
        alert("Deletion failed.");
      }
    }
  };

  const filteredItineraries = itineraries.filter((itin) =>
    itin.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5 py-5 mb-5">
      <h2 className="fw-bold text-dark mb-4 text-center display-5">
        Saved Itineraries
      </h2>

      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}

      <div className="input-group mb-5 justify-content-center">
        <input
          type="text"
          className="form-control w-50 rounded-pill px-4 py-2 shadow-sm"
          placeholder="Search by city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredItineraries.length === 0 ? (
        <div className="alert alert-info text-center">No itineraries found.</div>
      ) : (
        <div className="row">
          {filteredItineraries.map((itin, index) => (
            <motion.div
              key={itin._id}
              className="col-md-6 col-lg-4 mb-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
                {cityImages[itin.city] && (
                  <div
                    className="position-relative"
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      backgroundColor: "#333",
                    }}
                  >
                    <img
                      src={cityImages[itin.city]}
                      alt={itin.city}
                      className="w-100 h-100 object-fit-cover"
                      style={{ filter: "brightness(65%)" }}
                    />
                    <div className="position-absolute bottom-0 start-0 p-3 text-white">
                      <h5 className="fw-bold text-capitalize mb-1">
                        {itin.city}
                      </h5>
                      <small className="text-light">
                        {format(new Date(itin.date), "MMM d, yyyy")}
                      </small>
                    </div>
                  </div>
                )}

                <div className="card-body d-flex flex-column bg-light-subtle">
                  <ul className="ps-3 mb-3">
                    {itin.places.map((place, i) => (
                      <li
                        key={i}
                        className="mb-1 d-flex align-items-start text-secondary"
                      >
                        <i className="bi bi-geo-alt-fill text-dark me-2"></i>
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(itin.city + ' ' + place.name)}`} 
                          target="_blank" rel="noopener noreferrer" 
                          className="d-flex align-items-center "
                          style={{
                            color: "#212529",             
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = "#f0ad4e";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = "#212529";
                            e.target.style.textDecoration = "none";
                          }}>
                          {place.name}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(
                        itin.city
                      )}`}
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-map"></i> Map
                    </a>

                    <button
                      className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                      onClick={() => handleDelete(index)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
