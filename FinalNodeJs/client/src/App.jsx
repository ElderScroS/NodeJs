import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthProvider, { AuthContext } from './AuthContext';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ChatList />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <PrivateRoute>
                <ChatWindow />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
