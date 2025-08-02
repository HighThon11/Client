import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProjectRegistration from './components/ProjectRegistration';
import ProjectDetails from './components/ProjectDetails';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [githubToken, setGithubToken] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const token = localStorage.getItem('githubToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setGithubToken(token);
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    setGithubToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('githubToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleSignup = (signupData) => {
    // 사용자 정보를 Local Storage에 저장
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(signupData);
    localStorage.setItem('users', JSON.stringify(users));
    
    // 회원가입 완료 후 로그인 화면으로 전환
    setShowSignup(false);
  };

  const handleLogout = () => {
    setUser(null);
    setGithubToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('githubToken');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        <div className="container">
          <Routes>
                                <Route 
                      path="/login" 
                      element={
                        isAuthenticated ? 
                        <Navigate to="/dashboard" replace /> : 
                        showSignup ? 
                        <Signup onSignup={handleSignup} onSwitchToLogin={() => setShowSignup(false)} /> :
                        <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />
                      } 
                    />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? 
                <Dashboard user={user} githubToken={githubToken} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/register-project" 
              element={
                isAuthenticated ? 
                <ProjectRegistration user={user} githubToken={githubToken} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/project/:projectId" 
              element={
                isAuthenticated ? 
                <ProjectDetails user={user} githubToken={githubToken} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
