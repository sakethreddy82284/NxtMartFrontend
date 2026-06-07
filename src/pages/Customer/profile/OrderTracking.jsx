import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Bike, Clock, 
  Phone, ShieldCheck, ShoppingBag, 
  CheckCircle2, Navigation
} from 'lucide-react';
import Navbar from '../../../components/common/navbar/Navbar';
import './OrderTracking.css';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Out for Delivery'); // Mock status
  const [progress, setProgress] = useState(75); // Mock progress %
  const [bikePosition, setBikePosition] = useState({ x: 20, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setBikePosition(prev => {
        if (prev.x >= 80) return prev;
        return { ...prev, x: prev.x + 0.5 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tracking-wrapper">
      <Navbar />
      
      <div className="tracking-container">
        {/* Header */}
        <header className="tracking-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-info">
            <h1>Tracking Order</h1>
            <p>ID: #{id?.slice(-6).toUpperCase() || 'XT9921'}</p>
          </div>
          <div className="time-pill">
            <Clock size={14} />
            <span>12 mins</span>
          </div>
        </header>


        <div className="map-viewport">
          <div className="map-grid">

            <div className="map-bg"></div>
            

            <div className="map-marker store" style={{ left: '15%', top: '45%' }}>
              <div className="marker-pulse"></div>
              <div className="marker-icon"><ShoppingBag size={14} /></div>
              <span className="marker-label">NxtMart Store</span>
            </div>


            <div className="map-path"></div>


            <div className="map-marker bike" style={{ left: `${bikePosition.x}%`, top: `${bikePosition.y}%` }}>
              <div className="bike-icon">
                <Bike size={20} />
              </div>
              <div className="bike-label">Alex (Pilot)</div>
            </div>


            <div className="map-marker user" style={{ right: '10%', bottom: '25%' }}>
              <div className="marker-pulse orange"></div>
              <div className="marker-icon orange"><MapPin size={16} /></div>
              <span className="marker-label">You</span>
            </div>
          </div>

          <div className="map-overlay-info">
             <Navigation size={14} />
             <span>Alex is 1.2km away from your location</span>
          </div>
        </div>


        <div className="partner-card">
          <div className="partner-avatar">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" alt="Alex" />
            <div className="rating-badge">★ 4.9</div>
          </div>
          <div className="partner-details">
            <h3>Alex Rodrigues</h3>
            <p>Verified Delivery Partner</p>
            <div className="partner-meta">
              <ShieldCheck size={12} />
              <span>Background Checked</span>
            </div>
          </div>
          <button className="call-btn">
            <Phone size={20} fill="currentColor" />
          </button>
        </div>


        <div className="status-stepper">
          <div className="step completed">
            <div className="step-circle"><CheckCircle2 size={16} /></div>
            <span>Confirmed</span>
          </div>
          <div className="step completed">
            <div className="step-circle"><CheckCircle2 size={16} /></div>
            <span>Packed</span>
          </div>
          <div className="step active">
            <div className="step-circle"><Bike size={16} /></div>
            <span>On the way</span>
          </div>
          <div className="step">
            <div className="step-circle"></div>
            <span>Arrived</span>
          </div>
        </div>


        <div className="order-summary-mini">
           <h3>Order Details</h3>
           <div className="summary-row">
             <span>Items</span>
             <span>3 Items</span>
           </div>
           <div className="summary-row">
             <span>Delivery to</span>
             <span className="address-text">Home • Flat 402, Green Valley</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
