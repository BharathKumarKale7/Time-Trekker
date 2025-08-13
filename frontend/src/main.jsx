import React from 'react';
import ReactDOM from 'react-dom/client';
import './Index.css'; // Global styles
import App from './App'; // Main app component
import { BrowserRouter } from "react-router-dom"; // Router for SPA navigation
import { ToastContainer } from "react-toastify"; // Toast notifications container
import "react-toastify/dist/ReactToastify.css"; // Toast styles

// Bootstrap styles and scripts for layout and components
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Create root and render the React app inside it
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter enables routing */}
    <BrowserRouter>
      {/* Main application component */}
      <App />
      {/* Toast container for showing notifications, positioned top-right, auto closes after 3s */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </React.StrictMode>
);
