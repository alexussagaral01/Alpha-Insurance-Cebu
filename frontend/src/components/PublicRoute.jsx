import React from 'react';
import { Navigate } from 'react-router-dom';

function PublicRoute({ element }) {
  const isAuthenticated = localStorage.getItem('user');
  
  // If user is logged in, redirect to records page
  if (isAuthenticated) {
    return <Navigate to="/records" replace />;
  }
  
  // Otherwise, show the public page (login)
  return element;
}

export default PublicRoute;
