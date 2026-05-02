// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:2000/auth/me", {
        withCredentials: true, // 🍪 cookies
      });
      setUser(res.data.user);
    } catch (err) {
      // User is not logged in (expected 401), stay silent
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post("http://localhost:2000/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
export default AuthProvider;