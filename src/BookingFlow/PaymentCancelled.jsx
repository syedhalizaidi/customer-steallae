import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-[var(--border-primary)] shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        <div className="bg-red-500 p-8 flex flex-col items-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md">
            <XCircle size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Payment Cancelled</h1>
          <p className="opacity-90 font-bold text-center">Oops! It looks like the payment process was interrupted.</p>
        </div>

        <div className="p-8 space-y-8 text-center">
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100/50">
             <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                <AlertCircle size={18} />
                <span className="text-xs font-black uppercase tracking-tight">Nothing was charged</span>
             </div>
             <p className="text-xs font-bold text-red-700/70">
                Your reservation has not been finalized yet. Don't worry, you can always try again.
             </p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-full py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Try Payment Again
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} /> Return to Home
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 text-center">
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-gray-400">
              Booking Ref: INTERRUPTED_{new Date().getTime().toString().slice(-6)}
           </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
