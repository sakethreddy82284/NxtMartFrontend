import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Zap } from 'lucide-react';
import './AdminBI.css';

const BASE = 'https://nxtmartbackend-2-q25g.onrender.com';
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
      {/* ── PAGE HEADER ── */}
      <header className="bi-page-header">
        <h1 className="bi-main-title">Store Insights</h1>
        <p className="bi-main-subtitle">Operational performance and trend analysis</p>
      </header>

      <div className="bi-grid">
        
        {/* ── REVENUE GROWTH ── */}
        <div className="bi-card full-width">
          <div className="card-header">
            <h3 className="section-title">7-Day Revenue Trend</h3>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data.revenueGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--z-green)" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="var(--z-green)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="_id" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                  tickFormatter={(val) => {
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const date = new Date(val);
                    return isNaN(date) ? val : days[date.getDay()];
                  }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => v === 0 ? '0' : v}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontWeight: 700, color: 'var(--z-green)' }}
                  cursor={{ stroke: 'var(--z-green)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--z-green)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRev)"
                  dot={{ r: 5, fill: 'var(--z-green)', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: 'var(--z-green)', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── TOP CATEGORIES ── */}
        <div className="bi-card">
          <div className="card-header">
            <h3 className="section-title">Category Share</h3>
          </div>
          <div className="chart-wrap center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categoryStats}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  nameKey="_id"
                  cornerRadius={10}
                >
                  {data.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--z-green)' : index === 1 ? '#F97316' : COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── DELIVERY PERFORMANCE ── */}
        <div className="bi-card">
          <div className="card-header">
            <h3 className="section-title">Logistics Speed</h3>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.deliveryPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="avgTime" fill="var(--z-green)" radius={[10, 10, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
