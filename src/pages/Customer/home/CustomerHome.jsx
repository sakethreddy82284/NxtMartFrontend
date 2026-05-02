import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Bell, Gift, ChevronRight, 
  Clock, TrendingUp, Star, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CustomerHome.css';
import Categories from '../categories/categories';
import StickyBottomNav from '../../../components/common/StickyBottomNav/StickyBottomNav';
import Navbar from '../../../components/common/navbar/Navbar';

const CustomerHome = () => {
  const navigate = useNavigate();

  return (
    <div className="customer-home-container">
      <Navbar />

      <main className="home-main-content">

        {/* 2. Hero Banner */}
        <section className="hero-banner-section">
          <div className="hero-banner">
            <div className="hero-content">
              <span className="hero-tag">This week's fresh picks</span>
              <h2>100% Organic, delivered within 3 hours.</h2>
              <button className="shop-now-btn">Shop Now</button>
            </div>
            <div className="hero-image">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop" alt="Fresh Fruits" />
            </div>
          </div>
        </section>

        {/* 3. Shop by Category */}
        <section className="section-container">
          <div className="section-header">
            <h3>Shop by Category</h3>
            <button className="see-all-btn" onClick={() => navigate('/categories')}>See all</button>
          </div>
          <Categories isHomeView={true} />
        </section>


        
        {/* Padding for bottom nav */}
        <div style={{ height: '100px' }}></div>
      </main>

      <StickyBottomNav />
    </div>
  );
};

export default CustomerHome;