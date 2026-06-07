import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home, Bike, Timer, ShieldCheck } from 'lucide-react';
import Navbar from '../../../components/common/navbar/Navbar';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!order) {
    return <Navigate to="/customer" replace />;
  }

  return (
    <div className="order-success-page">
      <Navbar hideSearch={true} />

      {showConfetti && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`confetti piece-${i}`}></div>
          ))}
        </div>
      )}

      <div className="success-container">
        <div className="success-card animate-slide-up">
          <div className="swiggy-status-banner">
             <div className="status-bike">
                <Bike size={32} />
                <div className="bike-wheels"></div>
             </div>
             <div className="status-text">
                <h3>Order Confirmed!</h3>
                <p>NxtMart is preparing your items</p>
             </div>
          </div>

          <div className="success-hero">
            <div className="success-icon-wrap">
              <CheckCircle size={60} className="success-icon" />
            </div>
            <h1 className="success-title">Yay! It's Placed</h1>
            <p className="success-subtitle">
              Order ID: <span>#{order._id.slice(-6).toUpperCase()}</span>
            </p>
          </div>

          <div className="swiggy-delivery-card">
             <div className="d-item">
                <Timer size={20} />
                <span>12-15 Mins</span>
             </div>
             <div className="d-divider"></div>
             <div className="d-item">
                <ShieldCheck size={20} />
                <span>Verified</span>
             </div>
          </div>

          <div className="order-summary-mini">
            <div className="summary-row total">
              <span>Paid via {order.paymentMethod?.toUpperCase() || 'Online'}</span>
              <span>₹{order.billDetails.totalPayable}</span>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/customer" className="action-btn secondary">
              <Home size={18} />
              Go Home
            </Link>
            <Link to="/profile" className="action-btn primary">
              Track Order
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
