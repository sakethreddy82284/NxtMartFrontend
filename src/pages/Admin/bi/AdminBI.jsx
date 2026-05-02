import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Zap } from 'lucide-react';
import './AdminBI.css';

const BASE = 'http://localhost:2000';
const COLORS = ['#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

export default function AdminBI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBI();
  }, []);

  const fetchBI = async () => {
    try {
      const res = await axios.get(`${BASE}/orders/advanced-stats`, { withCredentials: true });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="bi-loading">Analyzing Market Data...</div>;
  if (!data) return <div className="bi-error">Failed to load BI Insights</div>;

  return (
    <div className="bi-container animate-up">
      <div className="bi-grid">
        
        {/* ── REVENUE GROWTH ── */}
        <div className="bi-card full-width">
          <div className="card-header">
            <div className="header-info">
              <TrendingUp className="header-icon" />
              <div>
                <h3>Revenue Growth</h3>
                <p>30-day transactional volume trend</p>
              </div>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.revenueGrowth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`₹${v}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── TOP CATEGORIES ── */}
        <div className="bi-card">
          <div className="card-header">
            <div className="header-info">
              <PieIcon className="header-icon pink" />
              <div>
                <h3>Category Share</h3>
                <p>Top selling product groups</p>
              </div>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.categoryStats}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="_id"
                >
                  {data.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── DELIVERY PERFORMANCE ── */}
        <div className="bi-card">
          <div className="card-header">
            <div className="header-info">
              <Zap className="header-icon yellow" />
              <div>
                <h3>Logistics Speed</h3>
                <p>Average delivery time (min)</p>
              </div>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.deliveryPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="_id" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="avgTime" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
