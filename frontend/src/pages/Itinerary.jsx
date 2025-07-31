import React, { useState } from "react";
import api from "../services/api";

function Itinerary() {
  const [city, setCity] = useState("");
  const [places, setPlaces] = useState([{ name: "" }]);

  const handleAddPlace = () => {
    setPlaces([...places, { name: "" }]);
  };

  const handleSave = async () => {
    try {
      await api.post("/itinerary", {
        city,
        places,
        date: new Date().toISOString(),
      });
      alert("Itinerary saved!");
      setCity("");
      setPlaces([{ name: "" }]);
    } catch (err) {
      alert("Failed to save");
      console.error(err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center text-primary fw-bold mb-4">Save a Custom Itinerary</h2>

      <div className="card shadow-sm p-4">
        <div className="mb-3">
          <label className="form-label fw-semibold">City</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Places</label>
          {places.map((place, idx) => (
            <div key={idx} className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder={`Place ${idx + 1}`}
                value={place.name}
                onChange={(e) => {
                  const newPlaces = [...places];
                  newPlaces[idx].name = e.target.value;
                  setPlaces(newPlaces);
                }}
              />
            </div>
          ))}
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          <button onClick={handleAddPlace} className="btn btn-outline-secondary">
            + Add Place
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Save Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}

export default Itinerary;
