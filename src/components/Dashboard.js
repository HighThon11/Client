import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user, githubToken }) => {
  const [projects, setProjects] = useState([]);
  const [recentChanges, setRecentChanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [githubToken]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 로컬 스토리지에서 등록된 프로젝트들 가져오기
      const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      setProjects(savedProjects);

      // 최근 변경사항 시뮬레이션 (실제로는 백엔드에서 가져올 데이터)
      const mockRecentChanges = [
        {
          id: 1,
          projectName: 'my-react-app',
          fileName: 'src/App.js',
          changeType: 'modified',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          comment: '이 부분에서 null 체크가 추가되었습니다. NPE 방지를 위한 조치로 보입니다.',
          diff: '+ if (user && user.name) {\\n+   console.log(user.name);\\n+ }'
        },
        {
          id: 2,
          projectName: 'api-service',
          fileName: 'src/utils/api.js',
          changeType: 'added',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          comment: '새로운 API 엔드포인트가 추가되었습니다. 사용자 인증을 위한 토큰 검증 로직입니다.',
          diff: '+ export const validateToken = async (token) => {\\n+   try {\\n+     const response = await fetch(\'/api/validate\', {\\n+       headers: { Authorization: `Bearer ${token}` }\\n+     });\\n+     return response.ok;\\n+   } catch (error) {\\n+     return false;\\n+   }\\n+ };'
        }
      ];

      setRecentChanges(mockRecentChanges);
    } catch (error) {
      console.error('Dashboard load error:', error);
      setError('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>대시보드</h1>
        <p>안녕하세요, {user?.name || user?.login}님! 코드 변경사항을 모니터링하고 있습니다.</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="dashboard-grid">
        {/* 프로젝트 요약 */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📁 등록된 프로젝트</h2>
            <div className="header-buttons">
              <Link to="/repository" className="add-project-btn">
                📂 기존 레포지토리 보기
              </Link>
              <Link to="/create-repository" className="add-project-btn">
                ➕ 새 레포지토리 만들기
              </Link>
              <Link to="/register-project" className="add-project-btn">
                + 새 프로젝트
              </Link>
            </div>
          </div>
          <div className="card-content">
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>등록된 프로젝트가 없습니다.</p>
                <Link to="/register-project" className="primary-button">
                  첫 번째 프로젝트 등록하기
                </Link>
              </div>
            ) : (
              <div className="projects-list">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="project-info">
                      <h3>{project.name}</h3>
                      <p>{project.description || '설명 없음'}</p>
                      <span className="project-status active">활성</span>
                    </div>
                    <Link to={`/project/${project.id}`} className="view-project-btn">
                      보기
                    </Link>
                  </div>
                ))}
                {projects.length > 5 && (
                  <div className="view-more">
                    <Link to="/projects">모든 프로젝트 보기 ({projects.length})</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 최근 변경사항 */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>🔄 최근 변경사항</h2>
          </div>
          <div className="card-content">
            {recentChanges.length === 0 ? (
              <div className="empty-state">
                <p>아직 변경사항이 없습니다.</p>
              </div>
            ) : (
              <div className="changes-list">
                {recentChanges.map((change) => (
                  <div key={change.id} className="change-item">
                    <div className="change-header">
                      <span className="change-icon">
                        {getChangeTypeIcon(change.changeType)}
                      </span>
                      <div className="change-info">
                        <h4>{change.fileName}</h4>
                        <p className="project-name">{change.projectName}</p>
                        <span className="timestamp">{formatTimestamp(change.timestamp)}</span>
                      </div>
                    </div>
                    <div className="change-comment">
                      <p>{change.comment}</p>
                    </div>
                    <details className="change-diff">
                      <summary>변경사항 보기</summary>
                      <pre>{change.diff}</pre>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 통계 */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📊 통계</h2>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{projects.length}</div>
                <div className="stat-label">등록된 프로젝트</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{recentChanges.length}</div>
                <div className="stat-label">이번 주 변경사항</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">정확도</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 