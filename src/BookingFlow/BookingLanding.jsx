import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from './BookingContext';
import { MapPin, ArrowRight } from 'lucide-react';

const BookingLanding = () => {
  const { business } = useBooking();
  const navigate = useNavigate();
  const { businessId } = useParams();

  const handleStartBooking = () => {
    // If multiple locations, go to location select. Otherwise go to professional select.
    // For now, let's assume multiple locations as in the image.
    navigate(`/location`);
  };

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row overflow-hidden bg-white">
      {/* Left Content Section */}
      <div className="w-full md:w-[40%] flex flex-col justify-center p-10 md:p-20 z-10 bg-white">
        <div className="mb-8">
          {business?.logo ? (
            <div className="w-24 h-24 mb-6 rounded-lg overflow-hidden">
              <img src={business.logo} alt="" className="w-full h-full invert object-contain" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-black text-white flex items-center justify-center font-black text-2xl rounded-lg mb-6 tracking-tighter">
              {business?.name?.substring(0, 4).toUpperCase() || 'STLA'}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-4 uppercase">
            {business?.name || 'Business Name'}
            <span className="text-sm align-top">™</span>
          </h1>
          
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <MapPin size={16} />
              <span className="text-sm font-bold uppercase tracking-wider">
                {business?.locations?.length || 0} locations available
              </span>
            </div>
            {business?.description && (
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tight leading-relaxed max-w-sm italic">
                "{business.description}"
              </p>
            )}
          </div>
          
          <button 
            onClick={handleStartBooking}
            className="w-full max-w-sm py-5 bg-black text-white text-sm font-black uppercase tracking-[0.2em] rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-xl"
          >
            Book now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="mt-auto text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {business?.business_type || 'Professional Services'}
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:block flex-1 relative overflow-hidden bg-gray-50">
        <div className="absolute inset-0 grayscale opacity-90 transition-all duration-1000 hover:grayscale-0">
          {business?.exterior_image ? (
            <img 
              src={business.exterior_image} 
              alt="Interior" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center shadow-inner" />
          )}
        </div>
        
        {/* Corner info like in the image */}
        {business?.locations?.[0] && (
          <div className="absolute bottom-10 right-10 bg-black p-4 text-white max-w-[250px] rounded-sm hidden lg:block shadow-2xl skew-x-[-1deg]">
             <p className="text-[10px] font-black uppercase tracking-tighter mb-1 border-b border-white/20 pb-1">Primary Location</p>
             <p className="text-[10px] font-bold text-white/80 leading-tight">
               {business.locations[0].street_address}, {business.locations[0].city}
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingLanding;
