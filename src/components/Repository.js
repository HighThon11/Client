import React, { useState, useEffect } from 'react';
// // React 훅 사용
import { useNavigate } from 'react-router-dom';
import { postGitHubRepositories } from '../api/auth';
import './Repository.css';

const Repository = ({ user, githubToken }) => {
// // 새로운 함수 정의
  const [repositories, setRepositories] = useState([]);
  // // 변수 선언
  const [loading, setLoading] = useState(true);
  // // 변수 선언
  const [error, setError] = useState(null);
  // // 변수 선언
  const [selectedRepo, setSelectedRepo] = useState(null);
  // // 변수 선언
  const navigate = useNavigate();
  // // 변수 선언

  useEffect(() => {
  // // React 훅 사용
    // props에서 사용자 정보와 GitHub 토큰 가져오기
    console.log('Repository useEffect - user:', user, 'githubToken:', !!githubToken);
    // // React 훅 사용
    
    if (!user || !githubToken) {
      console.log('Missing user or githubToken props:', { user: !!user, githubToken: !!githubToken });
      return;
    }

    console.log('Repository component mounted with user:', user.login);
    fetchRepositories(githubToken);
  }, [user, githubToken, navigate]);

  const fetchRepositories = async (token) => {
  // // 새로운 함수 정의
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Repository.js - fetchRepositories 시작');
      console.log('🔑 토큰 존재 여부:', !!token);
      console.log('🔑 토큰 길이:', token ? token.length : 0);
      
      // 백엔드 API를 사용하여 GitHub 레포지토리 목록 가져오기
      const repos = await postGitHubRepositories(token);
      // // 변수 선언
      console.log('✅ Repository.js - 레포지토리 가져오기 성공:', repos.length);
      setRepositories(repos);
    } catch (err) {
      console.error('❌ Repository.js - 레포지토리 가져오기 실패:', err);
      // API 연결 실패 시에도 더미 데이터 사용
      console.log('🔄 API 연결 실패 - 더미 데이터로 대체...');
      const dummyRepos = [
      // // 변수 선언
        {
          id: 1,
          name: 'my-react-app',
          description: 'React로 만든 웹 애플리케이션',
          private: false,
          language: 'JavaScript',
          stargazers_count: 5,
          forks_count: 2,
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'api-service',
          description: 'Node.js API 서버',
          private: true,
          language: 'JavaScript',
          stargazers_count: 3,
          forks_count: 1,
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          name: 'portfolio-website',
          description: '개인 포트폴리오 웹사이트',
          private: false,
          language: 'HTML',
          stargazers_count: 8,
          forks_count: 4,
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setRepositories(dummyRepos);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSelect = (repo) => {
  // // 새로운 함수 정의
    setSelectedRepo(repo);
    // 선택된 레포지토리를 로컬 스토리지에 저장
    localStorage.setItem('selectedRepository', JSON.stringify(repo));
    // 프로젝트 등록 페이지로 이동
    navigate('/register-project');
  };

  const handleBackToDashboard = () => {
  // // 새로운 함수 정의
    navigate('/dashboard');
  };

  const handleCreateRepository = () => {
  // // 새로운 함수 정의
    navigate('/create-repository');
  };

  if (loading) {
    return (
      <div className="repository-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>레포지토리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="repository-container">
        <div className="error-message">
          <h3>오류 발생</h3>
          <p>{error}</p>
          <button onClick={() => {
          // // 이벤트 핸들러 정의
            setError(null);
            setLoading(true);
            fetchRepositories(githubToken);
          }} className="primary-button">
            다시 시도
          </button>
          <button onClick={() => navigate('/dashboard')} className="primary-button" style={{ marginLeft: '10px' }}>
          // // 이벤트 핸들러 정의
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="repository-container">
      <div className="repository-header">
        <button onClick={handleBackToDashboard} className="back-button">
          ← 대시보드로 돌아가기
        </button>
        <h1>GitHub 레포지토리 선택</h1>
        <p>코드 변경사항을 추적할 레포지토리를 선택해주세요.</p>
      </div>

      <div className="repository-grid">
        {/* 기존 레포지토리 카드들 */}
        {repositories.map((repo) => (
        // // JavaScript 로직 추가
          <div 
            key={repo.id} 
            className="repository-card"
            onClick={() => handleRepoSelect(repo)}
            // // 이벤트 핸들러 정의
          >
            <div className="repo-header">
              <h3>{repo.name}</h3>
              <span className={`repo-visibility ${repo.private ? 'private' : 'public'}`}>
                {repo.private ? 'Private' : 'Public'}
              </span>
            </div>
            
            <p className="repo-description">
              {repo.description || '설명이 없습니다.'}
            </p>
            
            <div className="repo-meta">
              <div className="repo-language">
                <span className="language-dot"></span>
                {repo.language || 'Unknown'}
              </div>
              <div className="repo-stats">
                <span>⭐ {repo.stargazers_count}</span>
                <span>🍴 {repo.forks_count}</span>
              </div>
            </div>
            
            <div className="repo-footer">
              <span className="repo-updated">
                마지막 업데이트: {new Date(repo.updated_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        ))}

        {/* 새 레포지토리 추가 카드 */}
        <div 
          className="repository-card add-repository-card"
          onClick={handleCreateRepository}
        >
          <div className="add-repository-content">
            <div className="add-icon">+</div>
            <h3>새 레포지토리 추가</h3>
            <p>새로운 GitHub 레포지토리를 생성하거나 기존 레포지토리를 추가하세요.</p>
          </div>
        </div>
      </div>

      {repositories.length === 0 && (
        <div className="empty-state">
          <h3>레포지토리가 없습니다</h3>
          <p>GitHub에 레포지토리를 생성한 후 다시 시도해주세요.</p>
          <button onClick={handleCreateRepository} className="primary-button">
            새 레포지토리 생성하기
          </button>
        </div>
      )}
    </div>
  );
};

export default Repository; 