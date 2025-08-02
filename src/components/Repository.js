import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGitHubRepositories } from '../api/auth';
import CreateRepositoryModal from './CreateRepositoryModal'; // 추가: 모달 컴포넌트 import
import './Repository.css';

const Repository = ({ user, githubToken }) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 추가: 모달 상태
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !githubToken) {
      console.log('Missing user or githubToken props:', { user: !!user, githubToken: !!githubToken });
      return;
    }
    console.log('Repository component mounted with user:', user.login);
    fetchRepositories(githubToken);
  }, [user, githubToken, navigate]);

  const fetchRepositories = async (token) => {
    // ... 기존 코드와 동일 ...
    try {
      setLoading(true);
      setError(null);
      const repos = await getGitHubRepositories(token);
      setRepositories(repos);
    } catch (err) {
      console.error('❌ Repository.js - 레포지토리 가져오기 실패:', err);
      const dummyRepos = [
        { id: 1, name: 'my-react-app', description: 'React로 만든 웹 애플리케이션', private: false, language: 'JavaScript', stargazers_count: 5, forks_count: 2, updated_at: new Date().toISOString() },
        { id: 2, name: 'api-service', description: 'Node.js API 서버', private: true, language: 'JavaScript', stargazers_count: 3, forks_count: 1, updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        { id: 3, name: 'portfolio-website', description: '개인 포트폴리오 웹사이트', private: false, language: 'HTML', stargazers_count: 8, forks_count: 4, updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
      ];
      setRepositories(dummyRepos);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    localStorage.setItem('selectedRepository', JSON.stringify(repo));
    navigate('/register-project');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // 변경: 페이지 이동 대신 모달을 여는 기능으로 수정
  const handleCreateRepository = () => {
    setIsModalOpen(true);
  };

  // 추가: 모달을 닫는 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="repository-container"><div className="loading-spinner"><div className="spinner"></div><p>레포지토리를 불러오는 중...</p></div></div>;
  }

  if (error) {
    return <div className="repository-container"><div className="error-message"><h3>오류 발생</h3><p>{error}</p></div></div>;
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
          <div key={repo.id} className="repository-card" onClick={() => handleRepoSelect(repo)}>
            <div className="repo-header">
              <h3>{repo.name}</h3>
              <span className={`repo-visibility ${repo.private ? 'private' : 'public'}`}>{repo.private ? 'Private' : 'Public'}</span>
            </div>
            <p className="repo-description">{repo.description || '설명이 없습니다.'}</p>
            <div className="repo-meta">
              <div className="repo-language"><span className="language-dot"></span>{repo.language || 'Unknown'}</div>
              <div className="repo-stats"><span>⭐ {repo.stargazers_count}</span><span>🍴 {repo.forks_count}</span></div>
            </div>
            <div className="repo-footer"><span className="repo-updated">마지막 업데이트: {new Date(repo.updated_at).toLocaleDateString('ko-KR')}</span></div>
          </div>
        ))}

        <div className="repository-card add-repository-card" onClick={handleCreateRepository}>
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

      {/* 추가: isModalOpen이 true일 때 모달 렌더링 */}
      {isModalOpen && (
        <CreateRepositoryModal 
          user={user}
          githubToken={githubToken}
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default Repository;
