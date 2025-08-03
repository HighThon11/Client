import React from "react";
import "./CommitDetail.css";

const CommitDetail = ({ commit, repository, onBack, user, onLogout }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return "날짜 없음";
    }
  };

  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
        return "today";
      } else if (diffInDays === 1) {
        return "1d ago";
      } else {
        return `${diffInDays}d ago`;
      }
    } catch (error) {
      return "unknown";
    }
  };

  const formatFileChanges = (files) => {
    if (!files || files.length === 0) return [];

    return files.map((file, index) => ({
      filename: file.filename || file.name || `file-${index}`,
      status: file.status || "modified",
      additions: file.additions || file.lines_added || 0,
      deletions: file.deletions || file.lines_deleted || 0,
      changes: file.changes || file.lines_changed || 0,
      patch: file.patch || file.diff || "",
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "added":
        return "#28a745";
      case "modified":
        return "#ffc107";
      case "removed":
        return "#dc3545";
      case "renamed":
        return "#17a2b8";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "added":
        return "추가됨";
      case "modified":
        return "수정됨";
      case "removed":
        return "삭제됨";
      case "renamed":
        return "이름변경";
      default:
        return status;
    }
  };

  const fileChanges = formatFileChanges(commit?.files);

  // commit이 없을 때 로딩 상태 표시
  if (!commit) {
    return (
      <div className="commit-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>커밋 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="commit-detail-container">
      {/* 상단 헤더 */}
      <div className="top-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-text">ㅇㅈ ㅋㄷ</span>
          </div>
        </div>
        <div className="header-right">
          <span className="project-name">프로젝트</span>
          <span className="username">
            {user?.login || user?.name || "사용자"}
          </span>
          <button className="logout-btn" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        {/* 왼쪽 사이드바 */}
        <div className="sidebar">
          <div className="project-info">
            <h3>프로젝트명 01</h3>
            <p>프로젝트 디스크립션 - 설명</p>
            <div className="language-info">
              <span className="language-icon">●</span>
              <span>javascript</span>
            </div>
          </div>

          <div className="commit-history">
            <h3>커밋 히스토리</h3>
            <div className="commit-list">
              <div className="commit-item active">
                <div className="commit-info">
                  <div className="commit-message">
                    Commit {commit?.sha?.substring(0, 7) || "N/A"}
                  </div>
                  <div className="commit-meta">
                    <span className="commit-time">
                      {getTimeAgo(
                        commit?.commit?.author?.date || commit?.author?.date
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="commit-item">
                <div className="commit-info">
                  <div className="commit-message">Commit c385318</div>
                  <div className="commit-meta">
                    <span className="commit-time">42d ago</span>
                  </div>
                </div>
              </div>
              <div className="commit-item">
                <div className="commit-info">
                  <div className="commit-message">Commit c385318</div>
                  <div className="commit-meta">
                    <span className="commit-time">42d ago</span>
                  </div>
                </div>
              </div>
              <div className="commit-item">
                <div className="commit-info">
                  <div className="commit-message">Commit c385318</div>
                  <div className="commit-meta">
                    <span className="commit-time">42d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 메인 영역 */}
        <div className="main-area">
          <div className="commit-detail">
            <div className="commit-header">
              <h1>Commit {commit?.sha?.substring(0, 7) || "N/A"}</h1>
              <div className="commit-link">
                <span>🔗</span>
                <span>
                  GitHub - {user?.login || "username"}/Commit{" "}
                  {commit?.sha?.substring(0, 7) || "N/A"}
                </span>
              </div>
            </div>

            <div className="commit-meta">
              <div className="meta-card">
                <span>📅</span>
                <span>마지막 커밋</span>
                <span>
                  {formatDate(
                    commit?.commit?.author?.date || commit?.author?.date
                  )}
                </span>
              </div>
              <div className="meta-card">
                <span>📁</span>
                <span>추적 파일 수</span>
                <span>{fileChanges.length}</span>
              </div>
            </div>

            <div className="commit-message">
              <h2>
                {commit.commit?.message || commit.message || "커밋 메시지 없음"}
              </h2>
              <button className="deploy-btn">🚀 deploy (#15)</button>
            </div>

            {/* 파일 변경 사항 */}
            {fileChanges.length > 0 && (
              <div className="file-changes">
                <div className="changes-header">
                  <div className="search-bar">
                    <input type="text" placeholder="Q Filter files..." />
                  </div>
                  <div className="changes-summary">
                    <span>{fileChanges.length} files changed</span>
                    <span>
                      +
                      {fileChanges.reduce(
                        (sum, file) => sum + file.additions,
                        0
                      )}{" "}
                      -
                      {fileChanges.reduce(
                        (sum, file) => sum + file.deletions,
                        0
                      )}{" "}
                      lines changed
                    </span>
                  </div>
                  <div className="search-bar">
                    <input type="text" placeholder="Q Search within code" />
                  </div>
                </div>

                <div className="changes-content">
                  {/* 파일 트리 */}
                  <div className="file-tree">
                    {fileChanges.map((file, index) => (
                      <div key={index} className="tree-item">
                        <span>📄</span>
                        <span>{file.filename}</span>
                        <span className="file-stats">
                          +{file.additions} -{file.deletions}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 코드 변경사항 */}
                  <div className="code-diff">
                    {fileChanges.map((file, fileIndex) => (
                      <div key={fileIndex} className="file-diff">
                        <div className="file-path">{file.filename}</div>
                        <div className="diff-summary">@@ -5,5 +5,8 @@</div>
                        <div className="code-changes">
                          {file.patch ? (
                            <pre className="patch-content">{file.patch}</pre>
                          ) : (
                            <div className="no-patch">
                              <div className="code-line unchanged">
                                <span className="line-number">1</span>
                                <span className="code-content">
                                  // 파일 변경사항이 표시됩니다
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="commit-actions">
                  <button className="apply-comments-btn">
                    주석 적용해서 커밋 후 푸시하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitDetail;
