import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRepositoryCommits, formatTimeAgo } from "../api/github";
import "./ProjectDetails.css";

const ProjectDetails = ({ user, githubToken }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [changes, setChanges] = useState([]);
  const [commits, setCommits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    setIsLoading(true);
    setError("");

    try {
      console.log("🔍 프로젝트 ID:", projectId);
      
      // 여러 소스에서 프로젝트 정보 찾기
      let foundProject = null;
      
      // 1. projects 키에서 찾기
      const projects = JSON.parse(localStorage.getItem("projects") || "[]");
      console.log("📋 projects 키의 데이터:", projects);
      foundProject = projects.find((p) => p.id === projectId);
      
      // 2. savedRepositories 키에서 찾기 (Repository에서 저장하는 데이터)
      if (!foundProject) {
        const savedRepos = JSON.parse(localStorage.getItem("savedRepositories") || "[]");
        console.log("📋 savedRepositories 키의 데이터:", savedRepos);
        foundProject = savedRepos.find((p) => p.id === projectId);
        
        // Repository 데이터를 Project 형식으로 변환
        if (foundProject) {
          foundProject = {
            id: foundProject.id,
            name: foundProject.repositoryName,
            description: foundProject.repositoryDescription || "설명 없음",
            repository: {
              fullName: foundProject.repositoryFullName,
              url: foundProject.repositoryUrl,
              owner: foundProject.repositoryFullName?.split('/')[0],
              name: foundProject.repositoryName
            },
            settings: {
              branch: "main",
              watchPaths: [],
              webhookEnabled: false,
              autoComment: false
            },
            createdAt: foundProject.repositoryUpdatedAt || new Date().toISOString()
          };
        }
      }

      if (!foundProject) {
        console.log("❌ 프로젝트를 찾을 수 없음");
        setError("프로젝트를 찾을 수 없습니다.");
        return;
      }

      console.log("✅ 찾은 프로젝트:", foundProject);

      setProject(foundProject);

      // 변경사항 히스토리 시뮬레이션 (실제로는 백엔드에서 가져올 데이터)
      const mockChanges = [
        {
          id: 1,
          commitHash: "a1b2c3d4",
          fileName: "src/components/Login.js",
          changeType: "modified",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          author: user?.name || user?.login,
          comment:
            "이 부분에서 null 체크가 추가되었습니다. NPE 방지를 위한 조치로 보입니다.",
          diff: "+ if (user && user.name) {\\n+   console.log(user.name);\\n+ }",
          status: "reviewed",
        },
        {
          id: 2,
          commitHash: "e5f6g7h8",
          fileName: "src/utils/api.js",
          changeType: "added",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          author: user?.name || user?.login,
          comment:
            "새로운 API 엔드포인트가 추가되었습니다. 사용자 인증을 위한 토큰 검증 로직입니다.",
          diff: "+ export const validateToken = async (token) => {\\n+   try {\\n+     const response = await fetch('/api/validate', {\\n+       headers: { Authorization: `Bearer ${token}` }\\n+     });\\n+     return response.ok;\\n+   } catch (error) {\\n+     return false;\\n+   }\\n+ };",
          status: "pending",
        },
        {
          id: 3,
          commitHash: "i9j0k1l2",
          fileName: "src/App.js",
          changeType: "deleted",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          author: user?.name || user?.login,
          comment:
            "사용하지 않는 import 문이 제거되었습니다. 코드 정리를 위한 리팩토링입니다.",
          diff: "- import unusedComponent from './components/UnusedComponent';\\n- import { unusedUtil } from './utils/unused'",
          status: "reviewed",
        },
      ];

      setChanges(mockChanges);

      // GitHub 커밋 목록 가져오기
      console.log("🔍 커밋 로딩 시작...");
      console.log("📋 프로젝트 정보:", foundProject.repository);
      console.log("🔑 GitHub 토큰 존재:", !!githubToken);
      
      if (foundProject.repository && githubToken) {
        try {
          const owner = foundProject.repository.owner || foundProject.repository.fullName?.split('/')[0];
          const repo = foundProject.repository.name || foundProject.repository.fullName?.split('/')[1];
          
          console.log("👤 Owner:", owner);
          console.log("📦 Repo:", repo);
          
          if (owner && repo) {
            console.log("🚀 GitHub API 호출 중...");
            const commitsData = await fetchRepositoryCommits(owner, repo, githubToken);
            console.log("✅ 커밋 데이터 로딩 완료:", commitsData.length, "개");
            console.log("📋 커밋 데이터 샘플:", commitsData.slice(0, 2));
            setCommits(commitsData);
            
            // 임시 테스트용 데이터 (실제 데이터가 안 나올 때 사용)
            if (commitsData.length === 0) {
              console.log("🧪 테스트 데이터 설정");
              setCommits([
                {
                  id: "test1",
                  sha: "4974a70",
                  message: "feat: 깃허브 연동 전까지 구현",
                  author: "한태영",
                  date: new Date().toISOString(),
                  url: "#",
                  avatar: ""
                },
                {
                  id: "test2", 
                  sha: "2bd3976",
                  message: "feat: 커밋 조회 구현",
                  author: "한태영",
                  date: new Date(Date.now() - 86400000).toISOString(),
                  url: "#",
                  avatar: ""
                }
              ]);
            }
          } else {
            console.log("❌ Owner 또는 Repo 정보 부족");
          }
        } catch (commitError) {
          console.error("❌ 커밋 목록 가져오기 오류:", commitError);
          // 커밋 로딩 실패는 전체 프로젝트 로딩을 중단하지 않음
        }
      } else {
        console.log("❌ GitHub 토큰 또는 레포지토리 정보 없음");
      }
    } catch (error) {
      console.error("Project details load error:", error);
      setError("프로젝트 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeTypeIcon = (type) => {
    switch (type) {
      case "added":
        return "➕";
      case "modified":
        return "✏️";
      case "deleted":
        return "🗑️";
      default:
        return "📝";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="status-badge pending">검토 대기</span>;
      case "reviewed":
        return <span className="status-badge reviewed">검토 완료</span>;
      case "approved":
        return <span className="status-badge approved">승인됨</span>;
      default:
        return <span className="status-badge unknown">알 수 없음</span>;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteProject = () => {
    if (window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      const projects = JSON.parse(localStorage.getItem("projects") || "[]");
      const updatedProjects = projects.filter((p) => p.id !== projectId);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      navigate("/repository");
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
          {error || "프로젝트를 찾을 수 없습니다."}
        </div>
        <button onClick={() => navigate("/repository")} className="back-button">
          레포지토리로 돌아가기
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
          <p>{project.description || "설명 없음"}</p>
          <div className="project-meta">
            <span className="project-status active">활성</span>
            <span className="project-created">
              생성일: {new Date(project.createdAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>
        <div className="project-actions">
          <button
            onClick={() => navigate("/repository")}
            className="back-button"
          >
            ← 레포지토리
          </button>
          <button onClick={handleDeleteProject} className="delete-button">
            프로젝트 삭제
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 개요
        </button>
        <button
          className={`tab-button ${activeTab === "changes" ? "active" : ""}`}
          onClick={() => setActiveTab("changes")}
        >
          🔄 변경사항
        </button>
        <button
          className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ 설정
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📁 리포지토리 정보</h3>
                <div className="repo-details">
                  {project.repository?.fullName ? (
                    <>
                      <p>
                        <strong>이름:</strong> {project.repository.fullName}
                      </p>
                      <p>
                        <strong>소유자:</strong> {project.repository.owner}
                      </p>
                      <p>
                        <strong>URL:</strong>
                        <a
                          href={project.repository.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.repository.url}
                        </a>
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>URL:</strong> {project.repository?.url}
                    </p>
                  )}
                </div>
              </div>

              <div className="overview-card">
                <h3>⚙️ 모니터링 설정</h3>
                <div className="settings-details">
                  <p>
                    <strong>브랜치:</strong> {project.settings.branch}
                  </p>
                  <p>
                    <strong>감시 경로:</strong>
                    {project.settings.watchPaths.length > 0
                      ? project.settings.watchPaths.join(", ")
                      : "전체 프로젝트"}
                  </p>
                  <p>
                    <strong>웹훅:</strong>{" "}
                    {project.settings.webhookEnabled ? "활성화" : "비활성화"}
                  </p>
                  <p>
                    <strong>자동 주석:</strong>{" "}
                    {project.settings.autoComment ? "활성화" : "비활성화"}
                  </p>
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
                      {changes.filter((c) => c.status === "reviewed").length}
                    </span>
                    <span className="stat-label">검토 완료</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {changes.filter((c) => c.status === "pending").length}
                    </span>
                    <span className="stat-label">검토 대기</span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>● 커밋 히스토리</h3>
                <div className="commits-list">
                  {commits.length === 0 ? (
                    <div className="empty-commits">
                      <p>커밋 정보를 불러올 수 없습니다.</p>
                      <small>GitHub 토큰이 필요하거나 레포지토리 정보가 올바르지 않을 수 있습니다.</small>
                    </div>
                  ) : (
                    commits.slice(0, 5).map((commit) => (
                      <div key={commit.id} className="commit-item">
                        <div className="commit-info">
                          <div className="commit-header">
                            <span className="commit-hash">Commit {commit.sha}</span>
                            <span className="commit-time">{formatTimeAgo(commit.date)}</span>
                          </div>
                          <p className="commit-message">{commit.message}</p>
                          <div className="commit-author">
                            {commit.avatar && (
                              <img 
                                src={commit.avatar} 
                                alt={commit.author} 
                                className="author-avatar"
                              />
                            )}
                            <span className="author-name">{commit.author}</span>
                          </div>
                        </div>
                        <a 
                          href={commit.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="commit-link"
                        >
                          보기 →
                        </a>
                      </div>
                    ))
                  )}
                  {commits.length > 5 && (
                    <div className="more-commits">
                      <a 
                        href={`https://github.com/${project.repository.owner || project.repository.fullName?.split('/')[0]}/${project.repository.name || project.repository.fullName?.split('/')[1]}/commits`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        더 많은 커밋 보기 →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "changes" && (
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
                          <p className="commit-hash">
                            커밋: {change.commitHash}
                          </p>
                          <p className="author">작성자: {change.author}</p>
                          <span className="timestamp">
                            {formatTimestamp(change.timestamp)}
                          </span>
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

        {activeTab === "settings" && (
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
                  defaultValue={project.settings.watchPaths.join(", ")}
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
