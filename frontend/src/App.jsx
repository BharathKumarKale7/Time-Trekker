import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";


function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/").then(res => setMessage(res.data));
  }, []);

  return <div className="p-4 text-center">{message}</div>;
}

export default App;
