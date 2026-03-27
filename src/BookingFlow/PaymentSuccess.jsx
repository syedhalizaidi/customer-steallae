import React from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, ArrowRight, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { businessId } = useParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-[var(--border-primary)] shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        <div className="bg-green-500 p-8 flex flex-col items-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Booking Confirmed!</h1>
          <p className="opacity-90 font-bold text-center">Your payment was successful and your spot is secured.</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
                   <Calendar size={18} className="text-black" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</p>
                   <p className="text-sm font-black text-black">Scheduled for today</p>
                </div>
             </div>

             <p className="text-[11px] font-bold text-[var(--text-secondary)] leading-relaxed italic text-center px-4">
                We've sent a confirmation email with all the details. We'll see you soon!
             </p>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Home size={14} /> Back to Home
            </button>
            <button 
              onClick={() => navigate('/business-dashboard')}
              className="w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 text-center">
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Stellae AI Secure Payment • {sessionId?.slice(0, 12)}...
           </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
