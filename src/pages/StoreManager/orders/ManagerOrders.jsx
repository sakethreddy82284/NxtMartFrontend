import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Truck, User, Clock, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';
import './ManagerOrders.css';

const BASE = 'https://nxtmartbackend-2-q25g.onrender.com';

export default function ManagerOrders() {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [oRes, pRes] = await Promise.all([
        axios.get(`${BASE}/orders/all`, { withCredentials: true }),
        axios.get(`${BASE}/auth/partners`, { withCredentials: true })
      ]);
      setOrders(oRes.data);
      setPartners(pRes.data.partners);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (orderId, partnerId) => {
    if (!partnerId) return;
    try {
      setAssigningId(orderId);
      await axios.put(`${BASE}/orders/assign`, { orderId, partnerId }, { withCredentials: true });
      fetchData(); // Refresh
    } catch (err) {
      alert("Failed to assign order");
    } finally {
      setAssigningId(null);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE}/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
      fetchData(); // Refresh
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const unassignedOrders = orders.filter(o => o.status === 'pending');
  const activeOrders = orders.filter(o => o.status !== 'pending' && o.status !== 'delivered' && o.status !== 'cancelled');

  if (loading) return <div className="manager-loading">Loading Order Flow...</div>;

  return (
    <div className="manager-orders-root">
      {/* ── COMMAND CENTER HEADER ── */}
      <header className="command-header">
        <div className="command-info">
          <h1 className="command-title">Order Command Center</h1>
          <p className="command-subtitle">Real-time logistics & delivery monitoring</p>
        </div>
        <div className="command-stats">
          <div className="stat-card">
            <span className="stat-val">{orders.length}</span>
            <span className="stat-lab">Total Orders</span>
          </div>
          <div className="stat-card accent">
            <span className="stat-val">{unassignedOrders.length}</span>
            <span className="stat-lab">Waiting Partner</span>
          </div>
          <div className="stat-card success">
            <span className="stat-val">{activeOrders.length}</span>
            <span className="stat-lab">In Transit</span>
          </div>
        </div>
      </header>

      <div className="command-grid">
        {/* ── LEFT: PENDING POOL ── */}
        <section className="command-section">
          <div className="section-head">
            <AlertCircle size={20} className="pulse-icon" />
            <h2>Pending Assignment</h2>
          </div>
          
          <div className="order-stack">
            {unassignedOrders.length > 0 ? unassignedOrders.map(order => (
              <div key={order._id} className="glass-order-card pending">
                <div className="card-top">
                  <div className="order-tag">#{order._id.slice(-6).toUpperCase()}</div>
                  <span className="time-ago">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>

                <div className="card-mid">
                  <div className="user-info">
                    <User size={16} />
                    <span>{order.userId?.name || 'Guest User'}</span>
                  </div>
                  <div className="item-preview">
                    {order.items.length} items • {order.items.map(it => it.name).join(', ')}
                  </div>
                </div>

                <div className="card-bottom">
                  <div className="price-tag">₹{order.billDetails?.totalPayable || 0}</div>
                  <div className="assign-action">
                    <select 
                      onChange={(e) => handleAssign(order._id, e.target.value)}
                      disabled={assigningId === order._id}
                      className="command-select"
                    >
                      <option value="">Assign Partner...</option>
                      {partners.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-command-state">
                <CheckCircle size={40} />
                <p>All orders assigned</p>
              </div>
            )}
          </div>
        </section>

        {/* ── RIGHT: ACTIVE FLOW ── */}
        <section className="command-section">
          <div className="section-head">
            <Truck size={20} />
            <h2>Live Logistics Flow</h2>
          </div>

          <div className="order-stack">
            {activeOrders.length > 0 ? activeOrders.map(order => (
              <div key={order._id} className={`glass-order-card active status-${order.status}`}>
                <div className="card-top">
                  <div className="order-tag">#{order._id.slice(-6).toUpperCase()}</div>
                  <div className={`status-pill ${order.status}`}>{order.status}</div>
                </div>

                <div className="card-mid">
                   <div className="logistics-info">
                    <div className="log-row">
                      <Truck size={14} />
                      <span>Partner: <b>{order.assignedTo?.name || 'Unassigned'}</b></span>
                    </div>
                    <div className="log-row">
                      <User size={14} />
                      <span>Deliver to: {order.userId?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="card-bottom">
                  <div className="price-tag small">₹{order.billDetails?.totalPayable || 0}</div>
                  
                  {/* --- NEW ACTION BUTTONS FOR MANAGER --- */}
                  <div className="manager-actions">
                    {order.status === 'confirmed' && (
                      <button className="mgr-btn pack" onClick={() => handleStatusUpdate(order._id, 'packing')}>
                        Start Packing
                      </button>
                    )}
                    {order.status === 'packing' && (
                      <button className="mgr-btn ready" onClick={() => handleStatusUpdate(order._id, 'ready')}>
                        Mark as Ready
                      </button>
                    )}
                    {(order.status === 'ready' || order.status === 'out-for-delivery') && (
                      <div className="transit-wait">
                        <Clock size={12} />
                        <span>{order.status === 'ready' ? 'Waiting for pickup' : 'On the way'}</span>
                      </div>
                    )}
                  </div>

                  <div className="progress-mini">
                    <div className={`progress-bar ${order.status}`}></div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-command-state">
                <Package size={40} />
                <p>No active deliveries</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
