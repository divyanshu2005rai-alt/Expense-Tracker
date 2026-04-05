import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2 className="text-primary" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>Travel</span> TravelSplit
        </h2>
      </div>
      <div className="nav-links">
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') && !isActive('/dashboard/friends') ? 'active' : ''}`}>Trips</Link>
        <Link to="/dashboard/friends" className={`nav-link ${isActive('/dashboard/friends') ? 'active' : ''}`}>Friends</Link>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
