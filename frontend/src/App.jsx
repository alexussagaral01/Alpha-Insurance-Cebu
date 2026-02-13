import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/login';
import Records from './components/dashboard/records';
import MenuGuard from './components/MenuGuard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import './styles/index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute element={<Login />} />} />
        <Route path="/records" element={<ProtectedRoute element={<Records />} />} />
        <Route path="/menu" element={<ProtectedRoute element={<MenuGuard />} />} />
      </Routes>
    </Router>
  );
}

export default App;
