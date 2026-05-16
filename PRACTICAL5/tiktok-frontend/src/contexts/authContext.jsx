"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "@/services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ ...decoded, token });
      } catch {
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    const { token } = data;

    if (!token) {
      throw new Error("No token returned from server");
    }

    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    const userData = { ...decoded, token };
    setUser(userData);

    return userData;
  };

  const register = async (username, email, password, name) => {
    return registerUser({
      username,
      email,
      password,
      name: name || username,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
