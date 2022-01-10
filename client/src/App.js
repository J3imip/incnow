import React from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { useAuth } from './hooks/auth.hook.js';
import { AuthContext } from './context/AuthContext.js';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useRoutes from './routes';

function App() {
  const {token, login, logout, userId, username} = useAuth();
  const isAuthenticated = !!token; // user authenticated if the token exists in localStorage 
  const routes = useRoutes(isAuthenticated);

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, username, isAuthenticated
    }}>
      <Router>
        <ToastContainer/>
        {routes}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;