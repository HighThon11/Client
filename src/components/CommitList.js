import React, { useState, useEffect } from "react";
import { getRepositoryCommits, getCommitDetail } from "../api/auth";
import CommitDetail from "./CommitDetail";
import "./CommitList.css";

const CommitList = ({ repository, onBack }) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [showCommitDetail, setShowCommitDetail] = useState(false);

  useEffect(() => {
    fetchCommits();
  }, [repository]);

  const fetchCommits = async () => {
    try {
      setLoading(true);
      setError(null);

      // repositoryFullName에서 owner와 repo 추출
      const [owner, repo] = repository.repositoryFullName.split("/");

      console.log("🚀 커밋 목록 조회 시작:", `${owner}/${repo}`);
      const commitsData = await getRepositoryCommits(owner, repo);
      console.log("✅ 커밋 목록 조회 성공:", commitsData.length);

      setCommits(commitsData);
    } catch (err) {
      console.error("❌ 커밋 목록 조회 실패:", err);
      setError("커밋 목록을 가져오는데 실패했습니다.");

      // 더미 데이터 사용
      const dummyCommits = [
        {
          sha: "abc123def456",
          commit: {
            message: "Initial commit",
            author: {
              name: "John Doe",
              email: "john@example.com",
              date: new Date().toISOString(),
            },
          },
          author: {
            login: "johndoe",
            avatar_url:
              "https://ui-avatars.com/api/?name=John+Doe&background=random",
          },
        },
        {
          sha: "def456ghi789",
          commit: {
            message: "Add README file",
            author: {
              name: "John Doe",
              email: "john@example.com",
              date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          author: {
            login: "johndoe",
            avatar_url:
              "https://ui-avatars.com/api/?name=John+Doe&background=random",
          },
        },
        {
          sha: "ghi789jkl012",
          commit: {
            message: "Fix bug in login component",
            author: {
              name: "John Doe",
              email: "john@example.com",
              date: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          },
          author: {
            login: "johndoe",
            avatar_url:
              "https://ui-avatars.com/api/?name=John+Doe&background=random",
          },
        },
      ];
      setCommits(dummyCommits);
    } finally {
      setLoading(false);
    }
  };

  const handleCommitClick = async (commit) => {
    try {
      setLoading(true);

      // repositoryFullName에서 owner와 repo 추출
      const [owner, repo] = repository.repositoryFullName.split("/");

      console.log("🚀 커밋 상세 조회 시작:", commit.sha);
      const commitDetail = await getCommitDetail(owner, repo, commit.sha);
      console.log("✅ 커밋 상세 조회 성공:", commitDetail);

      setSelectedCommit(commitDetail);
      setShowCommitDetail(true);
    } catch (err) {
      console.error("❌ 커밋 상세 조회 실패:", err);
      setError("커밋 상세 정보를 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCommits = () => {
    setShowCommitDetail(false);
    setSelectedCommit(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateMessage = (message) => {
    return message.length > 50 ? message.substring(0, 50) + "..." : message;
  };

  if (showCommitDetail && selectedCommit) {
    return (
      <CommitDetail
        commit={selectedCommit}
        repository={repository}
        onBack={handleBackToCommits}
      />
    );
  }

  return (
    <div className="commit-list-container">
      <div className="commit-list-header">
        <button onClick={onBack} className="back-button">
          ← 레포지토리 목록으로 돌아가기
        </button>
        <h1>{repository.repositoryName} - 커밋 목록</h1>
        <p>레포지토리의 커밋 기록을 확인하세요.</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>커밋 목록을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchCommits} className="retry-button">
            다시 시도
          </button>
        </div>
      ) : (
        <div className="commits-container">
          {commits.length === 0 ? (
            <div className="empty-state">
              <h3>커밋이 없습니다</h3>
              <p>이 레포지토리에는 아직 커밋이 없습니다.</p>
            </div>
          ) : (
            <div className="commits-list">
              {commits.map((commit) => (
                <div
                  key={commit.sha}
                  className="commit-card"
                  onClick={() => handleCommitClick(commit)}
                >
                  <div className="commit-header">
                    <div className="commit-info">
                      <h3 className="commit-message">
                        {truncateMessage(commit.commit.message)}
                      </h3>
                      <div className="commit-meta">
                        <span className="commit-sha">
                          {commit.sha.substring(0, 7)}
                        </span>
                        <span className="commit-author">
                          {commit.author?.login || commit.commit.author.name}
                        </span>
                        <span className="commit-date">
                          {formatDate(commit.commit.author.date)}
                        </span>
                      </div>
                    </div>
                    <div className="commit-avatar">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommitList;
