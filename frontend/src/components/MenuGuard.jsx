import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Menu from './menu/menu';

function MenuGuard() {
  const canAccessMenu = sessionStorage.getItem('menuAccessGranted');

  // If no access flag and user didn't just set it, redirect
  if (!canAccessMenu) {
    return <Navigate to="/records" replace />;
  }

  return <Menu />;
}

export default MenuGuard;
