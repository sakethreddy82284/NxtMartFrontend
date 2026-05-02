import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import Navbar from '../../../components/common/navbar/Navbar';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  // If someone tries to access this page directly without an order, redirect them home
  if (!order) {
    return <Navigate to="/customer" replace />;
  }

  return (
    <div className="order-success-page">
      <Navbar hideSearch={true} />

      <div className="success-container">
        <div className="success-card">
          <div className="success-icon-wrap">
            <CheckCircle size={60} className="success-icon" />
          </div>

          <h1 className="success-title">Order Placed Successfully!</h1>
          <p className="success-subtitle">
            Your order <strong>#{order._id.slice(-6).toUpperCase()}</strong> has been confirmed and is being prepared.
          </p>

          <div className="order-summary-mini">
            <div className="summary-row">
              <span>Items Total</span>
              <span>₹{order.billDetails.itemTotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹{order.billDetails.deliveryFee}</span>
            </div>
            <div className="summary-row total">
              <span>Amount Paid</span>
              <span>₹{order.billDetails.totalPayable}</span>
            </div>
          </div>

          <div className="delivery-info-mini">
            <Package size={20} />
            <div>
              <p className="delivery-label">Arriving in</p>
              <p className="delivery-value">15-20 minutes</p>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/customer" className="action-btn secondary">
              <Home size={18} />
              Continue Shopping
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
