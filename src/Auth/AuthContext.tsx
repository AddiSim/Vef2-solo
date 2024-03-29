import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface AuthContextType {
  authToken: string | null;
  user: string | null;
  setAuthToken: (token: string | null) => void;
  setUser: (username: string | null) => void;
  logout: () => void;
}

const initialAuthContext = {
  authToken: null,
  user: null,
  setAuthToken: () => {},
  setUser: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    console.log(user, authToken)
  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Additional cleanup actions if necessary
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, user, setAuthToken, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier consumption of the context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
