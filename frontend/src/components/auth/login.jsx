import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../common/toast';
import '../../styles/login.css';
import ahpraLogo from '../../images/alpha.jpg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!username || !password) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setToast({ message: 'Logging in...', type: 'success', isLoading: true });
    
    try {
      // Call backend API
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });


      const data = await response.json();

      if (response.ok) {
        // Success - store user data and navigate
        localStorage.setItem('user', username);
        localStorage.setItem('adminId', data.adminId); // Store admin ID if needed
        
        setToast({ message: 'Login successful!', type: 'success' });
        
        setTimeout(() => {
          setToast(null);
          navigate('/records');
        }, 1500);
      } else {
        // Login failed
        setToast({ 
          message: data.message || 'Invalid username or password', 
          type: 'error' 
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      // Network or server error
      console.error('Login error:', error);
      setToast({ 
        message: 'Connection error. Please try again.', 
        type: 'error' 
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          isLoading={toast.isLoading}
          showProgress={!toast.isLoading}
          onClose={() => setToast(null)} 
          duration={1500}
        />
      )}
      <div className="login-box">
        <div className="logo-container">
          <img src={ahpraLogo} alt="AHPRA Insurance & Surety Company" className="login-logo" />
        </div>
        
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Enter your username"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;