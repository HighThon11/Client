import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-icon">💬</span>
            <span className="brand-text">Code Comment AI</span>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            대시보드
          </Link>
          <Link 
            to="/register-project" 
            className={`nav-link ${isActive('/register-project') ? 'active' : ''}`}
          >
            프로젝트 등록
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <img 
              src={user?.avatar_url || '/default-avatar.png'} 
              alt={user?.name || 'User'} 
              className="user-avatar"
            />
            <span className="user-name">{user?.name || user?.login}</span>
          </div>
          <button onClick={onLogout} className="logout-button">
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 