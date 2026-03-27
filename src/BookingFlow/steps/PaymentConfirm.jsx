import React, { useState } from 'react';
import { useBooking } from '../BookingContext';
import { useForm } from 'react-hook-form';
import { Mail, Lock, ArrowLeft, CheckCircle2, Loader2, Sparkles, ShieldCheck, User, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { businessService } from '../../api/services/businessService';

const PaymentConfirm = () => {
  const { bookingData, calculateTotal, business, updateBooking, businessId } = useBooking();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      customerName: bookingData.customerInfo.name || '',
      phone: bookingData.customerInfo.phone || '',
      email: bookingData.customerInfo.email || ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Update context with newly collected info
      updateBooking('customerInfo', {
        ...bookingData.customerInfo,
        name: data.customerName,
        phone: data.phone,
        email: data.email
      });

      // Format date to YYYY-MM-DD
      const formattedDate = bookingData.date.toISOString().split('T')[0];
      
      // Extract time from timeSlot (e.g., "09:00 - 09:30" -> "09:00")
      const timeMatch = bookingData.timeSlot?.match(/(\d{2}:\d{2})/);
      const formattedTime = timeMatch ? timeMatch[1] : '';

      const payload = {
        customer_name: data.customerName,
        phone_number: data.phone,
        party_size: 1,
        staff_mode: bookingData.staff ? "specific" : "any",
        instance_id: bookingData.staff?.id || null,
        preference: "specific_time", // When time is chosen, it's a specific time
        date: formattedDate,
        time: formattedTime,
        flexible: false,
        service: bookingData.selectedServices[0]?.name || "",
        service_id: bookingData.selectedServices[0]?.id || "",
        customer_email: data.email || "",
        price: calculateTotal(),
        source: "web"
      };

      // Ensure instance_id is sent correctly in all cases for specific
      if (payload.staff_mode === "specific" && !payload.instance_id) {
          toast.error("Please select a professional.");
          return;
      }

      const response = await businessService.createReservation(business?.id || businessId, payload);

      if (response.success && response.data?.payment_link) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.payment_link;
      } else {
        toast.error(response.error || "Failed to initiate payment. Please review your details and try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-700">
      <div className="mb-10 flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)} 
          className="w-14 h-14 rounded-full border border-[var(--border-primary)] flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-md group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h2 className="text-4xl font-black text-black tracking-tighter uppercase mb-2">
            Review and Confirm
          </h2>
          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
            Almost there! Just a few more details.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Contact Information Section - Premium Card Design */}
        <div className="bg-white rounded-3xl border border-[var(--border-primary)] shadow-sm overflow-hidden p-8 transition-shadow hover:shadow-md">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                 <User size={18} className="text-gray-400" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black">Your Information</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em] px-1">Full Name</label>
                 <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
                    <input 
                      {...register("customerName", { required: "Name is required" })}
                      placeholder="Jack Jackson"
                      className={`w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border transition-all text-sm font-bold ${errors.customerName ? 'border-red-500 bg-red-50/10' : 'border-[var(--border-primary)] focus:border-black focus:bg-white focus:shadow-sm'}`}
                    />
                 </div>
                 {errors.customerName && <p className="text-[10px] font-bold text-red-500 px-1">{errors.customerName.message}</p>}
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em] px-1">Phone Number</label>
                 <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
                    <input 
                      {...register("phone", { 
                        required: "Phone is required",
                        pattern: {
                          value: /^\+?[\d\s-]{10,}$/,
                          message: "Invalid phone number"
                        }
                      })}
                      placeholder="1231231231"
                      className={`w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border transition-all text-sm font-bold ${errors.phone ? 'border-red-500 bg-red-50/10' : 'border-[var(--border-primary)] focus:border-black focus:bg-white focus:shadow-sm'}`}
                    />
                 </div>
                 {errors.phone && <p className="text-[10px] font-bold text-red-500 px-1">{errors.phone.message}</p>}
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em] px-1">Email Address</label>
                 <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
                    <input 
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      placeholder="user@example.com"
                      className={`w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border transition-all text-sm font-bold ${errors.email ? 'border-red-500 bg-red-50/10' : 'border-[var(--border-primary)] focus:border-black focus:bg-white focus:shadow-sm'}`}
                    />
                 </div>
                 {errors.email && <p className="text-[10px] font-bold text-red-500 px-1">{errors.email.message}</p>}
              </div>
           </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 place-items-end">
           <button 
             onClick={handleSubmit(onSubmit)}
             disabled={isLoading}
             className="w-full md:w-fit min-w-[300px] py-6 px-12 bg-black text-white text-[13px] font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
           >
             {isLoading ? (
               <>
                 <Loader2 className="animate-spin" size={22} />
                 Initiating Payment...
               </>
             ) : (
               <>
                 Proceed to Payment <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-2 transition-transform" />
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirm;
