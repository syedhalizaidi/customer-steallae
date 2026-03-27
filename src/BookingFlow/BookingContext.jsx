import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { businessService } from '../api/services/businessService';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [allOccupiedSlots, setAllOccupiedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking State - Initialize from localStorage if available
  const [bookingData, setBookingData] = useState(() => {
    const saved = localStorage.getItem(`booking_data_${businessId}`);
    const initial = {
      location: null,
      staff: null,
      selectedServices: [],
      date: new Date(),
      timeSlot: null,
      customerInfo: {
        name: '',
        email: '',
        phone: '',
        notes: ''
      }
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date string back to Date object
        if (parsed.date) parsed.date = new Date(parsed.date);
        return { ...initial, ...parsed };
      } catch (e) {
        return initial;
      }
    }
    return initial;
  });

  // Sync bookingData to localStorage
  useEffect(() => {
    if (businessId) {
      localStorage.setItem(`booking_data_${businessId}`, JSON.stringify(bookingData));
    }
  }, [bookingData, businessId]);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await businessService.getPublicBusinessById(businessId);
        if (response.success) {
          const { services, instances, slots, ...businessData } = response.data;
          setBusiness(businessData);
          setServices(services || []);
          setStaffList(instances || []);
          setAllOccupiedSlots(slots || []);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to fetch business details');
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  const updateBooking = (key, value) => {
    setBookingData(prev => {
      const newData = { ...prev, [key]: value };
      
      // Define sequence for clearing subsequent steps
      const sequence = ['location', 'staff', 'selectedServices', 'date', 'timeSlot'];
      const index = sequence.indexOf(key);
      
      if (index !== -1) {
        // Clear everything after the changed key in the sequence
        for (let i = index + 1; i < sequence.length; i++) {
          const nextKey = sequence[i];
          if (nextKey === 'selectedServices') {
            newData[nextKey] = [];
          } else if (nextKey === 'date') {
            newData[nextKey] = new Date();
          } else {
            newData[nextKey] = null;
          }
        }
      }
      
      return newData;
    });
  };

  const toggleService = (service) => {
    setBookingData(prev => {
      const isSelected = prev.selectedServices.find(s => s.id === service.id);
      let newServices;
      if (isSelected) {
        newServices = prev.selectedServices.filter(s => s.id !== service.id);
      } else {
        newServices = [...prev.selectedServices, service];
      }
      
      return {
        ...prev,
        selectedServices: newServices,
        date: new Date(),
        timeSlot: null
      };
    });
  };

  const getServicePrice = (service) => {
    if (bookingData.staff?.pricing) {
      const staffPrice = bookingData.staff.pricing.find(p => p.service_id === service.id);
      if (staffPrice) return staffPrice.price;
    }
    return service.price || service.base_price || (service.pricing && service.pricing[0]?.price) || 0;
  };

  const calculateTotal = () => {
    return bookingData.selectedServices.reduce((total, s) => {
      return total + parseFloat(getServicePrice(s));
    }, 0);
  };

  const value = {
    business,
    businessId,
    services,
    staffList,
    allOccupiedSlots,
    loading,
    error,
    bookingData,
    updateBooking,
    toggleService,
    getServicePrice,
    calculateTotal
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
