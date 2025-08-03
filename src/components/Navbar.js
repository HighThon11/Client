import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/repository" className="brand-link">
            <svg
              className="logo"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="logo-path"
                d="M92.48,42.3v32.26h-2.57v2.78h-2.48v2.52h-2.57v2.44h-2.48v2.43h-2.66v2.87h-33.95v-2.87h-2.57v-2.43h-2.48v-2.44h-2.57v-2.52h-2.48v-2.78h-2.57v-32.26h2.57v-2.7h2.48v-2.61h2.57v-2.35h2.48v-2.43h2.57v-2.44h33.95v2.44h2.66v2.43h2.48v2.35h2.57v2.61h2.48v2.7h2.57ZM75.68,49.17h-1.93v-1.91h-1.74v-1.91h-18.17v1.91h-1.83v1.91h-2.11v19.22h2.11v1.74h1.83v1.91h18.17v-1.91h1.74v-1.74h1.93v-19.22Z"
              />
              <path
                className="logo-path"
                d="M147.44,55.26v2.52h2.75v2.52h2.75v2.61h2.84v2.52h2.75v2.52h2.75v2.61h2.75v2.43h2.84v9.83h-2.84v2.26h-2.75v2.52h-6.42v-2.52h-2.84v-2.52h-2.75v-2.61h-2.75v-2.52h-2.84v-2.52h-2.75v-2.61h-2.75v-2.52h-3.85v2.52h-2.84v2.61h-2.75v2.52h-2.75v2.52h-2.84v2.61h-2.75v2.52h-2.75v2.52h-6.52v-2.52h-2.75v-2.26h-2.75v-9.83h2.75v-2.43h2.75v-2.61h2.84v-2.52h2.75v-2.52h2.75v-2.61h2.75v-2.52h2.84v-2.52h2.02v-9.74h-17.53v-2.87h-3.03v-9.74h3.03v-2.87h53.41v2.87h3.03v9.74h-3.03v2.87h-17.44v9.74h1.93Z"
              />
              <path
                className="logo-path"
                d="M36.13,152.57v-2.87h-3.03v-9.83h3.03v-2.87h36.89v-7.91h-36.89v-2.87h-3.03v-9.83h3.03v-2.87h52.12v2.87h3.03v50.96h-3.03v2.87h-12.21v-2.87h-3.03v-14.78h-36.89Z"
              />
              <path
                className="logo-path"
                d="M162.58,116.22h3.03v9.83h-3.03v2.87h-37.81v25.74h37.81v2.87h3.03v9.83h-3.03v2.87h-52.12v-2.87h-3.03v-51.13h3.03v-2.87h52.12v2.87Z"
              />
            </svg>
          </Link>
        </div>
        <div className="navbar-right">
          <Link to="/register-project" className="nav-link">
            프로젝트
          </Link>
          <div className="user-info">
            <img
              src={user?.avatar_url || "/default-avatar.png"}
              alt="User avatar"
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
