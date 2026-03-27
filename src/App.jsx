import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './BookingFlow/BookingContext';
import BookingLayout from './BookingFlow/BookingLayout';
import BookingLanding from './BookingFlow/BookingLanding';
import LocationSelect from './BookingFlow/steps/LocationSelect';
import StaffSelect from './BookingFlow/steps/StaffSelect';
import ServiceSelect from './BookingFlow/steps/ServiceSelect';
import TimeSelect from './BookingFlow/steps/TimeSelect';
import PaymentConfirm from './BookingFlow/steps/PaymentConfirm';
import PaymentSuccess from './BookingFlow/PaymentSuccess';
import PaymentCancelled from './BookingFlow/PaymentCancelled';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect base path to a demo business ID for now, or a landing page if you have one */}
        <Route path="/" element={<Navigate to="/" replace />} />
        
        {/* Booking Flow Routes */}
        <Route path="/" element={
          <BookingProvider>
            <BookingLayout />
          </BookingProvider>
        }>
          <Route index element={<BookingLanding />} />
          <Route path="location" element={<LocationSelect />} />
          <Route path="professional" element={<StaffSelect />} />
          <Route path="service" element={<ServiceSelect />} />
          <Route path="time" element={<TimeSelect />} />
          <Route path="confirm" element={<PaymentConfirm />} />
        </Route>
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-cancel" element={<PaymentCancelled />} />

      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
}

export default App;
