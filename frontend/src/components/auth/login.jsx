import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../common/toast';
import '../../styles/login.css';
import ahpraLogo from '../../images/alpha.jpg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [windowLights, setWindowLights] = useState([]);
  const [planePosition, setPlanePosition] = useState(-100);
  const [isDayTime, setIsDayTime] = useState(false);
  const navigate = useNavigate();

  // Generate random window light states
  useEffect(() => {
    const generateLights = () => {
      const lights = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        on: Math.random() > 0.3,
        duration: 2 + Math.random() * 3
      }));
      setWindowLights(lights);
    };
    generateLights();
  }, []);

  // Animate airplane across sky every 20 seconds
  useEffect(() => {
    const animatePlane = () => {
      let pos = -100;
      const interval = setInterval(() => {
        pos += 1;
        setPlanePosition(pos);
        if (pos > 100) {
          pos = -100;
          setPlanePosition(pos);
        }
      }, 50);
      return interval;
    };
    const interval = animatePlane();
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!username || !password) {
      setToast({ message: 'Please fill in all fields', type: 'error', isLoading: false });
      // Auto-dismiss validation error after 2 seconds
      setTimeout(() => setToast(null), 2000);
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
    <div className={`login-container ${isDayTime ? 'day-time' : 'night-time'}`}>
      {/* Animated Night Sky Background */}
      <div className="animated-bg">
        {/* Aurora Shimmer */}
        <div className="aurora"></div>

        {/* Twinkling Stars */}
        <div className="stars-container">
          {[...Array(50)].map((_, i) => (
            <div 
              key={`star-${i}`}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                animationDuration: `${1.5 + Math.random() * 2.5}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Moon with Glow - Click to Toggle Day/Night */}
        <div 
          className="moon-container" 
          onClick={() => setIsDayTime(!isDayTime)}
          style={{ cursor: 'pointer' }}
          title="Click to toggle day/night"
        >
          {isDayTime ? (
            <>
              <div className="sun"></div>
              <div className="sun-glow"></div>
            </>
          ) : (
            <>
              <div className="moon"></div>
              <div className="moon-glow"></div>
            </>
          )}
        </div>

        {/* Drifting Clouds */}
        <svg className="clouds-svg" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
            </filter>
          </defs>
          {/* Cloud 1 */}
          <g className="cloud cloud-1" filter="url(#shadow)">
            <ellipse cx="200" cy="80" rx="60" ry="35" fill="rgba(255, 255, 255, 0.8)"/>
            <ellipse cx="240" cy="70" rx="55" ry="38" fill="rgba(255, 255, 255, 0.75)"/>
            <ellipse cx="160" cy="75" rx="45" ry="30" fill="rgba(255, 255, 255, 0.7)"/>
          </g>
          {/* Cloud 2 */}
          <g className="cloud cloud-2" filter="url(#shadow)">
            <ellipse cx="700" cy="120" rx="70" ry="40" fill="rgba(200, 220, 255, 0.7)"/>
            <ellipse cx="750" cy="110" rx="65" ry="42" fill="rgba(200, 220, 255, 0.65)"/>
            <ellipse cx="650" cy="115" rx="50" ry="35" fill="rgba(200, 220, 255, 0.6)"/>
          </g>
        </svg>

        {/* Buildings with Windows */}
        <svg className="buildings-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
          
          {/* BACKGROUND BUILDINGS - Far left */}
          <rect x="0" y="290" width="45" height="210" fill="#050505" opacity="0.6"/>
          <rect x="50" y="320" width="40" height="180" fill="#0a0a0a" opacity="0.6"/>
          
          {/* BACKGROUND BUILDINGS - Far right */}
          <rect x="930" y="300" width="50" height="200" fill="#050505" opacity="0.6"/>
          <rect x="890" y="330" width="45" height="170" fill="#0a0a0a" opacity="0.6"/>
          
          {/* BACKGROUND - Small buildings center-left */}
          <rect x="250" y="370" width="35" height="130" fill="#0d0d0d" opacity="0.5"/>
          <rect x="290" y="385" width="30" height="115" fill="#0a0a0a" opacity="0.5"/>
          
          {/* BACKGROUND - Small buildings center-right */}
          <rect x="680" y="375" width="35" height="125" fill="#0d0d0d" opacity="0.5"/>
          <rect x="720" y="390" width="30" height="110" fill="#0a0a0a" opacity="0.5"/>
          
          {/* ========== LEFT BUILDING ========== */}
          <rect x="80" y="180" width="220" height="320" fill="#0a0a0a" opacity="0.9"/>
          
          {/* Alpha Logo ABOVE Left Building */}
          <g>
            {/* Left support pole - connects logo end to building */}
            <rect x="92" y="170" width="3" height="15" fill="#333" opacity="0.9"/>
            {/* Right support pole - connects logo end to building */}
            <rect x="285" y="170" width="3" height="15" fill="#333" opacity="0.9"/>
            
            {/* Billboard frame above building */}
            <rect x="90" y="120" width="200" height="50" fill="#0f0f0f" stroke="#555" strokeWidth="2" rx="3"/>
            <rect x="95" y="125" width="190" height="40" fill="#1a1a1a" rx="2"/>
            
            {/* Glow effect */}
            <rect x="90" y="120" width="200" height="50" fill="#64b850" opacity="0.1" rx="3" filter="drop-shadow(0 0 10px rgba(100, 184, 80, 0.4))"/>
            
            {/* Logo Image - FULL VISIBLE */}
            <image 
              href={require('../../images/alpha.jpg')}
              x="100" 
              y="128" 
              width="180" 
              height="34"
              preserveAspectRatio="xMidYMid meet"
              opacity="1"
            />
            
            {/* Corner lights */}
            <circle cx="88" cy="125" r="2.5" fill="#ffff00" opacity="0.9"/>
            <circle cx="292" cy="125" r="2.5" fill="#ffff00" opacity="0.9"/>
            <circle cx="88" cy="163" r="2.5" fill="#ffff00" opacity="0.9"/>
            <circle cx="292" cy="163" r="2.5" fill="#ffff00" opacity="0.9"/>
          </g>
          
          {/* Windows left building */}
          {[0, 1, 2, 3, 4].map((row) =>
            [0, 1, 2, 3].map((col) => {
              const isLightOn = windowLights[(row * 4 + col) % 16]?.on;
              const windowColor = isDayTime ? '#1a1a1a' : (isLightOn ? '#ffff00' : '#1a1a1a');
              return (
              <rect
                key={`window-l-${row}-${col}`}
                x={100 + col * 40}
                y={210 + row * 50}
                width="20"
                height="20"
                fill={windowColor}
                className={isDayTime ? '' : 'window'}
                style={{animationDelay: `${(row * 4 + col) * 0.3}s`}}
              />
            );
            })
          )}

          {/* ========== CENTER TOWER ========== */}
          <rect x="350" y="80" width="300" height="420" fill="#0f0f0f" opacity="0.95"/>
          
          {/* Windows center building */}
          {[0, 1, 2, 3, 4, 5, 6].map((row) =>
            [0, 1, 2, 3, 4, 5].map((col) => {
              const isLightOn = windowLights[(row * 6 + col) % 16]?.on;
              const windowColor = isDayTime ? '#0a0a0a' : (isLightOn ? '#ffff00' : '#0a0a0a');
              return (
              <rect
                key={`window-c-${row}-${col}`}
                x={370 + col * 40}
                y={110 + row * 40}
                width="18"
                height="18"
                fill={windowColor}
                className={isDayTime ? '' : 'window'}
                style={{animationDelay: `${(row * 6 + col) * 0.25}s`}}
              />
            );
            })
          )}
          
          {/* Antenna on Tower */}
          <line x1="500" y1="80" x2="500" y2="10" stroke="#333" strokeWidth="3"/>
          <circle cx="500" cy="5" r="8" fill="#ff0000" className="antenna-light"/>

          {/* ========== RIGHT BUILDING ========== */}
          <rect x="760" y="230" width="200" height="270" fill="#0d0d0d" opacity="0.9"/>
          
          {/* Alpha Logo ABOVE Right Building */}
          <g>
            {/* Left support pole - connects logo end to building */}
            <rect x="770" y="220" width="3" height="15" fill="#333" opacity="0.9"/>
            {/* Right support pole - connects logo end to building */}
            <rect x="947" y="220" width="3" height="15" fill="#333" opacity="0.9"/>
            
            {/* Billboard frame above building */}
            <rect x="768" y="170" width="184" height="50" fill="#0f0f0f" stroke="#555" strokeWidth="2" rx="3"/>
            <rect x="773" y="175" width="174" height="40" fill="#1a1a1a" rx="2"/>
            
            {/* Glow effect */}
            <rect x="768" y="170" width="184" height="50" fill="#64b850" opacity="0.1" rx="3" filter="drop-shadow(0 0 10px rgba(100, 184, 80, 0.4))"/>
            
            {/* Logo Image - FULL VISIBLE */}
            <image 
              href={require('../../images/alpha.jpg')}
              x="778" 
              y="178" 
              width="164" 
              height="34"
              preserveAspectRatio="xMidYMid meet"
              opacity="1"
            />
            
            {/* Corner lights */}
            <circle cx="765" cy="175" r="2.5" fill="#ffff00" opacity="0.9"/>
            <circle cx="957" cy="175" r="2.5" fill="#ffff00" opacity="0.9"/>
            <circle cx="765" cy="213" r="2.5" fill="#ffff00" opacity="0.9"/>
            <circle cx="957" cy="213" r="2.5" fill="#ffff00" opacity="0.9"/>
          </g>
          
          {/* Windows right building */}
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3].map((col) => {
              const isLightOn = windowLights[((row * 4 + col) + 10) % 16]?.on;
              const windowColor = isDayTime ? '#0a0a0a' : (isLightOn ? '#ffff00' : '#0a0a0a');
              return (
              <rect
                key={`window-r-${row}-${col}`}
                x={780 + col * 40}
                y={260 + row * 50}
                width="20"
                height="20"
                fill={windowColor}
                className={isDayTime ? '' : 'window'}
                style={{animationDelay: `${((row * 4 + col) + 10) * 0.35}s`}}
              />
            );
            })
          )}
          
          {/* SVG Filters */}
          <defs>
            <linearGradient id="gloss" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0.2}}/>
              <stop offset="50%" style={{stopColor: '#ffffff', stopOpacity: 0}}/>
              <stop offset="100%" style={{stopColor: '#000000', stopOpacity: 0.1}}/>
            </linearGradient>
          </defs>
        </svg>

        {/* Flying Plane */}
        <svg className="airplane" style={{left: `${planePosition}%`}} viewBox="0 0 100 60">
          <g opacity="0.8">
            {/* Fuselage */}
            <ellipse cx="50" cy="30" rx="25" ry="8" fill="#cccccc"/>
            {/* Wings */}
            <rect x="30" y="28" width="40" height="4" fill="#cccccc"/>
            {/* Tail */}
            <polygon points="20,28 20,32 15,30" fill="#cccccc"/>
            {/* Cabin window */}
            <circle cx="50" cy="28" r="3" fill="#1a1a1a"/>
            {/* Blinking red light */}
            <circle cx="15" cy="30" r="3" fill="#ff0000" className="plane-light"/>
          </g>
        </svg>

        {/* Road with Vehicles */}
        <div className="road-container">
          {/* Road Background */}
          <div className="road-background">
            {/* Asphalt Road */}
            <svg className="road-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
              {/* Road Surface */}
              <rect width="100" height="30" fill="#333333"/>
              
              {/* Road Markings */}
              <g className="road-markings">
                <line x1="0" y1="15" x2="100" y2="15" stroke="#ffff99" strokeWidth="0.5" strokeDasharray="5,5"/>
              </g>
              
              {/* Road Edges */}
              <line x1="0" y1="2" x2="100" y2="2" stroke="#666666" strokeWidth="0.3"/>
              <line x1="0" y1="28" x2="100" y2="28" stroke="#666666" strokeWidth="0.3"/>
            </svg>
          </div>
          
          {/* Car - Red (top lane, left to right) */}
          <div className="car vehicle lane-top">
            <svg viewBox="0 0 60 40" className="vehicle-svg">
              {/* Chassis */}
              <rect x="5" y="20" width="50" height="12" rx="2" fill="#e74c3c"/>
              {/* Cabin */}
              <rect x="15" y="12" width="30" height="10" rx="1" fill="#c0392b"/>
              {/* Front Bumper */}
              <rect x="56" y="22" width="3" height="8" fill="#333"/>
              {/* Windows */}
              <rect x="17" y="13" width="10" height="7" fill="#87ceeb" opacity="0.7"/>
              <rect x="35" y="13" width="10" height="7" fill="#87ceeb" opacity="0.7"/>
              {/* Headlight */}
              <circle cx="58" cy="25" r="1.5" fill="#ffff99"/>
              {/* Wheels */}
              <circle cx="12" cy="32" r="4" fill="#1a1a1a"/>
              <circle cx="48" cy="32" r="4" fill="#1a1a1a"/>
              {/* Wheel Rims */}
              <circle cx="12" cy="32" r="2" fill="#555"/>
              <circle cx="48" cy="32" r="2" fill="#555"/>
            </svg>
          </div>
          
          {/* Motorcycle - (bottom lane, right to left) */}
          <div className="motorcycle vehicle lane-bottom">
            <svg viewBox="0 0 60 40" className="vehicle-svg">
              {/* Back Wheel */}
              <circle cx="8" cy="28" r="6" fill="#1a1a1a" stroke="#444" strokeWidth="1"/>
              <circle cx="8" cy="28" r="3" fill="#555"/>
              {/* Back Wheel Spokes */}
              <line x1="8" y1="22" x2="8" y2="34" stroke="#666" strokeWidth="0.5"/>
              <line x1="2" y1="28" x2="14" y2="28" stroke="#666" strokeWidth="0.5"/>
              
              {/* Main Frame - thick line */}
              <line x1="8" y1="28" x2="30" y2="15" stroke="#2c3e50" strokeWidth="2.5"/>
              <line x1="30" y1="15" x2="48" y2="18" stroke="#2c3e50" strokeWidth="2"/>
              
              {/* Engine Block */}
              <rect x="25" y="16" width="10" height="8" fill="#34495e" rx="1"/>
              <line x1="25" y1="20" x2="35" y2="20" stroke="#1a1a1a" strokeWidth="0.5"/>
              
              {/* Seat - bigger and more prominent */}
              <ellipse cx="38" cy="13" rx="8" ry="3" fill="#e74c3c"/>
              <ellipse cx="38" cy="13" rx="8" ry="2.5" fill="#c0392b" opacity="0.7"/>
              
              {/* Fuel Tank */}
              <path d="M 32 13 Q 35 10 38 13 Q 35 16 32 13" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.5"/>
              
              {/* Handlebars - fork and bars */}
              <line x1="48" y1="18" x2="50" y2="8" stroke="#34495e" strokeWidth="1.5"/>
              <line x1="45" y1="8" x2="53" y2="8" stroke="#34495e" strokeWidth="1"/>
              <circle cx="45" cy="8" r="0.8" fill="#555"/>
              <circle cx="53" cy="8" r="0.8" fill="#555"/>
              
              {/* Front Fender/Guard */}
              <path d="M 48 18 Q 52 25 55 32" stroke="#34495e" strokeWidth="1.5" fill="none"/>
              
              {/* Front Wheel */}
              <circle cx="52" cy="30" r="6" fill="#1a1a1a" stroke="#444" strokeWidth="1"/>
              <circle cx="52" cy="30" r="3" fill="#555"/>
              {/* Front Wheel Spokes */}
              <line x1="52" y1="24" x2="52" y2="36" stroke="#666" strokeWidth="0.5"/>
              <line x1="46" y1="30" x2="58" y2="30" stroke="#666" strokeWidth="0.5"/>
              
              {/* Headlight - prominent */}
              <circle cx="54" cy="16" r="2" fill="#ffff99" stroke="#ff9900" strokeWidth="0.5"/>
              <circle cx="54" cy="16" r="1.2" fill="#ffff00" opacity="0.8"/>
              
              {/* Exhaust Pipe */}
              <path d="M 28 22 L 26 30" stroke="#666" strokeWidth="1.2" fill="none"/>
              
              {/* Blinker */}
              <circle cx="56" cy="26" r="1" fill="#ff6600"/>
            </svg>
          </div>

          {/* Additional Car 2 - Blue (bottom lane, right to left) */}
          <div className="car vehicle lane-bottom reverse" style={{animationDelay: '5s', animationFillMode: 'both'}}>
            <svg viewBox="0 0 60 40" className="vehicle-svg">
              {/* Chassis */}
              <rect x="5" y="20" width="50" height="12" rx="2" fill="#3498db"/>
              {/* Cabin */}
              <rect x="15" y="12" width="30" height="10" rx="1" fill="#2980b9"/>
              {/* Front Bumper */}
              <rect x="56" y="22" width="3" height="8" fill="#333"/>
              {/* Windows */}
              <rect x="17" y="13" width="10" height="7" fill="#87ceeb" opacity="0.7"/>
              <rect x="35" y="13" width="10" height="7" fill="#87ceeb" opacity="0.7"/>
              {/* Headlight */}
              <circle cx="58" cy="25" r="1.5" fill="#ffff99"/>
              {/* Wheels */}
              <circle cx="12" cy="32" r="4" fill="#1a1a1a"/>
              <circle cx="48" cy="32" r="4" fill="#1a1a1a"/>
              {/* Wheel Rims */}
              <circle cx="12" cy="32" r="2" fill="#555"/>
              <circle cx="48" cy="32" r="2" fill="#555"/>
            </svg>
          </div>

          {/* Additional Motorcycle 2 - Green (top lane, left to right) */}
          <div className="motorcycle vehicle lane-top reverse" style={{animationDelay: '8s', animationFillMode: 'both'}}>
            <svg viewBox="0 0 60 40" className="vehicle-svg">
              {/* Back Wheel */}
              <circle cx="8" cy="28" r="6" fill="#1a1a1a" stroke="#444" strokeWidth="1"/>
              <circle cx="8" cy="28" r="3" fill="#555"/>
              {/* Back Wheel Spokes */}
              <line x1="8" y1="22" x2="8" y2="34" stroke="#666" strokeWidth="0.5"/>
              <line x1="2" y1="28" x2="14" y2="28" stroke="#666" strokeWidth="0.5"/>
              
              {/* Main Frame - thick line */}
              <line x1="8" y1="28" x2="30" y2="15" stroke="#2c3e50" strokeWidth="2.5"/>
              <line x1="30" y1="15" x2="48" y2="18" stroke="#2c3e50" strokeWidth="2"/>
              
              {/* Engine Block */}
              <rect x="25" y="16" width="10" height="8" fill="#34495e" rx="1"/>
              <line x1="25" y1="20" x2="35" y2="20" stroke="#1a1a1a" strokeWidth="0.5"/>
              
              {/* Seat */}
              <ellipse cx="38" cy="13" rx="8" ry="3" fill="#27ae60"/>
              <ellipse cx="38" cy="13" rx="8" ry="2.5" fill="#229954" opacity="0.7"/>
              
              {/* Fuel Tank */}
              <path d="M 32 13 Q 35 10 38 13 Q 35 16 32 13" fill="#27ae60" stroke="#229954" strokeWidth="0.5"/>
              
              {/* Handlebars */}
              <line x1="48" y1="18" x2="50" y2="8" stroke="#34495e" strokeWidth="1.5"/>
              <line x1="45" y1="8" x2="53" y2="8" stroke="#34495e" strokeWidth="1"/>
              <circle cx="45" cy="8" r="0.8" fill="#555"/>
              <circle cx="53" cy="8" r="0.8" fill="#555"/>
              
              {/* Front Fender/Guard */}
              <path d="M 48 18 Q 52 25 55 32" stroke="#34495e" strokeWidth="1.5" fill="none"/>
              
              {/* Front Wheel */}
              <circle cx="52" cy="30" r="6" fill="#1a1a1a" stroke="#444" strokeWidth="1"/>
              <circle cx="52" cy="30" r="3" fill="#555"/>
              {/* Front Wheel Spokes */}
              <line x1="52" y1="24" x2="52" y2="36" stroke="#666" strokeWidth="0.5"/>
              <line x1="46" y1="30" x2="58" y2="30" stroke="#666" strokeWidth="0.5"/>
              
              {/* Headlight */}
              <circle cx="54" cy="16" r="2" fill="#ffff99" stroke="#ff9900" strokeWidth="0.5"/>
              <circle cx="54" cy="16" r="1.2" fill="#ffff00" opacity="0.8"/>
              
              {/* Exhaust Pipe */}
              <path d="M 28 22 L 26 30" stroke="#666" strokeWidth="1.2" fill="none"/>
              
              {/* Blinker */}
              <circle cx="56" cy="26" r="1" fill="#ff6600"/>
            </svg>
          </div>

          {/* Additional Car 3 - Orange (top lane, left to right) */}
          <div className="car vehicle lane-top" style={{animationDelay: '10s', animationFillMode: 'both'}}>
            <svg viewBox="0 0 60 40" className="vehicle-svg">
              {/* Chassis */}
              <rect x="5" y="20" width="50" height="12" rx="2" fill="#f39c12"/>
              {/* Cabin */}
              <rect x="15" y="12" width="30" height="10" rx="1" fill="#d68910"/>
              {/* Front Bumper */}
              <rect x="56" y="22" width="3" height="8" fill="#333"/>
              {/* Windows */}
              <rect x="17" y="13" width="10" height="7" fill="#87ceeb" opacity="0.7"/>
              <rect x="35" y="13" width="10" height="7" fill="#87ceeb" opacity="0.7"/>
              {/* Headlight */}
              <circle cx="58" cy="25" r="1.5" fill="#ffff99"/>
              {/* Wheels */}
              <circle cx="12" cy="32" r="4" fill="#1a1a1a"/>
              <circle cx="48" cy="32" r="4" fill="#1a1a1a"/>
              {/* Wheel Rims */}
              <circle cx="12" cy="32" r="2" fill="#555"/>
              <circle cx="48" cy="32" r="2" fill="#555"/>
            </svg>
          </div>
        </div>

        {/* Water Ripples at Bottom */}
        <svg className="water-ripples" viewBox="0 0 1000 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#1a4d33', stopOpacity: 0.3}}/>
              <stop offset="100%" style={{stopColor: '#0a2617', stopOpacity: 0.1}}/>
            </linearGradient>
          </defs>
          <rect width="1000" height="100" fill="url(#waterGradient)"/>
          <g className="ripple-group ripple-1">
            <path d="M 0 50 Q 50 45 100 50 T 200 50 T 300 50 T 400 50 T 500 50 T 600 50 T 700 50 T 800 50 T 900 50" 
                  stroke="rgba(100, 180, 150, 0.3)" strokeWidth="1" fill="none"/>
          </g>
          <g className="ripple-group ripple-2">
            <path d="M 0 60 Q 50 55 100 60 T 200 60 T 300 60 T 400 60 T 500 60 T 600 60 T 700 60 T 800 60 T 900 60" 
                  stroke="rgba(100, 180, 150, 0.2)" strokeWidth="1" fill="none"/>
          </g>
        </svg>
      </div>

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
              onChange={(e) => {
                setUsername(e.target.value);
                if (toast?.type === 'error') setToast(null);
              }}
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
              onChange={(e) => {
                setPassword(e.target.value);
                if (toast?.type === 'error') setToast(null);
              }}
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