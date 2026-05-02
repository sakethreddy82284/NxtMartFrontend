/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/Context/User';
import Navbar from '../../../components/common/navbar/Navbar';
import { 
  User, Mail, Phone, Store, Settings, 
  ChevronRight, LogOut, ShieldCheck, 
  Activity, Briefcase, Bell
} from 'lucide-react';
import './ManagerProfile.css';

const ManagerProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="mgr-profile-wrapper">
      <Navbar />

      <section className="mgr-profile-hero">
        <div className="mgr-avatar-box">
          <div className="mgr-avatar-circle">
            {user?.name?.charAt(0).toUpperCase() || 'M'}
          </div>
          <div className="mgr-role-badge">Store Manager</div>
        </div>
        <h1 className="mgr-name">{user?.name || 'Manager Name'}</h1>
        <p className="mgr-email">{user?.email}</p>
        <div className="mgr-verified">
          <ShieldCheck size={14} />
          <span>Authorized Access</span>
        </div>
      </section>

      <main className="mgr-profile-main">
        <div className="mgr-tiles-stack">
          {/* Section: Account Info */}
          <div className="mgr-section-label">Account Information</div>
          
          <div className="mgr-action-tile">
            <div className="mgr-tile-icon user"><User size={20} /></div>
            <div className="mgr-tile-info">
              <h4>Full Name</h4>
              <p>{user?.name}</p>
            </div>
            <ChevronRight size={18} className="mgr-chevron" />
          </div>

          <div className="mgr-action-tile">
            <div className="mgr-tile-icon email"><Mail size={20} /></div>
            <div className="mgr-tile-info">
              <h4>Email Address</h4>
              <p>{user?.email}</p>
            </div>
            <ChevronRight size={18} className="mgr-chevron" />
          </div>

          <div className="mgr-action-tile">
            <div className="mgr-tile-icon phone"><Phone size={20} /></div>
            <div className="mgr-tile-info">
              <h4>Contact Number</h4>
              <p>{user?.phone || 'Add phone number'}</p>
            </div>
            <ChevronRight size={18} className="mgr-chevron" />
          </div>

          {/* Section: Management */}
          <div className="mgr-section-label">Management & Settings</div>

          <div className="mgr-action-tile">
            <div className="mgr-tile-icon store"><Store size={20} /></div>
            <div className="mgr-tile-info">
              <h4>Store Details</h4>
              <p>Configure shop settings</p>
            </div>
            <ChevronRight size={18} className="mgr-chevron" />
          </div>

          <div className="mgr-action-tile">
            <div className="mgr-tile-icon activity"><Activity size={20} /></div>
            <div className="mgr-tile-info">
              <h4>Performance Logs</h4>
              <p>Review store analytics</p>
            </div>
            <ChevronRight size={18} className="mgr-chevron" />
          </div>

          <div className="mgr-action-tile">
            <div className="mgr-tile-icon settings"><Settings size={20} /></div>
            <div className="mgr-tile-info">
              <h4>Admin Settings</h4>
              <p>Security & Notifications</p>
            </div>
            <ChevronRight size={18} className="mgr-chevron" />
          </div>

          {/* Logout */}
          <div className="mgr-action-tile mgr-logout" onClick={handleLogout}>
            <div className="mgr-tile-icon logout"><LogOut size={20} /></div>
            <div className="mgr-tile-info">
              <h4>Sign Out</h4>
              <p>Securely exit dashboard</p>
            </div>
            <ChevronRight size={18} className="mgr-chevron" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerProfile;
