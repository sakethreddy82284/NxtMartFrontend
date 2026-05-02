import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Context/User';

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else {
        // Role-based routing
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'manager':
            navigate('/manager/home');
            break;
          case 'delivery':
            navigate('/delivery');
            break;
          case 'customer':
          default:
            navigate('/customer');
            break;
        }
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium animate-pulse">Initializing your experience...</p>
      </div>
    </div>
  );
};

export default RoleRedirect;
