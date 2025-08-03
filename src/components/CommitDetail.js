import React from "react";
import "./CommitDetail.css";

const CommitDetail = ({ commit, repository, onBack }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatFileChanges = (files) => {
    if (!files || files.length === 0) return [];

    return files.map((file, index) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions || 0,
      deletions: file.deletions || 0,
      changes: file.changes || 0,
      patch: file.patch || "",
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

  const fileChanges = formatFileChanges(commit.files);

  return (
    <div className="commit-detail-container">
      <div className="commit-detail-header">
        <button onClick={onBack} className="back-button">
          ← 커밋 목록으로 돌아가기
        </button>
        <h1>커밋 상세 정보</h1>
        <p>
          {repository.repositoryName} - {commit.sha.substring(0, 7)}
        </p>
      </div>

      <div className="commit-detail-content">
        {/* 커밋 기본 정보 */}
        <div className="commit-info-section">
          <div className="commit-message-section">
            <h2>커밋 메시지</h2>
            <div className="commit-message">{commit.commit.message}</div>
          </div>

          <div className="commit-author-section">
            <h3>작성자 정보</h3>
            <div className="author-info">
              <div className="author-avatar">
                <img
                  src={
                    commit.author?.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      commit.commit.author.name
                    )}&background=random`
                  }
                  alt={commit.author?.login || commit.commit.author.name}
                  className="avatar"
                />
              </div>
              <div className="author-details">
                <div className="author-name">
                  {commit.author?.login || commit.commit.author.name}
                </div>
                <div className="author-email">{commit.commit.author.email}</div>
                <div className="commit-date">
                  {formatDate(commit.commit.author.date)}
                </div>
              </div>
            </div>
          </div>

          <div className="commit-stats-section">
            <h3>변경 통계</h3>
            <div className="commit-stats">
              <div className="stat-item">
                <span className="stat-label">SHA:</span>
                <span className="stat-value">{commit.sha}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">파일 변경:</span>
                <span className="stat-value">{fileChanges.length}개 파일</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">추가된 줄:</span>
                <span className="stat-value additions">
                  +{fileChanges.reduce((sum, file) => sum + file.additions, 0)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">삭제된 줄:</span>
                <span className="stat-value deletions">
                  -{fileChanges.reduce((sum, file) => sum + file.deletions, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 파일 변경 사항 */}
        {fileChanges.length > 0 && (
          <div className="files-section">
            <h3>변경된 파일</h3>
            <div className="files-list">
              {fileChanges.map((file, index) => (
                <div key={index} className="file-change">
                  <div className="file-header">
                    <div className="file-info">
                      <span
                        className="file-status"
                        style={{ color: getStatusColor(file.status) }}
                      >
                        {getStatusText(file.status)}
                      </span>
                      <span className="file-name">{file.filename}</span>
                    </div>
                    <div className="file-stats">
                      <span className="additions">+{file.additions}</span>
                      <span className="deletions">-{file.deletions}</span>
                    </div>
                  </div>
                  {file.patch && (
                    <div className="file-patch">
                      <pre>{file.patch}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 커밋 부모 정보 */}
        {commit.parents && commit.parents.length > 0 && (
          <div className="parents-section">
            <h3>부모 커밋</h3>
            <div className="parents-list">
              {commit.parents.map((parent, index) => (
                <div key={index} className="parent-commit">
                  <span className="parent-sha">
                    {parent.sha.substring(0, 7)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitDetail;
