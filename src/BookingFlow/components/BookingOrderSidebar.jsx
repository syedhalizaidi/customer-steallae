import React from 'react';
import { useBooking } from '../BookingContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { User, Briefcase, Calendar, ChevronRight, Clock } from 'lucide-react';
import { getLocalTimeFromWall } from '../../utils/timezoneUtils';

const BookingOrderSidebar = () => {
  const { bookingData, business, calculateTotal, getServicePrice } = useBooking();
  const { businessId } = useParams();
  const navigate = useNavigate();

  const { location, staff, selectedServices, date, timeSlot } = bookingData;

  // React Router location for sequential navigation logic
  const routerLocation = useLocation();
  const currentPath = routerLocation.pathname;

  const handleContinue = () => {
    if (currentPath.includes('/professional')) {
      navigate(`/service`);
    } else if (currentPath.includes('/service')) {
      navigate(`/time`);
    } else if (currentPath.includes('/time')) {
      navigate(`/confirm`);
    } else {
      // Fallback to original logic if path doesn't match expected steps
      if (!staff) navigate(`/professional`);
      else if (selectedServices.length === 0) navigate(`/service`);
      else if (!timeSlot) navigate(`/time`);
      else navigate(`/confirm`);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[var(--border-primary)] shadow-xl overflow-hidden flex flex-col h-full sticky top-0 text-black">
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-black text-black tracking-tighter uppercase mb-1">
          Your order
        </h2>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {business?.name} - {location?.name || 'Select Location'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6">
        {/* Selected Staff */}
        {staff && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-[var(--border-primary)] flex items-center justify-center overflow-hidden shrink-0">
              {staff.profile_image ? (
                <img src={staff.profile_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black text-black uppercase tracking-tight truncate">{staff.name}</p>
              <p className="text-[10px] text-gray-400 font-bold italic">Selected Professional</p>
            </div>
            <div className="text-[11px] font-black text-black">
               {/* Optional: Add selection change icon here */}
            </div>
          </div>
        )}

        {/* Selected Services */}
        {selectedServices.map((service) => (
          <div key={service.id} className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-black uppercase tracking-tight truncate">{service.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                     <Briefcase size={8} className="text-green-600" />
                   </div>
                   <p className="text-[9px] text-[var(--text-secondary)] font-bold">{service.duration_minutes || 30} mins</p>
                </div>
             </div>
             <div className="text-[11px] font-black text-black">
                ${getServicePrice(service).toFixed(2)}
             </div>
          </div>
        ))}

        {timeSlot && (
           <div className="pt-4 border-t border-dashed border-[var(--border-primary)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-1">
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <Calendar size={12} className="text-black" />
                       <span className="text-[11px] font-black text-black uppercase">
                          {/* date is now Wall Time (Fake UTC), so we use getUTC parts */}
                          {new Intl.DateTimeFormat('en-US', { 
                             month: 'short', 
                             day: 'numeric',
                             timeZone: 'UTC' 
                          }).format(date)} at {timeSlot}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                       <Clock size={10} className="text-gray-400" />
                       <span className="text-[9px] font-bold text-gray-400 uppercase">
                          Your time: {getLocalTimeFromWall(date, business?.timezone || 'America/Juneau')}
                       </span>
                    </div>
                 </div>
                 <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider">Confirmed</span>
              </div>
           </div>
        )}
      </div>

      <div className="p-8 pt-4 bg-gray-50/50 border-t border-[var(--border-primary)]">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-black text-black uppercase tracking-tighter">Subtotal</span>
          <span className="text-lg font-black text-black">${calculateTotal().toFixed(2)}</span>
        </div>

        <button 
          onClick={handleContinue}
          disabled={!staff || (selectedServices.length === 0 && !timeSlot)}
          className="w-full py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-md hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed group"
        >
          {timeSlot ? 'Finish booking' : staff && selectedServices.length > 0 ? 'Choose a time' : 'Choose a service'}
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default BookingOrderSidebar;
