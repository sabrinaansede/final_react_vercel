import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const rawUser = localStorage.getItem("usuario");
      return rawUser ? JSON.parse(rawUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const rawToken = localStorage.getItem("token");
      return rawToken || null;
    } catch {
      return null;
    }
  });

  const [guestMode, setGuestMode] = useState(() => {
    try {
      return localStorage.getItem("guestMode") === "true";
    } catch {
      return false;
    }
  });

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setGuestMode(false);
    try {
      localStorage.setItem("usuario", JSON.stringify(userData));
      localStorage.setItem("token", jwtToken || "");
      localStorage.removeItem("guestMode");
    } catch {}
    window.dispatchEvent(new Event("storage"));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setGuestMode(false);
    try {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      localStorage.removeItem("guestMode");
    } catch {}
    window.dispatchEvent(new Event("storage"));
  };

  const enterGuestMode = () => {
    setUser(null);
    setToken(null);
    setGuestMode(true);
    try {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      localStorage.setItem("guestMode", "true");
    } catch {}
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AuthContext.Provider value={{ user, token, guestMode, login, logout, enterGuestMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
