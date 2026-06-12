import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, MapPin, Phone, CheckCircle, 
  Clock, Navigation, ChevronRight, AlertCircle
} from 'lucide-react';
import './DeliveryHome.css';
import Navbar from '../../../components/common/navbar/Navbar';

import { BASE_URL } from '../../../config';

export default function DeliveryHome() {
  const [tasks, setTasks] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [earnings, setEarnings] = useState({ daily: 1450, total: 12840 });

  useEffect(() => {
    fetchData();
  
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [taskRes, unassignedRes] = await Promise.all([
        axios.get(`${BASE_URL}/orders/tasks`, { withCredentials: true }),
        axios.get(`${BASE_URL}/orders/unassigned`, { withCredentials: true })
      ]);
      setTasks(taskRes.data);
      setUnassigned(unassignedRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.status === 403 ? "Access Denied: You need Delivery Partner permissions." : "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
      fetchData(); // Refresh
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const claimOrder = async (orderId) => {
    try {
      await axios.put(`${BASE_URL}/orders/${orderId}/claim`, {}, { withCredentials: true });
      fetchData(); // Refresh
    } catch (err) {
      alert("Failed to claim order. It might already be taken.");
    }
  };

  return (
    <div className="delivery-root">
      <Navbar hideSearch={true} />
      
      <main className="delivery-container">
        <header className="delivery-header">
          <div className="header-top">
            <h1 className="delivery-title">Pilot Console</h1>
            <div className={`status-toggle ${isOnline ? 'online' : 'offline'}`} onClick={() => setIsOnline(!isOnline)}>
              <div className="toggle-dot"></div>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <div className="delivery-earnings-bar">
            <div className="e-card">
              <span className="e-label">Today's Earnings</span>
              <h2 className="e-value">₹{earnings.daily}</h2>
            </div>
            <div className="e-card">
              <span className="e-label">Weekly Total</span>
              <h2 className="e-value">₹{earnings.total}</h2>
            </div>
          </div>

          <div className="delivery-stats">
            <div className="stat-pill"><b>{tasks.length}</b> My Tasks</div>
            <div className="stat-pill highlight"><b>{unassigned.length}</b> Available Feed</div>
          </div>
        </header>

        {error && (
          <div className="delivery-error-msg">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading && !tasks.length && !unassigned.length ? (
          <div className="delivery-loading">Loading Order Feed...</div>
        ) : (
          <div className="delivery-sections">
            {/* --- AVAILABLE POOL --- */}
            {unassigned.length > 0 && (
              <section className="delivery-section">
                <h3 className="section-label"><Clock size={16} /> Available to Pick Up</h3>
                <div className="tasks-list">
                  {unassigned.map(task => (
                    <div key={task._id} className="task-card unassigned">
                      <div className="task-header">
                        <div className="order-id">#{task._id.slice(-6).toUpperCase()}</div>
                        <span className="time-badge">{new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="task-body">
                         <div className="address-box">
                          <MapPin size={16} />
                          <p>{task.userId?.address || 'Standard Delivery'}</p>
                        </div>
                        <div className="order-summary">
                          <Package size={14} />
                          <span>{task.items?.length} items • ₹{task.billDetails?.totalPayable}</span>
                        </div>
                      </div>
                      <button className="claim-btn" onClick={() => claimOrder(task._id)}>
                        Claim & Start
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* --- MY TASKS --- */}
            <section className="delivery-section">
              <h3 className="section-label"><Navigation size={16} /> My Active Deliveries</h3>
              {tasks.length === 0 ? (
                <div className="delivery-empty">
                  <CheckCircle size={32} className="empty-icon" />
                  <p>No active tasks. Claim one from the pool above!</p>
                </div>
              ) : (
                <div className="tasks-list">
                  {tasks.map(task => (
                    <div key={task._id} className={`task-card status-${task.status}`}>
                      <div className="task-header">
                        <div className="order-id">#{task._id.slice(-6).toUpperCase()}</div>
                        <div className="task-status-badge">{task.status}</div>
                      </div>

                      <div className="task-body">
                        <div className="customer-row">
                          <div className="customer-avatar">{task.userId?.name[0]}</div>
                          <div className="customer-info">
                            <h4>{task.userId?.name}</h4>
                            <div className="customer-meta">
                              <Phone size={12} /> {task.userId?.phone}
                            </div>
                          </div>
                          <a href={`tel:${task.userId?.phone}`} className="call-btn">
                            <Phone size={18} />
                          </a>
                        </div>

                        <div className="address-box">
                          <MapPin size={16} className="pin-icon" />
                          <p>{task.userId?.address || 'Address not provided'}</p>
                          <button className="nav-link-btn" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.userId?.address)}`, '_blank')}>
                            <Navigation size={14} /> Navigate
                          </button>
                        </div>
                      </div>

                      <div className="task-actions">
                        {task.status === 'ready' && (
                          <button className="action-btn out" onClick={() => updateStatus(task._id, 'out-for-delivery')}>
                            Pick Up & Start Delivery
                          </button>
                        )}
                        {task.status === 'out-for-delivery' && (
                          <button className="action-btn deliver" onClick={() => updateStatus(task._id, 'delivered')}>
                            Mark as Delivered
                          </button>
                        )}
                        {(task.status === 'confirmed' || task.status === 'packing') && (
                          <div className="status-waiting">
                            <Clock size={14} />
                            <span>Being packed by store...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
