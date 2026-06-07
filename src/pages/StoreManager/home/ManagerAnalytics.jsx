import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';

const data = [
  { day: 'Mon', revenue: 12000, orders: 45 },
  { day: 'Tue', revenue: 15000, orders: 52 },
  { day: 'Wed', revenue: 18000, orders: 61 },
  { day: 'Thu', revenue: 14000, orders: 48 },
  { day: 'Fri', revenue: 22000, orders: 75 },
  { day: 'Sat', revenue: 28000, orders: 92 },
  { day: 'Sun', revenue: 25000, orders: 88 },
];

const catData = [
  { name: 'Dairy', value: 400, color: '#1A4D2E' },
  { name: 'Fruits', value: 300, color: '#EA580C' },
  { name: 'Meat', value: 200, color: '#7c3aed' },
  { name: 'Bakery', value: 150, color: '#3b82f6' },
];

export default function ManagerAnalytics() {
  return (
    <div className="analytics-view animate-in">
      <div className="view-header">
        <h1>Store Insights</h1>
        <p>Operational performance and trend analysis</p>
      </div>

      <div className="analytics-grid">
        {/* Revenue Trend */}
        <div className="chart-card span-2">
          <div className="chart-head">
            <h3>7-Day Revenue Trend</h3>
            <span className="trend-pill up">+14.2%</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1A4D2E" 
                  strokeWidth={3} 
                  dot={{r: 4, fill: '#1A4D2E'}} 
                  activeDot={{r: 6}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="chart-card">
          <div className="chart-head">
            <h3>Category Share</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={catData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {catData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {catData.map(c => (
                <div key={c.name} className="legend-item">
                  <div className="dot" style={{background: c.color}} />
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="metrics-stack">
          <div className="mini-metric-card">
            <div className="m-icon"><Users size={20} /></div>
            <div className="m-info">
              <span className="m-label">New Customers</span>
              <h4 className="m-val">128</h4>
            </div>
          </div>
          <div className="mini-metric-card">
            <div className="m-icon"><Package size={20} /></div>
            <div className="m-info">
              <span className="m-label">Stock Accuracy</span>
              <h4 className="m-val">99.2%</h4>
            </div>
          </div>
          <div className="mini-metric-card">
             <div className="m-icon"><DollarSign size={20} /></div>
            <div className="m-info">
              <span className="m-label">Avg Order Value</span>
              <h4 className="m-val">₹482</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
