import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Repository.css';

const Repository = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보와 GitHub 토큰 가져오기
    const userData = localStorage.getItem('user');
    const githubToken = localStorage.getItem('githubToken');

    if (!userData || !githubToken) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      fetchRepositories(githubToken);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchRepositories = async (token) => {
    try {
      setLoading(true);
      
      // GitHub API를 사용하여 사용자의 레포지토리 가져오기
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('GitHub API 요청 실패');
      }

      const repos = await response.json();
      setRepositories(repos);
    } catch (err) {
      setError('레포지토리를 불러오는데 실패했습니다.');
      console.error('Error fetching repositories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    // 선택된 레포지토리를 로컬 스토리지에 저장
    localStorage.setItem('selectedRepository', JSON.stringify(repo));
    // 프로젝트 등록 페이지로 이동
    navigate('/project-registration');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleCreateRepository = () => {
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
          <button onClick={() => window.location.reload()} className="primary-button">
            다시 시도
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
        {repositories.map((repo) => (
          <div 
            key={repo.id} 
            className="repository-card"
            onClick={() => handleRepoSelect(repo)}
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