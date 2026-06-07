import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="onboarding-container">
      <div className="onboarding-image">
        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop" alt="Onboarding" />
      </div>
      
      <div className="onboarding-content">
        <h1>Fresh Groceries from NxtMart</h1>
        <p>Handpicked local produce delivered fresh from NxtMart nearby farms to you.</p>
        
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
