import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import './toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000, isLoading = false, showProgress = false }) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation
    setTimeout(() => setIsVisible(true), 10);

    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, isLoading]);

  useEffect(() => {
    if (showProgress && duration && !isLoading) {
      setProgress(100); // Start at 100%
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 50); // Update every 50ms for smoother animation

      return () => clearInterval(interval);
    }
  }, [showProgress, duration, isLoading]);

  // Updated colors: white for success, light gray for loading, red for error
  const bgColor = isLoading ? '#f3f4f6' : type === 'success' ? '#ffffff' : '#ef4444';
  const textColor = type === 'error' ? '#ffffff' : '#1f2937'; // Dark text for white/gray backgrounds
  const iconColor = isLoading ? '#6b7280' : type === 'success' ? '#10b981' : '#ffffff';
  
  const icon = isLoading ? (
    <div style={{ animation: 'spin 1s linear infinite' }}>
      <div style={{
        width: '20px',
        height: '20px',
        border: '2px solid #6b7280',
        borderTopColor: 'transparent',
        borderRadius: '50%'
      }}></div>
    </div>
  ) : type === 'success' ? (
    <FaCheckCircle style={{ color: iconColor }} />
  ) : (
    <FaExclamationCircle />
  );

  return (
    <div 
      className={`toast-container ${isVisible ? 'toast-visible' : ''}`} 
      style={{ 
        backgroundColor: bgColor,
        color: textColor,
        border: type === 'error' ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid #e5e7eb'
      }}
    >
      <div className="toast-content">
        <div className="toast-icon">{icon}</div>
        <div className="toast-message">{message}</div>
        {!isLoading && !showProgress && (
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 10);
            }} 
            className="toast-close"
            style={{ color: textColor }}
          >
            <FaTimes />
          </button>
        )}
      </div>
      {(isLoading || showProgress) && (
        <div className="toast-progress-bar">
          <div 
            className={`toast-progress-fill ${isLoading ? 'toast-progress-loading' : ''}`}
            style={{
              ...(!isLoading ? { width: `${progress}%` } : {}),
              backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Toast;