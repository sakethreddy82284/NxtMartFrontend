import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, MapPin, Phone, CheckCircle, 
  Clock, Navigation, ChevronRight, AlertCircle
} from 'lucide-react';
import './DeliveryHome.css';
import Navbar from '../../../components/common/navbar/Navbar';

const BASE = 'http://localhost:2000';

export default function DeliveryHome() {
  const [tasks, setTasks] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [taskRes, unassignedRes] = await Promise.all([
        axios.get(`${BASE}/orders/tasks`, { withCredentials: true }),
        axios.get(`${BASE}/orders/unassigned`, { withCredentials: true })
      ]);
      setTasks(taskRes.data);
      setUnassigned(unassignedRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE}/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
      fetchData(); // Refresh
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const claimOrder = async (orderId) => {
    try {
      await axios.put(`${BASE}/orders/${orderId}/claim`, {}, { withCredentials: true });
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
          <h1 className="delivery-title">Delivery Dashboard</h1>
          <div className="delivery-stats">
            <div className="stat-pill"><b>{tasks.length}</b> My Tasks</div>
            <div className="stat-pill highlight"><b>{unassigned.length}</b> Available</div>
          </div>
        </header>

        {loading ? (
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
                        </div>
                      </div>

                      <div className="task-actions">
                        {task.status === 'confirmed' && (
                          <button className="action-btn start" onClick={() => updateStatus(task._id, 'packing')}>
                            Start Packing
                          </button>
                        )}
                        {task.status === 'packing' && (
                          <button className="action-btn ready" onClick={() => updateStatus(task._id, 'ready')}>
                            Mark as Ready
                          </button>
                        )}
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
