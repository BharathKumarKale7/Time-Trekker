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
    } catch (err) {
      alert("Failed to save");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="container py-5">
        <h2 className="mb-4 text-primary fw-bold text-center">Save a Custom Itinerary</h2>
        
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <label className="form-label">Places</label>
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

        <div className="d-flex gap-2 mt-3">
          <button onClick={handleAddPlace} className="btn btn-secondary">
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
