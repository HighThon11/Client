import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Repository.css';

const Repository = ({ user, githubToken }) => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState(null);
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
      
      // 모의 레포지토리 데이터 - 이미지에 맞게 수정
      const mockRepos = [
        {
          id: 1,
          name: 'Commit c385316',
          full_name: 'username/Commit c385316',
          description: '프로젝트 디스크립션 - 설명',
          private: false,
          html_url: 'https://github.com/username/Commit c385316',
          updated_at: '2024-01-15T10:30:00Z',
          language: 'JavaScript',
          stargazers_count: 15,
          forks_count: 3,
          open_issues_count: 2,
          commits: [
            { 
              id: 'c385319',
              message: 'refactor: mbti조방식 변경', 
              date: '10d ago', 
              files: 2, 
              additions: 7, 
              deletions: 6,
              author: 'username',
              committer: 'username'
            },
            { 
              id: 'c385318',
              message: 'feat: 새로운 기능 추가', 
              date: '42d ago', 
              files: 3, 
              additions: 12, 
              deletions: 3,
              author: 'username',
              committer: 'username'
            },
            { 
              id: 'c385317',
              message: 'fix: 버그 수정', 
              date: '45d ago', 
              files: 1, 
              additions: 2, 
              deletions: 1,
              author: 'username',
              committer: 'username'
            },
            { 
              id: 'c385316',
              message: 'docs: 문서 업데이트', 
              date: '50d ago', 
              files: 2, 
              additions: 5, 
              deletions: 0,
              author: 'username',
              committer: 'username'
            }
          ]
        }
      ];

      console.log('Fetched mock repositories:', mockRepos.length);
      setRepositories(mockRepos);
      if (mockRepos.length > 0) {
        setSelectedRepo(mockRepos[0]);
        setSelectedCommit(mockRepos[0].commits[0]);
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
    setSelectedCommit(repo.commits[0]);
  };

  const handleCommitSelect = (commit) => {
    setSelectedCommit(commit);
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

          <div className="commit-list">
            <h4>커밋 목록</h4>
            {selectedRepo?.commits.map((commit) => (
              <div 
                key={commit.id} 
                className={`commit-item ${selectedCommit?.id === commit.id ? 'selected' : ''}`}
                onClick={() => handleCommitSelect(commit)}
              >
                <div className="commit-name">Commit {commit.id}</div>
                <div className="commit-date">{commit.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="repository-main">
          {selectedRepo && selectedCommit ? (
            <div className="commit-detail">
              <div className="commit-header">
                <h2>Commit {selectedCommit.id}</h2>
                <div className="commit-meta">
                  <span className="commit-url">GitHub - {selectedRepo.full_name}</span>
                </div>
              </div>

              <div className="commit-stats">
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <div className="stat-label">마지막 커밋</div>
                    <div className="stat-value">2025-08-02</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📁</div>
                  <div className="stat-content">
                    <div className="stat-label">추적 파일 수</div>
                    <div className="stat-value">123</div>
                  </div>
                </div>
              </div>

              <div className="commit-message">
                <h3>커밋 메시지</h3>
                <p>{selectedCommit.message}</p>
                <p>P deploy (#15)</p>
              </div>

              <div className="file-changes">
                <div className="changes-summary">
                  <span>{selectedCommit.files} files changed +{selectedCommit.additions} -{selectedCommit.deletions} lines changed</span>
                </div>

                <div className="file-browser">
                  <div className="file-browser-left">
                    <div className="search-bar">
                      <input type="text" placeholder="Q Filter files..." />
                    </div>
                    <div className="file-tree">
                      <div className="folder-item">
                        <span className="folder-icon">📁</span>
                        <span>src/main/java/com/tina/tina...</span>
                      </div>
                      <div className="folder-item">
                        <span className="folder-icon">📁</span>
                        <span>domain/repository</span>
                      </div>
                      <div className="file-item">
                        <span className="file-icon">📄</span>
                        <span>MbtiCompatibilityReposit..</span>
                      </div>
                      <div className="folder-item">
                        <span className="folder-icon">📁</span>
                        <span>service/implementation</span>
                      </div>
                      <div className="file-item">
                        <span className="file-icon">📄</span>
                        <span>MbtiReader.java</span>
                      </div>
                    </div>
                  </div>

                  <div className="code-viewer">
                    <div className="search-bar">
                      <input type="text" placeholder="Q Search within code" />
                    </div>
                    <div className="code-diff">
                      <div className="file-header">
                        <span>src/main/java/com/tina/tina_server/domain/mbti/domain/repository/MbtiCompatibilityRepository.java</span>
                      </div>
                      <div className="diff-header">
                        <span>@@ -5,5 +5,8 @@</span>
                      </div>
                      <div className="diff-content">
                        <div className="diff-line unchanged">
                          <span className="line-number">5</span>
                          <span className="line-content">package com.tina.tina_server.domain.mbti.domain.repository;</span>
                        </div>
                        <div className="diff-line unchanged">
                          <span className="line-number">6</span>
                          <span className="line-content"></span>
                        </div>
                        <div className="diff-line unchanged">
                          <span className="line-number">7</span>
                          <span className="line-content">import org.springframework.data.jpa.repository.JpaRepository;</span>
                        </div>
                        <div className="diff-line removed">
                          <span className="line-number">8</span>
                          <span className="line-content">- public interface MbtiCompatibilityRepository extends JpaRepository&lt;MbtiCompatibility, Long&gt; {'{'}</span>
                        </div>
                        <div className="diff-line added">
                          <span className="line-number">8</span>
                          <span className="line-content">+ public interface MbtiCompatibilityRepository extends JpaRepository&lt;MbtiCompatibility, Long&gt;, MbtiCompatibilityRepositoryCustom {'{'}</span>
                        </div>
                        <div className="diff-line added">
                          <span className="line-number">9</span>
                          <span className="line-content">+     // 기본 조회 메서드</span>
                        </div>
                        <div className="diff-line added">
                          <span className="line-number">10</span>
                          <span className="line-content">+     List&lt;MbtiCompatibility&gt; findByMbtiType(String mbtiType);</span>
                        </div>
                        <div className="diff-line added">
                          <span className="line-number">11</span>
                          <span className="line-content">+ </span>
                        </div>
                      </div>

                      <div className="file-separator"></div>

                      <div className="file-header">
                        <span>src/main/java/com/tina/tina_server/domain/mbti/service/implementation/MbtiReader.java</span>
                      </div>
                      <div className="diff-header">
                        <span>@@ -13,11 +13,9 @@</span>
                      </div>
                      <div className="diff-content">
                        <div className="diff-line removed">
                          <span className="line-number">13</span>
                          <span className="line-content">-     private final MbtiCompatibilityRepository mbtiCompatibilityRepository;</span>
                        </div>
                        <div className="diff-line added">
                          <span className="line-number">13</span>
                          <span className="line-content">+     private final MbtiCompatibilityRepository mbtiCompatibilityRepository;</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="commit-actions">
                <button className="apply-comment-button">
                  주석 적용해서 커밋 후 푸시하기
                </button>
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