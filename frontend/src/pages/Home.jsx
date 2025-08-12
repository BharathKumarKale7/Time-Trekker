/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../utils/motionVariants";

export default function Home(){
  return (
    <div className="fluid-container mt-5">
      <motion.header className="hero text-white d-flex flex-column align-items-center justify-content-center text-center" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1}}>
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="display-4 fw-bold">TimeTrekker</h1>
          <p className="lead mb-4">Smart, personalized travel itineraries for any stopover or short trip.</p>
          <Link to="/login" className="btn btn-warning btn-lg">Start Exploring</Link>
        </motion.div>
      </motion.header>

      <section className="py-5 bg-light text-center">
        <div className="container">
          <motion.h2 className="mb-4 fw-bold" variants={fadeUp} initial="hidden" animate="visible" custom={1}>Why TimeTrekker?</motion.h2>
          <motion.div className="row g-4" variants={staggerContainer} initial="hidden" animate="visible">
            {[{icon:'bi-clock-history', title:'Time-Optimized Plans', desc:'Make the most of short durations and layovers efficiently.', color:'text-primary'},
              {icon:'bi-cloud-sun', title:'Weather-Aware Suggestions', desc:'Smart choices based on real-time weather conditions.', color:'text-info'},
              {icon:'bi-geo-alt', title:'Nearby Attractions', desc:'Get curated lists of the best-rated places around you.', color:'text-danger'},
              {icon:'bi-phone', title:'Mobile-Friendly', desc:'Plan on the go with a clean, responsive design.', color:'text-success'}].map((item,i)=> (
              <motion.div className="col-md-3" key={item.title} variants={fadeUp} custom={i+2}>
                <i className={`bi ${item.icon} display-5 ${item.color}`}></i>
                <h5 className="mt-3">{item.title}</h5>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-5">
        <div className="container text-center">
          <motion.h2
            className="fw-bold mb-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="row g-5 justify-content-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                title: "1. Enter Your City & Hours",
                desc: "Tell us where you are and how much time you have.",
              },
              {
                title: "2. View Smart Itinerary",
                desc: "We generate a route based on your interests, distance, and time.",
              },
              {
                title: "3. Explore & Enjoy",
                desc: "Follow the personalized plan and make the most of your time.",
              },
            ].map((step, i) => (
              <motion.div
                className="col-md-4"
                key={step.title}
                variants={fadeUp}
                custom={i + 2}
              >
                <h5>{step.title}</h5>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.section className="py-5 bg-dark text-white text-center mb-5" initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:1}} viewport={{once:true}}>
        <div className="container">
          <motion.h2 className="mb-4" variants={fadeUp} initial="hidden" animate="visible">Ready to Discover More on Every Trip?</motion.h2>
          <motion.p className="lead mb-4" variants={fadeUp} initial="hidden" animate="visible" custom={1}>Join thousands of smart travelers using TimeTrekker to make the most of their journeys.</motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}><Link to="/login" className="btn btn-light btn-lg">{"\u{1F680}"} {" "}Start Free Now</Link></motion.div>
        </div>
      </motion.section>
    </div>
  );
}