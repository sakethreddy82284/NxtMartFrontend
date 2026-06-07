import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="onboarding-container">
      <div className="onboarding-image">
        <img src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop" alt="Onboarding" />
      </div>
      
      <div className="onboarding-content">
        <h1>Premium Tech from NxtMart</h1>
        <p>Get the latest laptops, smartphones, and accessories delivered directly to your doorstep in minutes.</p>
        
        <div className="onboarding-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        
        <button className="onboarding-btn" onClick={() => navigate('/customer')}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
