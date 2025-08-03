import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGitHubRepositories, saveRepository } from "../api/auth";
import "./CreateRepository.css";

const CreateRepository = ({ user, githubToken }) => {
  const [formData, setFormData] = useState({
    selectedRepository: "",
  });
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // props에서 사용자 정보와 GitHub 토큰 가져오기
    console.log(
      "CreateRepository useEffect - user:",
      user,
      "githubToken:",
      !!githubToken
    );

    if (!user || !githubToken) {
      console.log("Missing user or githubToken props:", {
        user: !!user,
        githubToken: !!githubToken,
      });
      return;
    }

    console.log("CreateRepository component mounted with user:", user.login);
    fetchRepositories();
  }, [user, githubToken, navigate]);

  const fetchRepositories = async () => {
    try {
      setIsLoading(true);
      setError("");
      console.log("🚀 CreateRepository.js - fetchRepositories 시작");

      // 백엔드 API를 사용하여 GitHub 레포지토리 목록 가져오기
      const repos = await getGitHubRepositories();
      console.log(
        "✅ CreateRepository.js - 레포지토리 가져오기 성공:",
        repos.length
      );
      setRepositories(repos);
    } catch (err) {
      console.error("❌ CreateRepository.js - 레포지토리 가져오기 실패:", err);
      setError(
        "GitHub 레포지토리 목록을 가져오는데 실패했습니다. 다시 시도해주세요."
      );
      // API 연결 실패 시에도 더미 데이터 사용
      console.log("🔄 API 연결 실패 - 더미 데이터로 대체...");
      const dummyRepos = [
        {
          id: 1,
          name: "my-react-app",
          description: "React로 만든 웹 애플리케이션",
          private: false,
          language: "JavaScript",
          stargazers_count: 5,
          forks_count: 2,
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "api-service",
          description: "Node.js API 서버",
          private: true,
          language: "JavaScript",
          stargazers_count: 3,
          forks_count: 1,
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          name: "portfolio-website",
          description: "개인 포트폴리오 웹사이트",
          private: false,
          language: "HTML",
          stargazers_count: 8,
          forks_count: 4,
          updated_at: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];
      setRepositories(dummyRepos);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!formData.selectedRepository) {
        throw new Error("저장소를 선택해주세요.");
      }

      const selectedRepo = repositories.find(
        (repo) => repo.id.toString() === formData.selectedRepository
      );

      if (!selectedRepo) {
        throw new Error("선택된 레포지토리를 찾을 수 없습니다.");
      }

      setIsSaving(true);

      // API 요청을 위한 레포지토리 데이터 준비
      const repositoryData = {
        repositoryId: selectedRepo.id,
        repositoryName: selectedRepo.name,
        repositoryFullName: `${user?.login || "unknown"}/${selectedRepo.name}`,
        repositoryDescription: selectedRepo.description || "",
        repositoryUrl:
          selectedRepo.html_url ||
          `https://github.com/${user?.login || "unknown"}/${selectedRepo.name}`,
        defaultBranch: "main", // GitHub API에서 기본 브랜치 정보를 가져올 수 있지만, 여기서는 기본값 사용
        isPrivate: selectedRepo.private || false,
        repositoryCreatedAt:
          selectedRepo.created_at || new Date().toISOString(),
        repositoryUpdatedAt:
          selectedRepo.updated_at || new Date().toISOString(),
      };

      console.log("📦 저장할 레포지토리 데이터:", repositoryData);

      // 서버에 레포지토리 저장
      await saveRepository(repositoryData);
      console.log("✅ 레포지토리 저장 성공");

      // 선택된 레포지토리를 로컬 스토리지에 저장
      localStorage.setItem("selectedRepository", JSON.stringify(selectedRepo));

      // 성공 메시지 표시
      setSuccess(
        "레포지토리가 성공적으로 저장되었습니다! 저장된 레포지토리 페이지로 이동합니다."
      );

      // 2초 후 저장된 레포지토리 페이지로 이동
      setTimeout(() => {
        navigate("/repository");
      }, 2000);
    } catch (err) {
      console.error("Error saving repository:", err);
      setError(err.message || "레포지토리 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToRepository = () => {
    navigate("/repository");
  };

  return (
    <div className="create-repository-container">
      <div className="create-repository-header">
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
      </div>

      <div className="create-repository-card">
        <form onSubmit={handleSubmit} className="create-repository-form">
          {error && (
            <div className="error-message">
              <h3>오류 발생</h3>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="success-message">
              <h3>성공!</h3>
              <p>{success}</p>
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <p>GitHub 레포지토리를 불러오는 중...</p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="selectedRepository">저장소 선택</label>
                <select
                  id="selectedRepository"
                  name="selectedRepository"
                  value={formData.selectedRepository}
                  onChange={handleInputChange}
                  required
                  className="form-select repository-select"
                  disabled={isSaving}
                >
                  <option value="">저장소를 선택하세요</option>
                  {repositories.map((repo) => (
                    <option key={repo.id} value={repo.id}>
                      {repo.name} {repo.private ? "(Private)" : "(Public)"}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSaving || !formData.selectedRepository}
              >
                {isSaving ? "저장 중..." : "레포지토리 저장"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateRepository;
