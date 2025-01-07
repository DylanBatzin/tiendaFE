import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element }) => {
  const isAuthenticated = !!localStorage.getItem('jwt'); 
  return isAuthenticated ? <Element /> : <Navigate to="/" />;
};

export default PrivateRoute;
