import { createContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  const login = async (data) => {
    const res = await authService.login(data);

    if (res.accessToken) {
      localStorage.setItem("accessToken", res.accessToken);
      setToken(res.accessToken);
      setUser(res.user);
    }

    return res;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem("accessToken");
    setUser(null);
    setToken(null);
    setCart(null);

  };

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe(token);
        if (res.user) setUser(res.user);
      } catch {
        localStorage.removeItem("accessToken");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
