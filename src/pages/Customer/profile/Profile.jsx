/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../components/Context/User';
import Navbar from '../../../components/common/navbar/Navbar';
import StickyBottomNav from '../../../components/common/StickyBottomNav/StickyBottomNav';
import { 
  User, Mail, Phone, ShoppingBag, MapPin,
  ChevronRight, LogOut, Settings, Bell,
  ShieldCheck, CreditCard, Edit3, X, Save
} from 'lucide-react';
import './Profile.css';

const Profile = ({ initialTab = 'profile' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:2000/orders/my-orders', { withCredentials: true });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  return (
    <div className="profile-wrapper">
      <Navbar />

      {/* 1. Hero Summary */}
      <section className="profile-hero">
        <div className="avatar-huge">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
          <div className="status-dot"></div>
        </div>
        <h1>{user?.name || 'User Profile'}</h1>
        <p className="hero-sub">{user?.email}</p>
        <div className="premium-badge">
          <ShieldCheck size={12} fill="currentColor" />
          <span>Verified Member</span>
        </div>
      </section>

      {/* 2. Sticky Tab Nav */}
      <div className="tab-nav-wrapper">
        <div className="tab-nav-container">
          <button 
            className={`tab-link ${activeTab === 'profile' ? 'active' : ''}`} 
            onClick={() => setActiveTab('profile')}
          >
            My Details
          </button>
          <button 
            className={`tab-link ${activeTab === 'orders' ? 'active' : ''}`} 
            onClick={() => setActiveTab('orders')}
          >
            Order History
          </button>
        </div>
      </div>

      {/* 3. Dynamic Content Area */}
      <main className="profile-main">
        {activeTab === 'profile' && (
          <div className="tiles-stack animate-up">
            <div className="action-tile">
              <div className="tile-icon name"><User size={20} /></div>
              <div className="tile-info">
                <h4>Full Name</h4>
                <p>{user?.name}</p>
              </div>
              <ChevronRight size={18} color="#CCC" />
            </div>

            <div className="action-tile">
              <div className="tile-icon email"><Mail size={20} /></div>
              <div className="tile-info">
                <h4>Email Address</h4>
                <p>{user?.email}</p>
              </div>
              <ChevronRight size={18} color="#CCC" />
            </div>

            <div className="action-tile">
              <div className="tile-icon phone"><Phone size={20} /></div>
              <div className="tile-info">
                <h4>Mobile Number</h4>
                <p>{user?.phone || 'Not provided'}</p>
              </div>
              <ChevronRight size={18} color="#CCC" />
            </div>

            <div className="action-tile">
              <div className="tile-icon name" style={{background: '#fef3c7', color: '#d97706'}}><MapPin size={20} /></div>
              <div className="tile-info">
                <h4>Delivery Address</h4>
                <p>{user?.address || 'Add your address'}</p>
              </div>
              <ChevronRight size={18} color="#CCC" />
            </div>

            <div className="action-tile">
              <div className="tile-icon settings"><Settings size={20} /></div>
              <div className="tile-info">
                <h4>App Settings</h4>
                <p>Notifications & Privacy</p>
              </div>
              <ChevronRight size={18} color="#CCC" />
            </div>

            <div className="action-tile logout" onClick={() => {
              logout();
              navigate('/auth');
            }}>
              <div className="tile-icon logout"><LogOut size={20} /></div>
              <div className="tile-info">
                <h4>Logout</h4>
                <p>Securely sign out</p>
              </div>
              <ChevronRight size={18} color="#CCC" />
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="order-grid animate-up">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="modern-order-card">
                  <div className="o-head">
                    <span className="o-id">ID: {order._id.slice(-8).toUpperCase()}</span>
                    <span className={`o-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="o-body">
                    <p>₹{order.billDetails?.totalPayable || order.totalAmount}</p>
                    <span className="o-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="o-actions">
                    <button className="btn-o">Track</button>
                    <button className="btn-o primary">Details</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <ShoppingBag size={80} strokeWidth={1} />
                </div>
                <h3>No orders yet</h3>
                <p>Your shopping journey starts here.</p>
                <button className="go-shop-btn" onClick={() => navigate('/customer')}>
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Sticky Nav */}
      <div className="pg-mobile-nav">
        <StickyBottomNav />
      </div>
    </div>
  );
};

export default Profile;
