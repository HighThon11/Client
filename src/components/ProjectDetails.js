import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetails.css';

const ProjectDetails = ({ user, githubToken }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [changes, setChanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 로컬 스토리지에서 프로젝트 정보 가져오기
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const foundProject = projects.find(p => p.id === projectId);
      
      if (!foundProject) {
        setError('프로젝트를 찾을 수 없습니다.');
        return;
      }

      setProject(foundProject);

      // 변경사항 히스토리 시뮬레이션 (실제로는 백엔드에서 가져올 데이터)
      const mockChanges = [
        {
          id: 1,
          commitHash: 'a1b2c3d4',
          fileName: 'src/components/Login.js',
          changeType: 'modified',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          author: user?.name || user?.login,
          comment: '이 부분에서 null 체크가 추가되었습니다. NPE 방지를 위한 조치로 보입니다.',
          diff: '+ if (user && user.name) {\\n+   console.log(user.name);\\n+ }',
          status: 'reviewed'
        },
        {
          id: 2,
          commitHash: 'e5f6g7h8',
          fileName: 'src/utils/api.js',
          changeType: 'added',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          author: user?.name || user?.login,
          comment: '새로운 API 엔드포인트가 추가되었습니다. 사용자 인증을 위한 토큰 검증 로직입니다.',
          diff: '+ export const validateToken = async (token) => {\\n+   try {\\n+     const response = await fetch(\'/api/validate\', {\\n+       headers: { Authorization: `Bearer ${token}` }\\n+     });\\n+     return response.ok;\\n+   } catch (error) {\\n+     return false;\\n+   }\\n+ };',
          status: 'pending'
        },
        {
          id: 3,
          commitHash: 'i9j0k1l2',
          fileName: 'src/App.js',
          changeType: 'deleted',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          author: user?.name || user?.login,
          comment: '사용하지 않는 import 문이 제거되었습니다. 코드 정리를 위한 리팩토링입니다.',
          diff: '- import unusedComponent from \'./components/UnusedComponent\';\\n- import { unusedUtil } from \'./utils/unused\'',
          status: 'reviewed'
        }
      ];

      setChanges(mockChanges);
    } catch (error) {
      console.error('Project details load error:', error);
      setError('프로젝트 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeTypeIcon = (type) => {
    switch (type) {
      case 'added':
        return '➕';
      case 'modified':
        return '✏️';
      case 'deleted':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending">검토 대기</span>;
      case 'reviewed':
        return <span className="status-badge reviewed">검토 완료</span>;
      case 'approved':
        return <span className="status-badge approved">승인됨</span>;
      default:
        return <span className="status-badge unknown">알 수 없음</span>;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteProject = () => {
    if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      const updatedProjects = projects.filter(p => p.id !== projectId);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="project-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>프로젝트 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-details-container">
        <div className="error-message">
          {error || '프로젝트를 찾을 수 없습니다.'}
        </div>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="project-details-container">
      {/* 프로젝트 헤더 */}
      <div className="project-header">
        <div className="project-info">
          <h1>{project.name}</h1>
          <p>{project.description || '설명 없음'}</p>
          <div className="project-meta">
            <span className="project-status active">활성</span>
            <span className="project-created">
              생성일: {new Date(project.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>
        <div className="project-actions">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← 대시보드
          </button>
          <button onClick={handleDeleteProject} className="delete-button">
            프로젝트 삭제
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 개요
        </button>
        <button
          className={`tab-button ${activeTab === 'changes' ? 'active' : ''}`}
          onClick={() => setActiveTab('changes')}
        >
          🔄 변경사항
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ 설정
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📁 리포지토리 정보</h3>
                <div className="repo-details">
                  {project.repository?.fullName ? (
                    <>
                      <p><strong>이름:</strong> {project.repository.fullName}</p>
                      <p><strong>소유자:</strong> {project.repository.owner}</p>
                      <p><strong>URL:</strong> 
                        <a href={project.repository.url} target="_blank" rel="noopener noreferrer">
                          {project.repository.url}
                        </a>
                      </p>
                    </>
                  ) : (
                    <p><strong>URL:</strong> {project.repository?.url}</p>
                  )}
                </div>
              </div>

              <div className="overview-card">
                <h3>⚙️ 모니터링 설정</h3>
                <div className="settings-details">
                  <p><strong>브랜치:</strong> {project.settings.branch}</p>
                  <p><strong>감시 경로:</strong> 
                    {project.settings.watchPaths.length > 0 
                      ? project.settings.watchPaths.join(', ') 
                      : '전체 프로젝트'
                    }
                  </p>
                  <p><strong>웹훅:</strong> {project.settings.webhookEnabled ? '활성화' : '비활성화'}</p>
                  <p><strong>자동 주석:</strong> {project.settings.autoComment ? '활성화' : '비활성화'}</p>
                </div>
              </div>

              <div className="overview-card">
                <h3>📊 통계</h3>
                <div className="stats-details">
                  <div className="stat-item">
                    <span className="stat-number">{changes.length}</span>
                    <span className="stat-label">총 변경사항</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {changes.filter(c => c.status === 'reviewed').length}
                    </span>
                    <span className="stat-label">검토 완료</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {changes.filter(c => c.status === 'pending').length}
                    </span>
                    <span className="stat-label">검토 대기</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'changes' && (
          <div className="changes-tab">
            <div className="changes-header">
              <h3>변경사항 히스토리</h3>
              <div className="changes-filter">
                <select defaultValue="all">
                  <option value="all">모든 상태</option>
                  <option value="pending">검토 대기</option>
                  <option value="reviewed">검토 완료</option>
                  <option value="approved">승인됨</option>
                </select>
              </div>
            </div>

            <div className="changes-list">
              {changes.length === 0 ? (
                <div className="empty-state">
                  <p>아직 변경사항이 없습니다.</p>
                </div>
              ) : (
                changes.map((change) => (
                  <div key={change.id} className="change-item">
                    <div className="change-header">
                      <div className="change-meta">
                        <span className="change-icon">
                          {getChangeTypeIcon(change.changeType)}
                        </span>
                        <div className="change-info">
                          <h4>{change.fileName}</h4>
                          <p className="commit-hash">커밋: {change.commitHash}</p>
                          <p className="author">작성자: {change.author}</p>
                          <span className="timestamp">{formatTimestamp(change.timestamp)}</span>
                        </div>
                      </div>
                      {getStatusBadge(change.status)}
                    </div>
                    
                    <div className="change-comment">
                      <p>{change.comment}</p>
                    </div>
                    
                    <details className="change-diff">
                      <summary>변경사항 보기</summary>
                      <pre>{change.diff}</pre>
                    </details>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="settings-section">
              <h3>모니터링 설정</h3>
              <div className="setting-item">
                <label>브랜치</label>
                <input 
                  type="text" 
                  defaultValue={project.settings.branch}
                  placeholder="main"
                />
              </div>
              <div className="setting-item">
                <label>감시 경로</label>
                <input 
                  type="text" 
                  defaultValue={project.settings.watchPaths.join(', ')}
                  placeholder="src/, components/, utils/"
                />
                <small>쉼표로 구분하여 여러 경로를 입력하세요</small>
              </div>
              <div className="setting-item">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    defaultChecked={project.settings.webhookEnabled}
                  />
                  GitHub 웹훅 등록
                </label>
              </div>
              <div className="setting-item">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    defaultChecked={project.settings.autoComment}
                  />
                  자동 주석 생성
                </label>
              </div>
              <button className="save-settings-button">설정 저장</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails; 