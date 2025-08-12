/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { getCache, setCache } from "../utils/cache";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export default function Dashboard(){
  const [itineraries, setItineraries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cityImages, setCityImages] = useState({});

  useEffect(()=>{ let mounted=true; const fetchItins=async ()=>{
    setLoading(true);
    try{
      const res = await api.get('/itinerary');
      if(!mounted) return;
      setItineraries(res.data || []);
    }catch(err){ console.error(err); toast.error('Failed to load itineraries'); }
    finally{ if(mounted) setLoading(false); }
  }; fetchItins(); return ()=> mounted=false; },[]);

  useEffect(()=>{
    const cached = getCache('cityImages');
    if(cached){ setCityImages(cached); return; }
    const fetchImages = async () => {
      const images = {};
      await Promise.all(itineraries.map(async (itin) => {
        try{
          // NOTE: Prefer to proxy Unsplash via backend: /api/unsplash?query=City
          const res = await api.get('/unsplash', { params: { query: itin.city } });
          images[itin.city] = res.data?.url || res.data?.results?.[0]?.urls?.regular || null;
        }catch(err){ console.error('Unsplash fetch failed', err); }
      }));
      setCityImages(images);
      setCache('cityImages', images, 1000*60*60*24);
    };
    if(itineraries.length) fetchImages();
  }, [itineraries]);

  const handleDelete = async (index) => {
    const itinerary = itineraries[index];
    if (!itinerary) return;
    if (!window.confirm(`Delete itinerary for ${itinerary.city}?`)) return;
    try{
      await api.delete(`/itinerary/${itinerary._id}`);
      const updated = itineraries.filter((_,i)=>i!==index);
      setItineraries(updated);
      toast.info('Itinerary deleted');
    }catch(err){ console.error(err); toast.error('Deletion failed'); }
  };

  const filtered = itineraries.filter(it => it.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mt-5 py-5 mb-5">
      <h2 className="fw-bold text-dark mb-4 text-center">Saved Itineraries</h2>
      <div className="input-group mb-5 justify-content-center">
        <input type="text" className="form-control w-50 rounded-pill px-4 py-2 shadow-sm" placeholder="Search by city..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="alert alert-info text-center">No itineraries found.</div>
      ) : (
        <div className="row">
          {filtered.map((itin, index)=> (
            <motion.div key={itin._id} className="col-md-6 col-lg-4 mb-4" initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:index*0.08}}>
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
                {cityImages[itin.city] ? (
                  <div style={{height:200, overflow:'hidden', backgroundColor:'#333'}} className="position-relative">
                    <img src={cityImages[itin.city]} alt={`View of ${itin.city}`} className="w-100 h-100 object-fit-cover" style={{filter:'brightness(65%)'}} />
                    <div className="position-absolute bottom-0 start-0 p-3 text-white">
                      <h5 className="fw-bold text-capitalize mb-1">{itin.city}</h5>
                      <small className="text-light">{format(new Date(itin.date), 'MMM d, yyyy')}</small>
                    </div>
                  </div>
                ) : null}

                <div className="card-body d-flex flex-column bg-light-subtle">
                  <ul className="ps-3 mb-3">
                    {itin.places.map((place,i)=> (
                      <li key={i} className="mb-1 d-flex align-items-start text-secondary">
                        <i className="bi bi-geo-alt-fill text-dark me-2" aria-hidden />
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(itin.city + ' ' + place.name)}`} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center" style={{color:'#212529', textDecoration:'none'}}> {place.name}</a>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(itin.city)}`} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" target="_blank" rel="noopener noreferrer"><i className="bi bi-map"/> Map</a>
                    <button className="btn btn-danger btn-sm d-flex align-items-center gap-1" onClick={()=>handleDelete(index)}><i className="bi bi-trash"/> Delete</button>
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