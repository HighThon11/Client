import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSavedRepositories,
  saveRepository,
  getRepositoryCommits,
  getCommitDetail,
  deleteSavedRepository,
} from "../api/auth";
import CreateRepositoryModal from "./CreateRepositoryModal";
import CommitList from "./CommitList";
import CommitDetail from "./CommitDetail";
import "./Repository.css";

const Repository = ({ user, githubToken, onLogout, onNavigationChange }) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCommitList, setShowCommitList] = useState(false);
  const [showCommitDetail, setShowCommitDetail] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // props에서 사용자 정보와 GitHub 토큰 가져오기
    console.log(
      "Repository useEffect - user:",
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

    console.log("Repository component mounted with user:", user.login);
    fetchRepositories();

    // 네비게이션 표시
    if (onNavigationChange) {
      onNavigationChange(true);
    }

    // 히스토리 정리 - /dashboard를 /repository로 교체
    if (window.location.pathname === "/dashboard") {
      navigate("/repository", { replace: true });
    }
  }, [user, githubToken, navigate, onNavigationChange]);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🚀 Repository.js - 저장된 레포지토리 조회 시작");

      // 백엔드 API를 사용하여 저장된 레포지토리 목록 가져오기
      const savedRepos = await getSavedRepositories();
      console.log(
        "✅ Repository.js - 저장된 레포지토리 가져오기 성공:",
        savedRepos.length
      );
      console.log(
        "🔍 저장된 레포지토리 데이터:",
        savedRepos.map((repo) => ({
          id: repo.id,
          repositoryName: repo.repositoryName,
          repositoryFullName: repo.repositoryFullName,
          repositoryUrl: repo.repositoryUrl,
        }))
      );
      setRepositories(savedRepos);
    } catch (err) {
      console.error("❌ Repository.js - 저장된 레포지토리 가져오기 실패:", err);
      setError(
        "저장된 레포지토리 목록을 가져오는데 실패했습니다. 다시 시도해주세요."
      );
      // API 연결 실패 시에도 더미 데이터 사용
      console.log("🔄 API 연결 실패 - 더미 데이터로 대체...");
      const dummyRepos = [
        {
          id: 1,
          repositoryName: "my-react-app",
          repositoryDescription: "React로 만든 웹 애플리케이션",
          isPrivate: false,
          repositoryFullName: "user/my-react-app",
          repositoryUrl: "https://github.com/user/my-react-app",
          repositoryUpdatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          repositoryName: "api-service",
          repositoryDescription: "Node.js API 서버",
          isPrivate: true,
          repositoryFullName: "user/api-service",
          repositoryUrl: "https://github.com/user/api-service",
          repositoryUpdatedAt: new Date(
            Date.now() - 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: 3,
          repositoryName: "portfolio-website",
          repositoryDescription: "개인 포트폴리오 웹사이트",
          isPrivate: false,
          repositoryFullName: "user/portfolio-website",
          repositoryUrl: "https://github.com/user/portfolio-website",
          repositoryUpdatedAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];
      setRepositories(dummyRepos);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSelect = async (repo) => {
    try {
      setSelectedRepo(repo);
      setLoading(true);

      console.log("🔍 선택된 레포지토리:", {
        repositoryName: repo.repositoryName,
        repositoryFullName: repo.repositoryFullName,
        extractedOwner: repo.repositoryFullName?.split("/")[0],
        extractedRepo: repo.repositoryName,
      });

      // 네비게이션 숨기기
      if (onNavigationChange) {
        onNavigationChange(false);
      }

      // 히스토리에 현재 상태 추가 (뒤로가기 시 /repository로 돌아가도록)
      navigate("/repository", { replace: false });

      // 레포지토리의 첫 번째 커밋을 가져오기
      const [owner, repoName] = repo.repositoryFullName?.split("/") || [];

      console.log("🚀 API 호출 파라미터:", {
        owner,
        repoName,
        fullName: repo.repositoryFullName,
      });

      const commits = await getRepositoryCommits(owner, repoName);

      if (commits && commits.length > 0) {
        // 첫 번째 커밋의 상세 정보 가져오기
        const firstCommit = commits[0];
        const commitDetail = await getCommitDetail(
          repo.repositoryFullName.split("/")[0],
          repo.repositoryName,
          firstCommit.sha
        );

        setSelectedCommit(commitDetail);
        setShowCommitDetail(true);
      } else {
        // 커밋이 없는 경우 커밋 목록 페이지로 이동
        setShowCommitList(true);
      }
    } catch (error) {
      console.error("❌ 레포지토리 선택 실패:", error);
      setError(`레포지토리 정보를 가져오는데 실패했습니다: ${error.message}`);
      // API 호출 실패 시 커밋 목록 페이지로 이동
      setShowCommitList(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRepository = () => {
    navigate("/repository");
  };

  const handleCreateRepository = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // 모달이 닫힐 때 저장된 레포지토리 목록을 다시 불러오기
    fetchRepositories();
  };

  const handleDeleteRepository = async (repositoryId) => {
    if (window.confirm("정말로 이 레포지토리를 삭제하시겠습니까?")) {
      try {
        await deleteSavedRepository(repositoryId);
        console.log("✅ 레포지토리 삭제 성공");
        // 레포지토리 목록 새로고침
        fetchRepositories();
      } catch (error) {
        console.error("❌ 레포지토리 삭제 실패:", error);
        setError("레포지토리 삭제에 실패했습니다.");
      }
    }
  };

  const handleBackFromCommits = () => {
    setShowCommitList(false);
    setSelectedRepo(null);

    // 네비게이션 다시 표시
    if (onNavigationChange) {
      onNavigationChange(true);
    }

    // 히스토리 정리 - 현재 URL을 /repository로 교체
    navigate("/repository", { replace: true });
  };

  const handleBackFromCommitDetail = () => {
    setShowCommitDetail(false);
    setSelectedCommit(null);
    setSelectedRepo(null);

    // 네비게이션 다시 표시
    if (onNavigationChange) {
      onNavigationChange(true);
    }

    // 히스토리 정리 - 현재 URL을 /repository로 교체
    navigate("/repository", { replace: true });
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
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchRepositories();
            }}
            className="primary-button"
          >
            다시 시도
          </button>
          <button
            onClick={() => navigate("/repository")}
            className="primary-button"
            style={{ marginLeft: "10px" }}
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 커밋 상세 페이지가 표시되어야 하는 경우
  if (showCommitDetail && selectedCommit && selectedRepo) {
    return (
      <div style={{ height: "100vh" }}>
        <CommitDetail
          commit={selectedCommit}
          repository={selectedRepo}
          onBack={handleBackFromCommitDetail}
          user={user}
          onLogout={onLogout}
        />
      </div>
    );
  }

  // 커밋 목록이 표시되어야 하는 경우
  if (showCommitList && selectedRepo) {
    return (
      <div style={{ height: "100vh" }}>
        <CommitList
          repository={selectedRepo}
          onBack={handleBackFromCommits}
          user={user}
          onLogout={onLogout}
        />
      </div>
    );
  }

  return (
    <div className="repository-container">
      <div className="repository-header">
        <h1>저장된 레포지토리</h1>
        <p>
          이미 저장된 레포지토리 중에서 선택하거나 새 레포지토리를 추가하세요.
        </p>
      </div>

      <div className="repository-grid">
        {/* 저장된 레포지토리 카드들 */}
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="repository-card"
            onClick={() => handleRepoSelect(repo)}
          >
            <div className="repo-header">
              <h3>{repo.repositoryFullName || repo.repositoryName}</h3>
              <span
                className={`repo-visibility ${
                  repo.isPrivate ? "private" : "public"
                }`}
              >
                {repo.isPrivate ? "Private" : "Public"}
              </span>
            </div>

            <p className="repo-description">
              {repo.repositoryDescription || "설명이 없습니다."}
            </p>

            <div className="repo-meta">
              <div className="repo-url">
                <a
                  href={repo.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  🔗 GitHub에서 보기
                </a>
              </div>
              <button
                className="delete-repo-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRepository(repo.id);
                }}
                title="레포지토리 삭제"
              >
                🗑️
              </button>
            </div>

            <div className="repo-footer">
              <span className="repo-updated">
                마지막 업데이트:{" "}
                {new Date(repo.repositoryUpdatedAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
        ))}

        {/* 새 레포지토리 추가 카드 */}
        <div
          className="repository-card add-repository-card"
          onClick={handleCreateRepository}
        >
          <div className="add-repository-content">
            <div className="add-icon">+</div>
            <h3>새 레포지토리 추가</h3>
            <p>
              새로운 GitHub 레포지토리를 생성하거나 기존 레포지토리를
              추가하세요.
            </p>
          </div>
        </div>
      </div>

      {repositories.length === 0 && (
        <div className="empty-state">
          <h3>저장된 레포지토리가 없습니다</h3>
          <p>먼저 레포지토리를 저장한 후 다시 시도해주세요.</p>
          <button onClick={handleCreateRepository} className="primary-button">
            새 레포지토리 추가하기
          </button>
        </div>
      )}

      {/* 모달 렌더링 */}
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
