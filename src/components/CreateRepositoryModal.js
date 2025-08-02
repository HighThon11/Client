import React, { useState, useEffect } from "react";
import { getGitHubRepositories, saveRepository } from "../api/auth";
import "./CreateRepositoryModal.css";

const CreateRepositoryModal = ({ user, githubToken, onClose }) => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🚀 CreateRepositoryModal - GitHub 레포지토리 조회 시작");

      const repos = await getGitHubRepositories();
      console.log(
        "✅ CreateRepositoryModal - GitHub 레포지토리 가져오기 성공:",
        repos.length
      );
      setRepositories(repos);
    } catch (err) {
      console.error(
        "❌ CreateRepositoryModal - GitHub 레포지토리 가져오기 실패:",
        err
      );
      setError("GitHub 레포지토리 목록을 가져오는데 실패했습니다.");

      // 더미 데이터 사용
      const dummyRepos = [
        {
          id: 1,
          name: "my-react-app",
          full_name: "user/my-react-app",
          description: "React로 만든 웹 애플리케이션",
          private: false,
          html_url: "https://github.com/user/my-react-app",
          default_branch: "main",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "api-service",
          full_name: "user/api-service",
          description: "Node.js API 서버",
          private: true,
          html_url: "https://github.com/user/api-service",
          default_branch: "main",
          created_at: "2023-02-01T00:00:00Z",
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          name: "portfolio-website",
          full_name: "user/portfolio-website",
          description: "개인 포트폴리오 웹사이트",
          private: false,
          html_url: "https://github.com/user/portfolio-website",
          default_branch: "main",
          created_at: "2023-03-01T00:00:00Z",
          updated_at: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];
      setRepositories(dummyRepos);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
  };

  const handleSaveRepository = async () => {
    if (!selectedRepo) {
      setError("저장할 레포지토리를 선택해주세요.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const repositoryData = {
        repositoryId: selectedRepo.id,
        repositoryName: selectedRepo.name,
        repositoryFullName: selectedRepo.full_name,
        repositoryDescription: selectedRepo.description || "",
        repositoryUrl: selectedRepo.html_url,
        defaultBranch: selectedRepo.default_branch,
        isPrivate: selectedRepo.private,
        repositoryCreatedAt: selectedRepo.created_at,
        repositoryUpdatedAt: selectedRepo.updated_at,
      };

      console.log("💾 레포지토리 저장 시작:", repositoryData);
      await saveRepository(repositoryData);

      setSuccess(true);
      console.log("✅ 레포지토리 저장 성공");

      // 2초 후 모달 닫기
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("❌ 레포지토리 저장 실패:", error);
      setError("레포지토리 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>새 레포지토리 추가</h2>
          <button
            className="close-button"
            onClick={handleClose}
            disabled={saving}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>GitHub 레포지토리를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchRepositories} className="retry-button">
                다시 시도
              </button>
            </div>
          ) : success ? (
            <div className="success-message">
              <p>✅ 레포지토리가 성공적으로 저장되었습니다!</p>
            </div>
          ) : (
            <>
              <div className="repository-selection">
                <label htmlFor="repository-select">
                  저장할 레포지토리를 선택하세요:
                </label>
                <select
                  id="repository-select"
                  value={selectedRepo?.id || ""}
                  onChange={(e) => {
                    const repo = repositories.find(
                      (r) => r.id === parseInt(e.target.value)
                    );
                    setSelectedRepo(repo);
                  }}
                  className="repository-select"
                >
                  <option value="">저장소를 선택하세요</option>
                  {repositories.map((repo) => (
                    <option key={repo.id} value={repo.id}>
                      {repo.name} {repo.private ? "(Private)" : "(Public)"}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRepo && (
                <div className="selected-repo-info">
                  <h3>선택된 레포지토리</h3>
                  <div className="repo-card">
                    <div className="repo-header">
                      <h4>{selectedRepo.name}</h4>
                      <span
                        className={`repo-visibility ${
                          selectedRepo.private ? "private" : "public"
                        }`}
                      >
                        {selectedRepo.private ? "Private" : "Public"}
                      </span>
                    </div>
                    <p className="repo-description">
                      {selectedRepo.description || "설명이 없습니다."}
                    </p>
                    <div className="repo-meta">
                      <span>기본 브랜치: {selectedRepo.default_branch}</span>
                      <a
                        href={selectedRepo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-link"
                      >
                        🔗 GitHub에서 보기
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button
                  onClick={handleSaveRepository}
                  disabled={!selectedRepo || saving}
                  className="save-button"
                >
                  {saving ? "저장 중..." : "레포지토리 저장"}
                </button>
                <button
                  onClick={handleClose}
                  className="cancel-button"
                  disabled={saving}
                >
                  취소
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRepositoryModal;
