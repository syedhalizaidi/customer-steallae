import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../BookingContext';
import { Clock, ChevronLeft, ChevronRight, Sun, Sunset, Moon } from 'lucide-react';
import './TimeSelect.css'; // We'll create this for calendar overrides

const TimeSelect = () => {
  const { business, bookingData, updateBooking, allOccupiedSlots } = useBooking();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeSlot, setActiveSlot] = useState(null);
  const navigate = useNavigate();
  const { businessId } = useParams();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    updateBooking('date', date);
    setActiveSlot(null);
    updateBooking('timeSlot', null);
  };

  const handleSlotSelect = (slot) => {
    setActiveSlot(slot);
    
    // Update date first (including the selected time)
    const [hours, minutes] = slot.split(':').map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes, 0, 0);
    updateBooking('date', newDate);

    // Then update timeSlot (which is after 'date' in the clearing sequence)
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
    const occupiedTimes = allOccupiedSlots
      .filter(slot => {
        if (!slot.instance_id || !bookingData.staff || slot.instance_id !== bookingData.staff.id) return false;
        const slotDate = new Date(slot.start_time);
        return slotDate.getFullYear() === selectedDate.getFullYear() &&
               slotDate.getMonth() === selectedDate.getMonth() &&
               slotDate.getDate() === selectedDate.getDate();
      })
      .map(slot => {
        const d = new Date(slot.start_time);
        return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
      });

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
          Available slots for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
             <p className="text-[10px] font-bold text-blue-600/80 uppercase">
                {business?.timezone || 'Eastern Standard Time (EST)'}
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
          onClick={() => navigate(`/book/${businessId}/service`)}
          className="px-10 py-5 border border-black text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-black hover:text-white transition-all shadow-sm"
        >
          Back
        </button>
        <button 
          onClick={() => navigate(`/book/${businessId}/confirm`)}
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
