import React from 'react';
import { 
  LayoutDashboard, ShoppingBag, ListTree, 
  Settings, User, LogOut, PackageSearch,
  ClipboardList, TrendingUp
} from 'lucide-react';

export default function ManagerSidebar({ activeTab, onTabChange, logout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'analytics', label: 'Insights', icon: <TrendingUp size={20} /> },
    { id: 'orders', label: 'Order Flow', icon: <ClipboardList size={20} /> },
    { id: 'inventory', label: 'Products', icon: <PackageSearch size={20} /> },
    { id: 'categories', label: 'Categories', icon: <ListTree size={20} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  return (
    <aside className="manager-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">N</div>
        <div className="brand-info">
          <span className="brand-name">NxtMart</span>
          <span className="brand-role">Store Manager</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <span className="nav-label">Main Menu</span>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {activeTab === item.id && <div className="active-pill" />}
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-item" onClick={logout}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
