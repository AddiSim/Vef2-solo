// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const { authToken } = useAuth();

  if (!authToken) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedRoute;
