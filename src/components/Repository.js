import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Repository.css';

const Repository = ({ user, githubToken }) => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log('Missing user props:', { user: !!user });
      navigate('/login');
      return;
    }

    fetchMockRepositories();
  }, [navigate]);

  const fetchMockRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching mock repositories');
      
      // 모의 레포지토리 데이터
      const mockRepos = [
        {
          id: 1,
          name: 'sample-project-1',
          full_name: `${user.email}/sample-project-1`,
          description: '샘플 프로젝트 1 - 설명',
          private: false,
          html_url: 'https://github.com/sample/project1',
          updated_at: '2024-01-15T10:30:00Z',
          language: 'JavaScript',
          stargazers_count: 15,
          forks_count: 3,
          open_issues_count: 2
        },
        {
          id: 2,
          name: 'sample-project-2',
          full_name: `${user.email}/sample-project-2`,
          description: '샘플 프로젝트 2 - 설명',
          private: true,
          html_url: 'https://github.com/sample/project2',
          updated_at: '2024-01-14T15:45:00Z',
          language: 'TypeScript',
          stargazers_count: 8,
          forks_count: 1,
          open_issues_count: 0
        },
        {
          id: 3,
          name: 'code-comment-ai',
          full_name: `${user.email}/code-comment-ai`,
          description: 'AI 기반 코드 주석 생성 프로젝트 - 설명',
          private: false,
          html_url: 'https://github.com/sample/code-comment-ai',
          updated_at: '2024-01-13T09:20:00Z',
          language: 'React',
          stargazers_count: 25,
          forks_count: 5,
          open_issues_count: 3
        },
        {
          id: 4,
          name: 'api-service',
          full_name: `${user.email}/api-service`,
          description: '백엔드 API 서비스 - 설명',
          private: false,
          html_url: 'https://github.com/sample/api-service',
          updated_at: '2024-01-12T14:10:00Z',
          language: 'Java',
          stargazers_count: 12,
          forks_count: 2,
          open_issues_count: 1
        }
      ];

      console.log('Fetched mock repositories:', mockRepos.length);
      setRepositories(mockRepos);
      if (mockRepos.length > 0) {
        setSelectedRepo(mockRepos[0]);
      }
    } catch (err) {
      console.error('Error fetching mock repositories:', err);
      setError(`레포지토리를 불러오는데 실패했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
  };

  const handleRepoRegister = (repo) => {
    localStorage.setItem('selectedRepository', JSON.stringify(repo));
    navigate('/register-project');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleCreateRepository = () => {
    navigate('/create-repository');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '1d ago';
    } else if (diffDays < 30) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
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
            setError(null);
            fetchMockRepositories();
          }}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="repository-container">
      {/* 헤더 */}
      <div className="repository-header">
        <div className="header-left">
          <button onClick={handleBackToDashboard} className="back-button">
            ← 대시보드로 돌아가기
          </button>
        </div>
        <div className="header-center">
          <h1>GitHub 레포지토리</h1>
          <p>코드 변경사항을 추적할 레포지토리를 선택해주세요.</p>
        </div>
        <div className="header-right">
          <button onClick={handleCreateRepository} className="create-button">
            + 새 레포지토리
          </button>
        </div>
      </div>

      <div className="repository-content">
        {/* 왼쪽 사이드바 */}
        <div className="repository-sidebar">
          <div className="sidebar-header">
            <h2>YO ㅋㄷ</h2>
          </div>
          
          <div className="project-info">
            <h3>프로젝트명 01</h3>
            <p>프로젝트 디스크립션 - 설명</p>
            <div className="language-info">
              <span className="language-dot"></span>
              <span>javascript</span>
            </div>
          </div>

          <div className="repository-list">
            <h4>레포지토리 목록</h4>
            {repositories.map((repo) => (
              <div 
                key={repo.id} 
                className={`repository-item ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                onClick={() => handleRepoSelect(repo)}
              >
                <div className="repo-name">{repo.name}</div>
                <div className="repo-date">{formatDate(repo.updated_at)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="repository-main">
          {selectedRepo ? (
            <div className="repo-detail">
              <div className="repo-header">
                <h2>{selectedRepo.name}</h2>
                <div className="repo-meta">
                  <span className="repo-url">GitHub - {selectedRepo.full_name}</span>
                </div>
              </div>

              <div className="repo-stats">
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <div className="stat-label">마지막 업데이트</div>
                    <div className="stat-value">{new Date(selectedRepo.updated_at).toLocaleDateString('ko-KR')}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📁</div>
                  <div className="stat-content">
                    <div className="stat-label">프로젝트 타입</div>
                    <div className="stat-value">{selectedRepo.private ? 'Private' : 'Public'}</div>
                  </div>
                </div>
              </div>

              <div className="repo-description">
                <h3>프로젝트 설명</h3>
                <p>{selectedRepo.description || '설명이 없습니다.'}</p>
              </div>

              <div className="repo-stats-detail">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{selectedRepo.stargazers_count}</div>
                    <div className="stat-label">Stars</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{selectedRepo.forks_count}</div>
                    <div className="stat-label">Forks</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{selectedRepo.open_issues_count}</div>
                    <div className="stat-label">Issues</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{selectedRepo.language}</div>
                    <div className="stat-label">Language</div>
                  </div>
                </div>
              </div>

              <div className="repo-actions">
                <button 
                  className="register-button"
                  onClick={() => handleRepoRegister(selectedRepo)}
                >
                  이 레포지토리로 프로젝트 등록하기
                </button>
                <a 
                  href={selectedRepo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-github-button"
                >
                  GitHub에서 보기
                </a>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <h3>레포지토리를 선택해주세요</h3>
              <p>왼쪽 사이드바에서 레포지토리를 선택하면 상세 정보를 확인할 수 있습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Repository; 