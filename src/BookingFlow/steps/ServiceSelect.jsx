import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooking } from "../BookingContext";
import { Plus, Check, Clock, Info } from "lucide-react";

const ServiceSelect = () => {
  const {
    businessId,
    toggleService,
    bookingData,
    services,
    loading,
    getServicePrice,
  } = useBooking();
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const categories = [
    "All",
    ...new Set(services.map((s) => s.category || "Other")),
  ];

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((s) => (s.category || "Other") === activeCategory);

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
          Anything you wish to add?
        </h2>
        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
          Select one or more services
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeCategory === cat
                ? "bg-black text-white border-black shadow-lg scale-105"
                : "bg-white text-[var(--text-muted)] border-[var(--border-primary)] hover:border-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredServices.map((service) => {
          const isSelected = bookingData.selectedServices.find(
            (s) => s.id === service.id,
          );
          const displayPrice = getServicePrice(service);

          return (
            <div
              key={service.id}
              onClick={() => toggleService(service)}
              className={`flex items-center justify-between p-6 bg-white rounded-3xl border transition-all cursor-pointer group hover:shadow-xl hover:border-black ${
                isSelected
                  ? "border-black bg-gray-50/50 shadow-md"
                  : "border-[var(--border-primary)]"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xs font-black text-black uppercase tracking-tight">
                    {service.name || service.title}
                  </h3>
                  {service.description && (
                    <div className="group/info relative">
                      <Info
                        size={12}
                        className="text-[var(--text-muted)] cursor-help"
                      />
                      <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-black text-white text-[9px] rounded-lg hidden group-hover/info:block z-20">
                        {service.description}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {service.duration_minutes || service.duration || 30} mins
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-xs font-black text-black block">
                    ${displayPrice.toFixed(2)}
                  </span>
                  {bookingData.staff && (
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                      with {bookingData.staff.name}
                    </span>
                  )}
                </div>

                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-black border-black text-white"
                      : "bg-white border-[var(--border-primary)] text-black group-hover:border-black"
                  }`}
                >
                  {isSelected ? <Check size={18} /> : <Plus size={18} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Navigation Buttons */}
      <div className="mt-12 pt-8 border-t border-[var(--border-primary)] flex items-center justify-between">
        <button 
          onClick={() => navigate(`/book/${businessId}/professional`)}
          className="px-10 py-5 border border-black text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-black hover:text-white transition-all shadow-sm"
        >
          Back
        </button>
        <button 
          onClick={() => navigate(`/book/${businessId}/time`)}
          disabled={bookingData.selectedServices.length === 0}
          className="px-10 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-3xl hover:opacity-90 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-black/10"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default ServiceSelect;
