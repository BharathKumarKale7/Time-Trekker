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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Save a Custom Itinerary</h1>
      <input
        type="text"
        placeholder="City"
        className="w-full border p-2 mb-4 rounded"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      {places.map((place, idx) => (
        <input
          key={idx}
          type="text"
          className="w-full border p-2 mb-2 rounded"
          placeholder={`Place ${idx + 1}`}
          value={place.name}
          onChange={(e) => {
            const newPlaces = [...places];
            newPlaces[idx].name = e.target.value;
            setPlaces(newPlaces);
          }}
        />
      ))}

      <div className="flex gap-2">
        <button
          onClick={handleAddPlace}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          + Add Place
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Itinerary
        </button>
      </div>
    </div>
  );
}

export default Itinerary;
