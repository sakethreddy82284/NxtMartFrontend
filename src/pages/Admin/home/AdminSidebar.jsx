import React from 'react';
import { 
  LayoutDashboard, ShoppingBag, Box, FileText, 
  Truck, BarChart3, Users, Users2, Settings, LogOut 
} from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = ({ activeTab, onTabChange, logout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'inventory', label: 'Inventory', icon: <Box size={20} /> },
    { id: 'invoice', label: 'Invoice', icon: <FileText size={20} /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> },
    { id: 'users', label: 'Customers', icon: <Users size={20} /> },
    { id: 'suppliers', label: 'Suppliers', icon: <Users2 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">KV</div>
        <span className="brand-name">INVEN</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout" onClick={logout}>
          <span className="nav-icon"><LogOut size={20} /></span>
          <span className="nav-label">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
