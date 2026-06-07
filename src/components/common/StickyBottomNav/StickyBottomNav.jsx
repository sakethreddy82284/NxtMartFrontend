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
    { icon: ShoppingCart, label: 'Cart', path: '/cart', isCenter: true },
    { icon: ClipboardList, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="sticky-bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.label}
            className={`nav-item ${isActive ? 'active' : ''} ${item.isCenter ? 'center-fab' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.isCenter ? (
              <div className="fab-circle">
                <item.icon size={26} strokeWidth={2.5} />
              </div>
            ) : (
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            )}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default StickyBottomNav;
