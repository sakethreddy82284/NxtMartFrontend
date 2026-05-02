import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/User";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;