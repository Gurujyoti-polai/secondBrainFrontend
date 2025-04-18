import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  fetchUser: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  fetchUser: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
