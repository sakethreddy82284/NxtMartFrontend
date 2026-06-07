import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Bell, Gift, ChevronRight, 
  Clock, TrendingUp, Star, Filter, ArrowRight,
  Timer, ShoppingBag, Zap, Milk, Cookie
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CustomerHome.css';
import Categories from '../categories/categories';
import StickyBottomNav from '../../../components/common/StickyBottomNav/StickyBottomNav';
import Navbar from '../../../components/common/navbar/Navbar';

import { BASE_URL } from '../../../config';
const API_URL = BASE_URL;

const HomeProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div className="home-p-card" onClick={() => navigate(`/customer/products/${product.category}`)}>
      <div className="home-p-img-box">
        <img src={product.image} alt={product.name} />
        <div className="home-p-time">
          <Timer size={10} />
          <span>16 MINS</span>
        </div>
      </div>
      <div className="home-p-info">
        <h4 className="home-p-name">{product.name}</h4>
        <p className="home-p-pack">{product.packSize || '500g'}</p>
        <div className="home-p-footer">
          <span className="home-p-price">₹{product.price}</span>
          <button className="home-p-add">ADD</button>
        </div>
      </div>
    </div>
  );
};

const CustomerHome = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(`${API_URL}/products?limit=8`);
        const data = await res.json();
        setTrending(data.products || data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="customer-home-root">
      <Navbar />

      <main className="home-main-scroll">
        

        <section className="home-hero-section animate-fade-up">
          <div className="home-hero-carousel">
            <div className="hero-slide primary-green">
              <div className="slide-content">
                <div className="slide-badge">
                  <Zap size={12} fill="currentColor" />
                  <span>Flash Sale Live</span>
                </div>
                <h2>Up to 50% Off on Fresh Veggies</h2>
                <p>Straight from farms to your doorstep in 10 minutes.</p>
                <button className="hero-cta" onClick={() => navigate('/categories')}>
                  Order Now <ArrowRight size={16} />
                </button>
              </div>
              <div className="slide-visual">
                <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=400&auto=format&fit=crop" alt="Vegetables" />
              </div>
            </div>
          </div>
        </section>


        <section className="home-section animate-fade-up stagger-1">
          <div className="home-section-header">
            <div className="header-title">
              <h3>Shop by Category</h3>
              <p>Explore our wide range of items</p>
            </div>
            <button className="text-link" onClick={() => navigate('/categories')}>
              See all <ChevronRight size={16} />
            </button>
          </div>
          <Categories isHomeView={true} />
        </section>


        <section className="home-promo-grid animate-fade-up stagger-2">
          <div className="promo-card blue-tint">
            <div className="promo-text">
              <h4>Dairy & Eggs</h4>
              <p>Freshly stocked</p>
            </div>
            <Milk className="promo-icon" strokeWidth={1.5} />
          </div>
          <div className="promo-card orange-tint">
            <div className="promo-text">
              <h4>Munchies</h4>
              <p>Weekend snacks</p>
            </div>
            <Cookie className="promo-icon" strokeWidth={1.5} />
          </div>
        </section>


        <div className="home-bottom-spacer"></div>
      </main>

      <StickyBottomNav />
    </div>
  );
};

export default CustomerHome;