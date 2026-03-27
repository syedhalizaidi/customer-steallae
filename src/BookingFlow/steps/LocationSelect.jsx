import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../BookingContext';
import { MapPin, Search, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to update map view when coordinates change
const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const LocationSelect = () => {
  const { business, updateBooking, bookingData } = useBooking();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const [coords, setCoords] = useState([43.6532, -79.3832]); // Default Toronto
  const [geocoding, setGeocoding] = useState(false);

  // Use business locations from context
  const locations = business?.locations?.length > 0 ? business.locations : [];

  const activeLoc = bookingData?.location || locations[0];

  useEffect(() => {
    if (!activeLoc) return;

    const geocode = async () => {
      setGeocoding(true);
      try {
        const fullAddress = [
          activeLoc.street_address || activeLoc.address,
          activeLoc.city,
          activeLoc.state,
          activeLoc.zip_code,
          activeLoc.country
        ].filter(Boolean).join(', ');

        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (err) {
        console.error('Geocoding failed:', err);
      } finally {
        setGeocoding(false);
      }
    };

    geocode();
  }, [activeLoc]);

  const handleSelectLocation = (location) => {
    updateBooking('location', location);
    navigate(`/book/${businessId}/professional`);
  };

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row bg-white animate-in fade-in duration-700">
      {/* Left Column: List */}
      <div className="w-full md:w-[450px] flex flex-col p-8 md:p-12 z-10 overflow-y-auto border-r border-[var(--border-primary)]">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-black tracking-tighter uppercase mb-2">
            Choose a location
          </h2>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
            Select one of our branches
          </p>
        </div>

        <div className="space-y-4">
          {locations.map((loc) => {
            const fullAddress = `${loc.street_address || ''}, ${loc.city || ''}, ${loc.state || ''} ${loc.zip_code || ''}`;
            return (
              <div 
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className="flex items-start gap-4 p-4 rounded-3xl border border-[var(--border-primary)] hover:border-black cursor-pointer transition-all group hover:shadow-xl"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[var(--border-primary)] bg-gray-50 flex items-center justify-center">
                  {loc.image ? (
                    <img src={loc.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <MapPin size={24} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xs font-black text-black uppercase tracking-tight mb-1">
                    {loc.city || 'Our Branch'}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 leading-relaxed italic">
                    {fullAddress}
                  </p>
                </div>
              </div>
            );
          })}
          {locations.length === 0 && (
            <div className="py-20 text-center">
               <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No locations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Leaflet Map */}
      <div className="hidden md:block flex-1 relative bg-gray-50 overflow-hidden">
        <MapContainer 
          center={coords} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          dragging={true}
          touchZoom={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          className="" 
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={coords} />
          {activeLoc && (
            <Marker 
              position={coords} 
              interactive={false} // "Not selectable" - click does nothing
            />
          )}
        </MapContainer>

        {/* Custom Actions for Map */}
        <div className="absolute top-10 right-10 flex flex-col gap-2 z-[1000]">
           <button className="px-4 py-2 bg-white rounded-md shadow-lg border border-black/5 text-black font-black uppercase text-[9px] tracking-widest hover:scale-105 transition-all" onClick={() => window.open(`https://www.google.com/maps?q=${coords[0]},${coords[1]}`, '_blank')}>
              View on Google Maps
           </button>
        </div>

        {!activeLoc && (
          <div className="absolute inset-0 bg-white/20 pointer-events-none flex items-center justify-center z-[1001]">
             <div className="p-4 bg-white/90 rounded-2xl shadow-xl border border-black/10 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-black">Select a location to see on map</p>
             </div>
          </div>
        )}

        {geocoding && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-[1001] flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelect;
