import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Repository from './components/Repository';
import CreateRepository from './components/CreateRepository';
import ProjectRegistration from './components/ProjectRegistration';
import ProjectDetails from './components/ProjectDetails';
import CommitDetail from './components/CommitDetail';
import Navbar from './components/Navbar';
import { getCurrentUser, logoutUser } from './api/auth';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  // const [githubToken, setGithubToken] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // 새로운 인증 시스템으로 인증 상태 확인
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // setGithubToken(currentUser.githubToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // setGithubToken(userData.githubToken);
    setIsAuthenticated(true);
  };

  const handleSignup = (signupData) => {
    // 회원가입 완료 후 로그인 화면으로 전환
    // 서버에서 이미 사용자 정보가 저장되었으므로 로컬 스토리지에 별도 저장하지 않음
    setShowSignup(false);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    // setGithubToken('');
    setIsAuthenticated(false);
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
                <Dashboard user={user} githubToken={''} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/repository" 
              element={
                isAuthenticated ? 
                <Repository user={user} githubToken={''} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/create-repository" 
              element={
                isAuthenticated ? 
                <CreateRepository user={user} githubToken={''} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/register-project" 
              element={
                isAuthenticated ? 
                <ProjectRegistration user={user} githubToken={''} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/project/:projectId" 
              element={
                isAuthenticated ? 
                <ProjectDetails user={user} githubToken={''} /> : 
                <Navigate to="/login" replace />
              } 
            />
                                <Route 
                      path="/commit/:commitId" 
                      element={
                        isAuthenticated ? 
                        <CommitDetail user={user} githubToken={''} onLogout={handleLogout} /> : 
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
