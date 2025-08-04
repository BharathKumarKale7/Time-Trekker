import { useState } from "react";
import api from "../services/api";

function Itinerary() {
  const [city, setCity] = useState("");
  const [places, setPlaces] = useState([{ name: "" }]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleAddPlace = () => {
    setPlaces([...places, { name: "" }]);
  };

  const handleSave = async () => {
    // Basic validation
    if (
      !city.trim() ||
      !startTime.trim() ||
      !endTime.trim() ||
      places.some((p) => !p.name.trim())
    ) {
      alert(
        "Please fill in all fields: city, start time, end time, and all place names."
      );
      return;
    }

    try {
      await api.post("/itinerary", {
        city,
        places,
        startTime,
        endTime,
        date: new Date().toISOString(),
      });
      alert("Itinerary saved!");
      setCity("");
      setStartTime("");
      setEndTime("");
      setPlaces([{ name: "" }]);
    } catch (err) {
      alert("Failed to save");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center text-dark fw-bold mb-4">Save a Custom Itinerary</h2>
      <div className="card shadow-sm p-4 mb-5">
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

        {/* New inputs for startTime and endTime */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Start Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">End Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Places</label>
          {places.map((place, idx) => (
            <div key={place.name + idx} className="mb-2">
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
          <button onClick={handleSave} className="btn btn-dark">
            Save Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}

export default Itinerary;
