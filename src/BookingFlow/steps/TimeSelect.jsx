import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../BookingContext';
import { Clock, ChevronLeft, ChevronRight, Sun, Sunset, Moon, Globe } from 'lucide-react';
import { getWallDateTime, formatInTimezone, getTimezoneOffset, getLocalTimeFromWall } from '../../utils/timezoneUtils';
import './TimeSelect.css'; // We'll create this for calendar overrides

const TimeSelect = () => {
  const { business, bookingData, updateBooking, allOccupiedSlots } = useBooking();
  
  // Initialize selectedDate based on existing bookingData.date (converted to business local date)
  const [selectedDate, setSelectedDate] = useState(() => {
    if (bookingData.date) {
        // Since bookingData.date is now "Fake UTC" (Wall Time), 
        // we can just use its UTC parts directly
        return new Date(
          bookingData.date.getUTCFullYear(),
          bookingData.date.getUTCMonth(),
          bookingData.date.getUTCDate()
        );
    }
    return new Date();
  });

  const [activeSlot, setActiveSlot] = useState(bookingData.timeSlot);
  const navigate = useNavigate();
  const { businessId } = useParams();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    
    // Store as a "neutral" Wall Time (Fake UTC) at Noon
    const neutralDate = getWallDateTime(date, "12:00");
    
    updateBooking('date', neutralDate);
    setActiveSlot(null);
    updateBooking('timeSlot', null);
  };

  const handleSlotSelect = (slot) => {
    setActiveSlot(slot);
    
    // Store as "Wall Time" (Fake UTC) so localStorage matches slot string (e.g. 15:00 -> 15:00Z)
    const newDate = getWallDateTime(selectedDate, slot);
    
    updateBooking('date', newDate);
    updateBooking('timeSlot', slot);
  };

  // Generate mock slots based on business hours
  // In a real app, this would call an API with the selectedDate and staffId
  // Generate slots based on business hours
  const generateSlots = () => {
    const slots = [];
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayName = dayNames[selectedDate.getDay()];
    const dayHours = business?.weekly_hours?.[dayName];

    if (!dayHours || dayHours.closed || !dayHours.open || !dayHours.close) {
      return []; // Business is closed or hours not provided
    }

    // Get occupied times for the selected staff and date
    const businessTimezone = business?.timezone || 'America/Juneau';
    const occupiedTimes = allOccupiedSlots
      .filter(slot => {
        // 1. Staff check: Block if it's a global block (null id) OR if it matches the selected staff
        const isGlobalBlock = !slot.instance_id;
        const isSelectedStaffBlock = bookingData.staff && slot.instance_id === bookingData.staff.id;
        
        if (!isGlobalBlock && !isSelectedStaffBlock) return false;
        
        // 2. Date check: Convert UTC slot time to business wall-date
        const slotDate = new Date(slot.start_time);
        const businessDateStr = new Intl.DateTimeFormat('en-CA', { // YYYY-MM-DD format
            timeZone: businessTimezone,
            year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(slotDate);
        
        const selectedDateStr = new Intl.DateTimeFormat('en-CA', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(selectedDate);

        return businessDateStr === selectedDateStr;
      })
      .map(slot => formatInTimezone(new Date(slot.start_time), businessTimezone));

    const [startH, startM] = dayHours.open.split(':').map(Number);
    const [endH, endM] = dayHours.close.split(':').map(Number);
    
    const interval = business?.slot_size_minutes || 30;

    let currentHour = startH;
    let currentMin = startM;

    while (currentHour < endH || (currentHour === endH && currentMin < endM)) {
      const time = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      
      slots.push({
        time,
        isOccupied: occupiedTimes.includes(time)
      });
      
      currentMin += interval;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }

    return slots;
  };

  const allSlots = generateSlots();
  const morningSlots = allSlots.filter(s => parseInt(s.time.split(':')[0]) < 12);
  const afternoonSlots = allSlots.filter(s => parseInt(s.time.split(':')[0]) >= 12 && parseInt(s.time.split(':')[0]) < 17);
  const eveningSlots = allSlots.filter(s => parseInt(s.time.split(':')[0]) >= 17);

  const SlotSection = ({ title, icon: Icon, slots }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-black uppercase tracking-widest">
        <Icon size={14} />
        {title}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map(slot => (
          <button
            key={slot.time}
            disabled={slot.isOccupied}
            onClick={() => handleSlotSelect(slot.time)}
            className={`py-3 rounded-xl border text-[14px] font-black transition-all relative ${
              slot.isOccupied
                ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-none'
                : activeSlot === slot.time 
                  ? 'bg-black text-white border-black scale-105 shadow-md' 
                  : 'bg-white text-black border-[var(--border-primary)] hover:border-black'
            }`}
          >
            {slot.time}
            {slot.isOccupied && (
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white" title="Booked"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl animate-in fade-in duration-700 bg-white">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-black tracking-tighter uppercase mb-2">
          Choose a time
        </h2>
        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
           Available slots for {new Intl.DateTimeFormat('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric'
           }).format(selectedDate)}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Calendar Side */}
        <div className="w-full lg:w-[350px] shrink-0">
          <div className="booking-calendar-container p-4 bg-white rounded-3xl border border-[var(--border-primary)] shadow-sm">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              minDate={new Date()}
              className="!border-none outline-none w-full"
              nextLabel={<ChevronRight size={18} />}
              prevLabel={<ChevronLeft size={18} />}
              next2Label={null}
              prev2Label={null}
            />
          </div>
          
          <div className="mt-6 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
             <div className="flex items-center gap-2 text-[10px] font-black text-blue-800 uppercase tracking-wider mb-2">
                <Clock size={14} />
                Barber's Timezone
             </div>
             <p className="text-[10px] font-bold text-blue-600/80 uppercase mb-3">
                {business?.timezone || 'America/Juneau'} ({getTimezoneOffset(business?.timezone || 'America/Juneau')})
             </p>
             <div className="flex items-center gap-2 text-[10px] font-black text-blue-800 uppercase tracking-wider mb-2">
                <Globe size={14} />
                Your Local Time
             </div>
             <p className="text-[10px] font-bold text-blue-600/80 uppercase">
                {bookingData.timeSlot ? `${getLocalTimeFromWall(bookingData.date, business?.timezone || 'America/Juneau')}` : 'Select a slot'}
             </p>
          </div>
        </div>

        {/* Slots Side */}
        <div className="flex-1">
          <SlotSection title="Morning" icon={Sun} slots={morningSlots} />
          <SlotSection title="Afternoon" icon={Sunset} slots={afternoonSlots} />
          <SlotSection title="Evening" icon={Moon} slots={eveningSlots} />
          
          {allSlots.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-[var(--border-primary)]">
               <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">No availability for this date</p>
            </div>
          )}
        </div>
      </div>
      {/* Navigation Buttons */}
      <div className="mt-12 pt-8 border-t border-[var(--border-primary)] flex items-center justify-between">
        <button 
          onClick={() => navigate(`/service`)}
          className="px-10 py-5 border border-black text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-black hover:text-white transition-all shadow-sm"
        >
          Back
        </button>
        <button 
          onClick={() => navigate(`/confirm`)}
          disabled={!bookingData.timeSlot}
          className="px-10 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-3xl hover:opacity-90 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-black/10"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default TimeSelect;
