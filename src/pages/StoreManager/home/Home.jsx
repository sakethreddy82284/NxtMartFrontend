import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, IndianRupee, Package, Clock, 
  Search, Bell, TrendingUp, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../components/Context/User';
import ManagerSidebar from './ManagerSidebar';
import CategoriesPage from '../catagory/Category';
import ManagerOrders from '../orders/ManagerOrders';
import Product from '../product/Product';
import ManagerProfile from '../profile/ManagerProfile';
import ManagerAnalytics from './ManagerAnalytics';
import './ManagerHome.css';

const BASE = 'http://localhost:2000';

export default function ManagerHome() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, activeDeliveries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/orders/stats`, { withCredentials: true });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-dashboard-layout">
      <ManagerSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        logout={logout}
      />
      
      <main className="manager-main-content">
        {/* Top Header */}
        <header className="manager-top-header">
          <div className="header-search">
            <Search size={18} color="#94A3B8" />
            <input type="text" placeholder="Search orders, products..." />
          </div>
          <div className="header-actions">
            <button className="notif-btn"><Bell size={20} /></button>
            <div className="manager-profile-pill" onClick={() => setActiveTab('profile')}>
              <div className="manager-avatar">{user?.name?.[0].toUpperCase()}</div>
              <div className="manager-meta">
                <span className="manager-name">{user?.name}</span>
                <span className="manager-status">Online</span>
              </div>
            </div>
          </div>
        </header>

        <div className="manager-scroll-area">
          {activeTab === 'dashboard' && (
            <div className="dashboard-view animate-in">
              <div className="view-header">
                <h1>Operations Dashboard</h1>
                <p>Welcome back! Here's what's happening in your store today.</p>
              </div>

              <div className="m-stats-grid">
                <div className="m-stat-card">
                  <div className="m-stat-icon purple"><ShoppingBag size={24} /></div>
                  <div className="m-stat-info">
                    <span className="m-label">Today's Orders</span>
                    <h2 className="m-value">{stats.totalOrders}</h2>
                  </div>
                  <div className="m-trend up">+12%</div>
                </div>
                
                <div className="m-stat-card">
                  <div className="m-stat-icon green"><IndianRupee size={24} /></div>
                  <div className="m-stat-info">
                    <span className="m-label">Daily Revenue</span>
                    <h2 className="m-value">₹{stats.revenue.toLocaleString()}</h2>
                  </div>
                  <div className="m-trend up">+8%</div>
                </div>

                <div className="m-stat-card">
                  <div className="m-stat-icon orange"><Clock size={24} /></div>
                  <div className="m-stat-info">
                    <span className="m-label">Active Orders</span>
                    <h2 className="m-value">{stats.activeDeliveries}</h2>
                  </div>
                  <div className="m-trend">In-Progress</div>
                </div>

                <div className="m-stat-card">
                  <div className="m-stat-icon blue"><Package size={24} /></div>
                  <div className="m-stat-info">
                    <span className="m-label">Inventory Health</span>
                    <h2 className="m-value">94%</h2>
                  </div>
                  <div className="m-trend">Healthy</div>
                </div>
              </div>

              <div className="m-activity-section">
                <div className="m-activity-card">
                  <div className="card-head">
                    <h3>Recent Operations</h3>
                    <button className="text-btn" onClick={() => setActiveTab('orders')}>
                      Full Log <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="a-dot blue" />
                      <div className="a-text">Inventory for <b>Fresh Mangoes</b> updated by 10 units.</div>
                      <div className="a-time">2 mins ago</div>
                    </div>
                    <div className="activity-item">
                      <div className="a-dot green" />
                      <div className="a-text">Order <b>#XT9982</b> marked as out for delivery.</div>
                      <div className="a-time">15 mins ago</div>
                    </div>
                    <div className="activity-item">
                      <div className="a-dot purple" />
                      <div className="a-text">New category <b>Seasonal Specials</b> created.</div>
                      <div className="a-time">1 hour ago</div>
                    </div>
                  </div>
                </div>

                <div className="m-quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="qa-grid">
                    <button className="qa-btn" onClick={() => setActiveTab('inventory')}>Add Product</button>
                    <button className="qa-btn" onClick={() => setActiveTab('categories')}>Edit Categories</button>
                    <button className="qa-btn" onClick={() => setActiveTab('orders')}>View Pending</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && <div className="animate-in"><ManagerAnalytics /></div>}
          {activeTab === 'orders' && <div className="animate-in"><ManagerOrders /></div>}
          {activeTab === 'inventory' && <div className="animate-in"><Product /></div>}
          {activeTab === 'categories' && <div className="animate-in"><CategoriesPage /></div>}
          {activeTab === 'profile' && <div className="animate-in"><ManagerProfile /></div>}
        </div>
      </main>
    </div>
  );
}
