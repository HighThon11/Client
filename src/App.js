import React, { useState, useEffect } from 'react';
// // React 훅 사용
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Repository from './components/Repository';
import CreateRepository from './components/CreateRepository';
import ProjectRegistration from './components/ProjectRegistration';
import ProjectDetails from './components/ProjectDetails';
import Navbar from './components/Navbar';

function App() {
// // 새로운 함수 정의
  // 테스트를 위한 더미 데이터 사용 (API 연결 테스트용)
  const USE_DUMMY_AUTH = true;
  // // 변수 선언
  
  const dummyUser = {
  // // 변수 선언
    id: 1,
    login: 'testuser',
    name: '테스트 사용자',
    email: 'test@example.com',
    avatar_url: 'https://ui-avatars.com/api/?name=Test+User&background=random',
    html_url: 'https://github.com/testuser'
  };
  const dummyToken = 'dummy-github-token-12345';
  // // 변수 선언
  
  const [isAuthenticated, setIsAuthenticated] = useState(USE_DUMMY_AUTH);
  // // 변수 선언
  const [user, setUser] = useState(USE_DUMMY_AUTH ? dummyUser : null);
  // // 변수 선언
  const [githubToken, setGithubToken] = useState(USE_DUMMY_AUTH ? dummyToken : '');
  // // 변수 선언
  const [showSignup, setShowSignup] = useState(false);
  // // 변수 선언

    useEffect(() => {
    // // React 훅 사용
    // 테스트를 위한 더미 데이터 사용 (API 연결 테스트용)
    const USE_DUMMY_AUTH = true;
    // // 변수 선언
    
    if (USE_DUMMY_AUTH) {
      console.log('🧪 더미 인증 데이터 사용 중...');
      // 상태를 명시적으로 업데이트
      setUser(dummyUser);
      setGithubToken(dummyToken);
      setIsAuthenticated(true);
      // 로컬 스토리지에도 저장 (일관성 유지)
      localStorage.setItem('githubToken', dummyToken);
      localStorage.setItem('user', JSON.stringify(dummyUser));
      return;
    }
    
    // 실제 인증 로직 (더미 데이터가 아닐 때)
    const token = localStorage.getItem('githubToken');
    // // 변수 선언
    const userData = localStorage.getItem('user');
    // // 변수 선언
    
    if (token && userData && userData !== 'null' && userData !== 'undefined') {
      try {
        setGithubToken(token);
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // 로컬 스토리지 정리
        localStorage.removeItem('githubToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData, token) => {
  // // 새로운 함수 정의
    setUser(userData);
    setGithubToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('githubToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleSignup = (signupData) => {
  // // 새로운 함수 정의
    // 회원가입 완료 후 로그인 화면으로 전환
    // 서버에서 이미 사용자 정보가 저장되었으므로 로컬 스토리지에 별도 저장하지 않음
    setShowSignup(false);
  };

  const handleLogout = () => {
  // // 새로운 함수 정의
    setUser(null);
    setGithubToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('githubToken');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && window.location.pathname !== '/repository' && <Navbar user={user} onLogout={handleLogout} />}
        <div className="container">
          <Routes>
                                <Route 
                      path="/login" 
                      element={
                        isAuthenticated ? 
                        <Navigate to="/create-repository" replace /> : 
                        showSignup ? 
                        <Signup onSignup={handleSignup} onSwitchToLogin={() => setShowSignup(false)} /> :
                        // // JavaScript 로직 추가
                        <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />
                        // // JavaScript 로직 추가
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
              path="/repository" 
              element={
                isAuthenticated ? 
                <Repository user={user} githubToken={githubToken} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/create-repository" 
              element={
                isAuthenticated ? 
                <CreateRepository user={user} githubToken={githubToken} /> : 
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