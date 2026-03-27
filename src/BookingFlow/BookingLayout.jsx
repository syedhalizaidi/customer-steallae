import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { BookingProvider, useBooking } from './BookingContext';
import { ChevronRight, MapPin, User, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import BookingOrderSidebar from './components/BookingOrderSidebar';

const BookingLayout = () => {
  const { business, loading, error } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();
  const { businessId } = useParams();

  const steps = [
    { path: `/`, label: 'Welcome', icon: null },
    { path: `/location`, label: 'Location', icon: MapPin },
    { path: `/professional`, label: 'Professional', icon: User },
    { path: `/service`, label: 'Service', icon: Briefcase },
    { path: `/time`, label: 'Time', icon: Calendar },
    { path: `/confirm`, label: 'Done', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(step => 
    step.path === location.pathname
  );

  const isLandingPage = location.pathname === `/`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-4 text-center">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Oops!</h2>
        <p className="text-[var(--text-secondary)] mb-6">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-[var(--accent-primary)] text-white rounded-full font-bold hover:opacity-90 transition-all"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border-primary)] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => navigate(`/book/${businessId}`)}
            className="cursor-pointer flex items-center gap-3"
          >
            {business?.logo ? (
              <div className="h-10 w-10 invert flex items-center justify-center rounded overflow-hidden">
                <img src={business.logo} alt={business.name} className="h-full w-full object-contain" />
              </div>
            ) : (
              <div className="h-10 w-10 bg-[var(--accent-primary)] flex items-center justify-center rounded text-white font-black text-xl">
                {business?.name?.charAt(0) || 'S'}
              </div>
            )}
            <span className="font-bold text-lg tracking-tight text-black uppercase">
              {business?.name || 'STELAE'}
            </span>
          </div>
        </div>

        {/* Progress Indicator */}
        {!isLandingPage && (
          <nav className="hidden md:flex items-center gap-2">
            {steps.slice(1).map((step, idx) => {
              const stepIdx = idx + 1;
              const isPast = stepIdx < currentStepIndex;
              const isCurrent = stepIdx === currentStepIndex;
              
              return (
                <React.Fragment key={step.path}>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-sm transition-all ${
                    isCurrent ? 'bg-black text-white' : 'text-black'
                  }`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      !isCurrent && !isPast ? 'text-gray-400' : ''
                    }`}>
                      {step.label}
                    </span>
                    {isPast && <CheckCircle size={12} className="text-green-500" />}
                  </div>
                  {idx < steps.length - 2 && (
                    <ChevronRight size={14} className="text-gray-300" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {/* Optional actions like Language or Login */}
        </div>
      </header>

      {/* Main Content Area - Full width to avoid black bars */}
      <main className="flex-1 flex flex-col md:flex-row w-full relative bg-white">
        <div className="flex-1 p-6 md:p-10 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>

        {/* Sidebar */}
        {!isLandingPage && currentStepIndex >= 2 && (
          <div className="w-full md:w-[550px] shrink-0 p-6 md:p-10 lg:p-10 bg-gray-50 border-l border-[var(--border-primary)] sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            <BookingOrderSidebar />
          </div>
        )}
      </main>

      {/* Mobile Footer branding */}
      <footer className="md:hidden p-4 border-t border-[var(--border-primary)] bg-white text-center">
        <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-widest">
          Powered by Stella AI
        </span>
      </footer>
    </div>
  );
};

export default BookingLayout;
