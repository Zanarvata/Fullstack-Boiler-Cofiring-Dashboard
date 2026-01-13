import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'operator';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('boiler_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with real API call
    // Demo credentials: admin/admin123 or operator/operator123
    if ((username === 'admin' && password === 'admin123') || 
        (username === 'operator' && password === 'operator123')) {
      const mockUser: User = {
        id: username === 'admin' ? '1' : '2',
        username,
        role: username === 'admin' ? 'admin' : 'operator',
        name: username === 'admin' ? 'Administrator' : 'Operator User'
      };
      setUser(mockUser);
      localStorage.setItem('boiler_user', JSON.stringify(mockUser));
      // In production: store JWT token
      localStorage.setItem('boiler_token', 'mock_jwt_token_' + Date.now());
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('boiler_user');
    localStorage.removeItem('boiler_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
