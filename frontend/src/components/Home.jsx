import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="fluid-container mt-5">
      <div className="hero text-white d-flex flex-column align-items-center justify-content-center text-center">
        <div>
          <h1 className="display-4 fw-bold">TimeTrekker</h1>
          <p className="lead mb-4">
            Smart, personalized travel itineraries for any stopover or short trip.
          </p>
          <Link to="/login" className="btn btn-warning btn-lg">
            Start Exploring
          </Link>
        </div>
      </div>

      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="mb-4 fw-bold">Why TimeTrekker?</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <i className="bi bi-clock-history display-5 text-primary"></i>
              <h5 className="mt-3">Time-Optimized Plans</h5>
              <p>Make the most of short durations and layovers efficiently.</p>
            </div>
            <div className="col-md-3">
              <i className="bi bi-cloud-sun display-5 text-info"></i>
              <h5 className="mt-3">Weather-Aware Suggestions</h5>
              <p>Smart choices based on real-time weather conditions.</p>
            </div>
            <div className="col-md-3">
              <i className="bi bi-geo-alt display-5 text-danger"></i>
              <h5 className="mt-3">Nearby Attractions</h5>
              <p>Get curated lists of the best-rated places around you.</p>
            </div>
            <div className="col-md-3">
              <i className="bi bi-phone display-5 text-success"></i>
              <h5 className="mt-3">Mobile-Friendly</h5>
              <p>Plan on the go with a clean, responsive design.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">How It Works</h2>
          <div className="row g-5 justify-content-center">
            <div className="col-md-4">
              <h5>1. Enter Your City & Hours</h5>
              <p>Tell us where you are and how much time you have.</p>
            </div>
            <div className="col-md-4">
              <h5>2. View Smart Itinerary</h5>
              <p>We generate a route based on your interests, distance, and time.</p>
            </div>
            <div className="col-md-4">
              <h5>3. Explore & Enjoy</h5>
              <p>Follow the personalized plan and make the most of your time.</p>
            </div>
          </div>
          <Link to="/login" className="btn btn-dark mt-4 mb-5">
            Plan My Trip
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
