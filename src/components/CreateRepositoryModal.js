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

    console.log("💾 모달에서 레포지토리 저장 시작");
    console.log("User info:", user);
    console.log("Selected repo:", selectedRepo);

    try {
      setSaving(true);
      setError(null);

      // API 요청을 위한 레포지토리 데이터 준비
      const repositoryData = {
        repositoryId: selectedRepo.id,
        repositoryName: selectedRepo.name,
        repositoryFullName: `${user?.login || "unknown"}/${selectedRepo.name}`,
        repositoryDescription: selectedRepo.description || "",
        repositoryUrl:
          selectedRepo.html_url ||
          `https://github.com/${user?.login || "unknown"}/${selectedRepo.name}`,
        defaultBranch: selectedRepo.default_branch || "main",
        isPrivate: selectedRepo.private || false,
        repositoryCreatedAt:
          selectedRepo.created_at || new Date().toISOString(),
        repositoryUpdatedAt:
          selectedRepo.updated_at || new Date().toISOString(),
      };

      console.log("💾 레포지토리 저장 시작:", repositoryData);
      await saveRepository(repositoryData);

      setSuccess(true);
      console.log("✅ 레포지토리 저장 성공");

      // 1초 후 모달 닫기 (create-repository와 동일하게)
      setTimeout(() => {
        onClose();
      }, 1000);
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
          <div className="header-content">
            <svg
              className="github-logo"
              width="98"
              height="96"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                fill="#fff"
              />
            </svg>
            <h1>내 GitHub 저장소 배포하기</h1>
            <p>배포하길 원하는 GitHub 저장소를 선택해주세요</p>
          </div>
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
                <h3>저장할 레포지토리를 선택하세요:</h3>
                <div className="repositories-grid">
                  {repositories.map((repo) => (
                    <div
                      key={repo.id}
                      className={`repository-card-selectable ${
                        selectedRepo?.id === repo.id ? "selected" : ""
                      }`}
                      onClick={() => handleRepoSelect(repo)}
                    >
                      <div className="repo-header">
                        <h4>{repo.name}</h4>
                        <span
                          className={`repo-visibility ${
                            repo.private ? "private" : "public"
                          }`}
                        >
                          {repo.private ? "Private" : "Public"}
                        </span>
                      </div>
                      <p className="repo-description">
                        {repo.description || "설명이 없습니다."}
                      </p>
                      <div className="repo-meta">
                        <span>기본 브랜치: {repo.default_branch}</span>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="github-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🔗 GitHub에서 보기
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRepo && (
                <div className="selected-repo-banner">
                  <div className="selected-info">
                    <span className="selected-label">선택됨:</span>
                    <span className="selected-repo-name">
                      {selectedRepo.name}
                    </span>
                    <span
                      className={`repo-visibility ${
                        selectedRepo.private ? "private" : "public"
                      }`}
                    >
                      {selectedRepo.private ? "Private" : "Public"}
                    </span>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button
                  onClick={handleSaveRepository}
                  disabled={!selectedRepo || saving}
                  className="save-button"
                >
                  {saving ? "저장 중..." : "완료"}
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
