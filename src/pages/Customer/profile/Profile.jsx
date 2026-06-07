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
  ShieldCheck, CreditCard, Edit3, X, Save,
  CheckCircle2
} from 'lucide-react';
import './Profile.css';

const Profile = ({ initialTab = 'profile' }) => {
  const { user, logout, getUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(user?.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await axios.put('http://localhost:2000/auth/update-profile', 
        { address: addressInput }, 
        { withCredentials: true }
      );
      await getUser();
      setIsEditingAddress(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Update address error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-wrapper">
      <Navbar />

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

      {showSuccess && (
        <div className="profile-toast">
          <CheckCircle2 size={18} />
          <span>Address updated successfully!</span>
        </div>
      )}

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

      <main className="profile-main">
        {activeTab === 'profile' && (
          <div className="tiles-stack animate-up">
            <div className="action-tile">
              <div className="tile-icon name"><User size={20} /></div>
              <div className="tile-info">
                <h4>Full Name</h4>
                <p>{user?.name}</p>
              </div>
              <Edit3 size={16} color="#CCC" />
            </div>

            <div className="action-tile">
              <div className="tile-icon email"><Mail size={20} /></div>
              <div className="tile-info">
                <h4>Email Address</h4>
                <p>{user?.email}</p>
              </div>
              <ShieldCheck size={16} color="#22c55e" />
            </div>

            <div className="action-tile">
              <div className="tile-icon phone"><Phone size={20} /></div>
              <div className="tile-info">
                <h4>Mobile Number</h4>
                <p>{user?.phone || 'Not provided'}</p>
              </div>
              <Edit3 size={16} color="#CCC" />
            </div>

            <div className="action-tile clickable" onClick={() => navigate('/wallet')}>
              <div className="tile-icon email" style={{background: '#fef3c7', color: '#d97706'}}><CreditCard size={20} /></div>
              <div className="tile-info">
                <h4>NxtMart Wallet</h4>
                <p>Manage balance & cashback</p>
              </div>
              <div className="wallet-badge-mini">₹450</div>
              <ChevronRight size={18} color="#CCC" />
            </div>

            <div className="action-tile clickable" onClick={() => {
              setAddressInput(user?.address || '');
              setIsEditingAddress(true);
            }}>
              <div className="tile-icon address"><MapPin size={20} /></div>
              <div className="tile-info">
                <h4>Delivery Address</h4>
                <p className="p-truncate">{user?.address || 'Click to add your address...'}</p>
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
                    <span className="o-id">#{order._id.slice(-6).toUpperCase()}</span>
                    <span className={`o-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="o-body">
                    <div className="o-amount">₹{order.billDetails?.totalPayable || order.totalAmount}</div>
                    <span className="o-date">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="o-actions">
                    <button 
                      className="btn-o" 
                      onClick={() => navigate(`/customer/track/${order._id}`)}
                    >
                      Track Order
                    </button>
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

      {isEditingAddress && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-card animate-scale">
            <div className="modal-header">
              <h3>Update Address</h3>
              <button className="close-btn" onClick={() => setIsEditingAddress(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateAddress}>
              <div className="modal-body">
                <label>Complete Delivery Address</label>
                <textarea 
                  placeholder="Flat No, Building Name, Street, Landmark, Pincode..."
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  required
                  rows={4}
                  autoFocus
                />
                <p className="input-hint">Accurate address helps in faster deliveries.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsEditingAddress(false)}>Cancel</button>
                <button type="submit" className="save-btn" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pg-mobile-nav">
        <StickyBottomNav />
      </div>
    </div>
  );
};

export default Profile;
