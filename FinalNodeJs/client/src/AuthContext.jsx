import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const signout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
