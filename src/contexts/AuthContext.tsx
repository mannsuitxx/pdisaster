import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";

interface User {
  id?: string;
  _id?: string; // backend uses _id
  email: string;
  role: string;
  name: string;
  institution: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on app load
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    apiService
      .me()
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiService.login(email, password); // { message, token, user }
      if (!response?.user) throw new Error("Login failed");
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await apiService.register(userData); // { message, token, user }
      if (!response?.user) throw new Error("Registration failed");
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
