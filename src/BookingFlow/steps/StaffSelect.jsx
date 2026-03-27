import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../BookingContext';
import { User, CheckCircle, Zap } from 'lucide-react';

const StaffSelect = () => {
  const { businessId, updateBooking, staffList, loading, bookingData } = useBooking();
  const navigate = useNavigate();

  const handleSelectStaff = (staff) => {
    updateBooking('staff', staff);
    navigate(`/service`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl animate-in fade-in duration-700 bg-white">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-black tracking-tighter uppercase mb-2">
          Choose a professional
        </h2>
        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
          Select your preferred expert
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {staffList.map((staff) => (
          <div 
            key={staff.id}
            onClick={() => handleSelectStaff(staff)}
            className="flex flex-col items-center p-6 bg-white rounded-3xl border border-[var(--border-primary)] hover:border-black cursor-pointer transition-all hover:shadow-xl group text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden mb-4 group-hover:scale-105 transition-transform">
              {staff.profile_image ? (
                <img src={staff.profile_image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <User size={30} className="text-white" />
                </div>
              )}
            </div>
            
            <h3 className="text-xs font-black text-black uppercase tracking-tight mb-1 truncate w-full">
              {staff.name}
            </h3>
            
            <div className="flex items-center gap-1.5">
               <div className={`w-1.5 h-1.5 rounded-full ${staff.connected ? 'bg-green-500' : 'bg-orange-500'}`} />
               <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                 {staff.connected ? 'Available Today' : 'Available Tomorrow'}
               </span>
            </div>
          </div>
        ))}

        {/* Gift Card Mock Card */}
        <div className="flex flex-col items-center p-6 bg-gray-50 border-2 border-dashed border-[var(--border-primary)] rounded-3xl hover:border-black cursor-pointer transition-all group text-center">
           <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Zap size={24} className="text-black" />
           </div>
           <h3 className="text-xs font-black text-black uppercase tracking-tight mb-1">Buy a gift card</h3>
           <p className="text-[9px] text-[var(--text-muted)] font-bold">Give the gift of grooming</p>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-2 p-4 bg-blue-50/50 rounded-3xl border border-blue-100 text-[10px] font-bold text-blue-800 uppercase tracking-wider">
         <Zap size={14} className="animate-pulse" />
         Any professional will do? We'll pick the next available for you.
      </div>

      {/* Navigation Buttons */}
      <div className="mt-12 pt-8 border-t border-[var(--border-primary)] flex items-center justify-between">
        <button 
          onClick={() => navigate(`/location`)}
          className="px-10 py-5 border border-black text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-black hover:text-white transition-all shadow-sm"
        >
          Back
        </button>
        <button 
          onClick={() => navigate(`/service`)}
          disabled={!bookingData.staff}
          className="px-10 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-3xl hover:opacity-90 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-black/10"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default StaffSelect;
