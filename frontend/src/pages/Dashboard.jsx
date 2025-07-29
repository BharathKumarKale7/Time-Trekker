import React, { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [itineraries, setItineraries] = useState([]);

  const fetchItineraries = async () => {
    try {
      const res = await api.get("/itinerary");
      setItineraries(res.data);
    } catch (err) {
      console.error("Failed to fetch itineraries", err);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Saved Itineraries</h1>
      {itineraries.length === 0 ? (
        <p>No itineraries saved yet.</p>
      ) : (
        <div className="space-y-4">
          {itineraries.map((itin, index) => (
            <div key={index} className="p-4 bg-white rounded shadow">
              <h2 className="font-semibold text-lg">{itin.city}</h2>
              <p>{itin.date}</p>
              <ul className="list-disc ml-6 mt-2">
                {itin.places.map((place, i) => (
                  <li key={i}>{place.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
