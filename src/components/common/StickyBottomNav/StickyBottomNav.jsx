import React from 'react';
import { Home, LayoutGrid, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StickyBottomNav.css';

const StickyBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/customer' },
    { icon: LayoutGrid, label: 'Categories', path: '/categories' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart' },
    { icon: ClipboardList, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="sticky-bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.label}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <item.icon size={24} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default StickyBottomNav;
