import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, ShoppingBag, IndianRupee, Shield, 
  Search, Bell, ArrowUpRight, TrendingUp, TrendingDown,
  Clock, Package, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../../components/Context/User';
import AdminSidebar from './AdminSidebar';
import AdminBI from '../bi/AdminBI'; // Added
import './AdminHome.css';

const BASE = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'https://nxtmartbackend-2-q25g.onrender.com' : 'http://localhost:2000';

export default function AdminHome() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, activeDeliveries: 0 });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, uRes, oRes] = await Promise.all([
        axios.get(`${BASE}/orders/stats`, { withCredentials: true }),
        axios.get(`${BASE}/auth/users`, { withCredentials: true }),
        axios.get(`${BASE}/orders/all`, { withCredentials: true })
      ]);
      setStats(sRes.data);
      setUsers(uRes.data.users);
      setOrders(oRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      await axios.put(`${BASE}/auth/update-role`, { userId, role: newRole }, { withCredentials: true });
      fetchData(); // Refresh
    } catch (err) {
      alert("Failed to update role");
    }
  };

  return (
    <div className="inven-admin-layout">
      <AdminSidebar 
        activeTab={activeTab === 'dashboard' ? 'dashboard' : activeTab} 
        onTabChange={setActiveTab} 
        logout={logout}
      />
      
      <main className="inven-main-content">
        {/* Top Header */}
        <header className="inven-top-header">
          <div className="header-search">
            <Search size={18} color="#94A3B8" />
            <input type="text" placeholder="Search anything..." />
          </div>
          <div className="header-actions">
            <button className="notif-btn"><Bell size={20} /></button>
            <div className="admin-profile-pill">
              <div className="admin-avatar">{user?.name?.[0].toUpperCase()}</div>
              <span className="admin-name">{user?.name}</span>
            </div>
          </div>
        </header>

        <div className="inven-scroll-area">
          {activeTab === 'dashboard' && (
            <div className="dashboard-view animate-in">
              <div className="inven-grid-layout">
                {/* Stats Row */}
                <div className="stats-row">
                  <div className="inven-stat-card">
                    <div className="stat-head">
                      <span className="stat-label">Total Order</span>
                      <div className="stat-trend up"><TrendingUp size={12} /> 10%</div>
                    </div>
                    <div className="stat-main">
                      <h2 className="stat-value">{stats.totalOrders}</h2>
                      <span className="stat-compare">Compared to last month</span>
                    </div>
                  </div>
                  <div className="inven-stat-card">
                    <div className="stat-head">
                      <span className="stat-label">Total Revenue</span>
                      <div className="stat-trend up"><TrendingUp size={12} /> 5%</div>
                    </div>
                    <div className="stat-main">
                      <h2 className="stat-value">₹{stats.revenue.toLocaleString()}</h2>
                      <span className="stat-compare">Compared to last month</span>
                    </div>
                  </div>
                  <div className="inven-stat-card">
                    <div className="stat-head">
                      <span className="stat-label">Delivered Order</span>
                      <div className="stat-trend down"><TrendingDown size={12} /> 10%</div>
                    </div>
                    <div className="stat-main">
                      <h2 className="stat-value">{stats.totalOrders - stats.activeDeliveries}</h2>
                      <span className="stat-compare">Compared to last month</span>
                    </div>
                  </div>
                  <div className="inven-stat-card">
                    <div className="stat-head">
                      <span className="stat-label">Active Deliveries</span>
                      <div className="stat-trend up"><TrendingUp size={12} /> 2%</div>
                    </div>
                    <div className="stat-main">
                      <h2 className="stat-value">{stats.activeDeliveries}</h2>
                      <span className="stat-compare">Compared to last month</span>
                    </div>
                  </div>
                </div>

                {/* Main Visual Row */}
                <div className="visual-row">
                  <div className="chart-container large">
                    <div className="chart-head">
                      <h3>Total Sales</h3>
                      <select className="chart-filter"><option>Month</option></select>
                    </div>
                    <div className="placeholder-chart">
                      {/* Simple SVG Line Placeholder */}
                      <svg viewBox="0 0 400 100" className="svg-line">
                        <path d="M0 80 Q 50 20, 100 70 T 200 40 T 300 60 T 400 20" fill="none" stroke="#7C3AED" strokeWidth="3" />
                      </svg>
                      <div className="chart-months">
                        <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                      </div>
                    </div>
                  </div>

                  <div className="chart-container small">
                    <div className="chart-head">
                      <h3>Top Selling Categories</h3>
                    </div>
                    <div className="category-bars">
                      {[
                        { name: 'Cold Drinks', val: 80, color: '#7C3AED' },
                        { name: 'Meats', val: 65, color: '#C084FC' },
                        { name: 'Bakery', val: 40, color: '#DDD6FE' }
                      ].map(cat => (
                        <div key={cat.name} className="cat-bar-row">
                          <span className="cat-name">{cat.name}</span>
                          <div className="bar-outer"><div className="bar-inner" style={{width: `${cat.val}%`, background: cat.color}}></div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="inven-table-card">
                  <div className="table-head">
                    <h3>Recent Platform Orders</h3>
                    <button className="view-all-btn" onClick={() => setActiveTab('orders')}>View All</button>
                  </div>
                  <div className="inven-table-wrap">
                    <table className="inven-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Bill Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(o => (
                          <tr key={o._id}>
                            <td className="mono">#{o._id.slice(-6).toUpperCase()}</td>
                            <td>
                              <div className="table-user">
                                <div className="avatar-sm">{o.userId?.name?.[0]}</div>
                                <span>{o.userId?.name || 'Guest'}</span>
                              </div>
                            </td>
                            <td className="bold">₹{o.billDetails?.totalPayable}</td>
                            <td><span className={`status-dot ${o.status}`}>{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-view animate-in">
              <div className="inven-table-card full">
                <div className="table-head">
                  <h3>Customer & Staff Management</h3>
                </div>
                <div className="inven-table-wrap">
                  <table className="inven-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Current Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td>
                            <div className="table-user">
                              <div className="avatar-sm">{u.name[0]}</div>
                              <span>{u.name}</span>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td className="mono">{u.phone || 'N/A'}</td>
                          <td><span className={`role-tag ${u.role}`}>{u.role}</span></td>
                          <td>
                            <select 
                              className="role-switcher" 
                              value={u.role}
                              onChange={(e) => updateRole(u._id, e.target.value)}
                            >
                              <option value="customer">Customer</option>
                              <option value="manager">Manager</option>
                              <option value="delivery">Delivery</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
             <div className="orders-view animate-in">
                {/* Full Order Table Implementation */}
                <div className="inven-table-card full">
                  <div className="table-head">
                    <h3>All Platform Orders</h3>
                  </div>
                  <div className="inven-table-wrap">
                    <table className="inven-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Assigned To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o._id}>
                            <td className="mono">#{o._id.slice(-6).toUpperCase()}</td>
                            <td>{o.userId?.name || 'Guest'}</td>
                            <td className="bold">₹{o.billDetails?.totalPayable}</td>
                            <td><span className={`status-dot ${o.status}`}>{o.status}</span></td>
                            <td>{o.assignedTo?.name || <span className="unassigned">Not Assigned</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
             </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-view animate-in">
               <AdminBI />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
