/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/Context/User';
import Navbar from '../../../components/common/navbar/Navbar';
import { 
  User, Mail, Phone, Truck, Settings, 
  ChevronRight, LogOut, ShieldCheck, 
  Star, Wallet, MapPin, History
} from 'lucide-react';
import './DeliveryProfile.css';

const DeliveryProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="dlv-profile-wrapper">
      <Navbar />

      <section className="dlv-profile-hero">
        <div className="dlv-avatar-box">
          <div className="dlv-avatar-circle">
            {user?.name?.charAt(0).toUpperCase() || 'D'}
          </div>
          <div className="dlv-role-badge">Delivery Partner</div>
        </div>
        <h1 className="dlv-name">{user?.name || 'Partner Name'}</h1>
        <p className="dlv-email">{user?.email}</p>
        
        <div className="dlv-stats-row">
          <div className="dlv-stat-card">
            <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
            <span>4.9 Rating</span>
          </div>
          <div className="dlv-stat-card">
            <History size={16} />
            <span>1,240 Trips</span>
          </div>
        </div>
      </section>

      <main className="dlv-profile-main">
        <div className="dlv-tiles-stack">
          {/* Section: Performance */}
          <div className="dlv-section-label">Performance & Earnings</div>
          
          <div className="dlv-action-tile">
            <div className="dlv-tile-icon wallet"><Wallet size={20} /></div>
            <div className="dlv-tile-info">
              <h4>My Earnings</h4>
              <p>Check daily & weekly payouts</p>
            </div>
            <div className="dlv-earnings-preview">₹12,450</div>
            <ChevronRight size={18} className="dlv-chevron" />
          </div>

          {/* Section: Account Info */}
          <div className="dlv-section-label">Account Details</div>
          
          <div className="dlv-action-tile">
            <div className="dlv-tile-icon user"><User size={20} /></div>
            <div className="dlv-tile-info">
              <h4>Full Name</h4>
              <p>{user?.name}</p>
            </div>
            <ChevronRight size={18} className="dlv-chevron" />
          </div>

          <div className="dlv-action-tile">
            <div className="dlv-tile-icon email"><Mail size={20} /></div>
            <div className="dlv-tile-info">
              <h4>Email Address</h4>
              <p>{user?.email}</p>
            </div>
            <ChevronRight size={18} className="dlv-chevron" />
          </div>

          <div className="dlv-action-tile">
            <div className="dlv-tile-icon phone"><Phone size={20} /></div>
            <div className="dlv-tile-info">
              <h4>Contact Number</h4>
              <p>{user?.phone || 'Add phone number'}</p>
            </div>
            <ChevronRight size={18} className="dlv-chevron" />
          </div>

          {/* Section: Vehicle & Support */}
          <div className="dlv-section-label">Vehicle & Documentation</div>

          <div className="dlv-action-tile">
            <div className="dlv-tile-icon truck"><Truck size={20} /></div>
            <div className="dlv-tile-info">
              <h4>Vehicle Info</h4>
              <p>Registration & Insurance</p>
            </div>
            <div className="dlv-badge verified">Verified</div>
            <ChevronRight size={18} className="dlv-chevron" />
          </div>

          <div className="dlv-action-tile">
            <div className="dlv-tile-icon settings"><Settings size={20} /></div>
            <div className="dlv-tile-info">
              <h4>Preferences</h4>
              <p>Shift & Zone settings</p>
            </div>
            <ChevronRight size={18} className="dlv-chevron" />
          </div>

          {/* Logout */}
          <div className="dlv-action-tile dlv-logout" onClick={handleLogout}>
            <div className="dlv-tile-icon logout"><LogOut size={20} /></div>
            <div className="dlv-tile-info">
              <h4>Go Offline</h4>
              <p>Securely sign out</p>
            </div>
            <ChevronRight size={18} className="dlv-chevron" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeliveryProfile;
