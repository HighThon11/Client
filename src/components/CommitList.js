import React, { useState, useEffect } from "react";
import { getRepositoryCommits, getCommitDetail } from "../api/auth";
import CommitDetail from "./CommitDetail";
import "./CommitList.css";

const CommitList = ({ repository, onBack, user, onLogout }) => {
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

      console.log("🔍 CommitList - 레포지토리 정보:", {
        repositoryName: repository.repositoryName,
        repositoryFullName: repository.repositoryFullName,
        extractedOwner: owner,
        extractedRepo: repo,
        fullName: repository.repositoryFullName,
      });

      console.log("🚀 커밋 목록 조회 시작:", `${owner}/${repo}`);
      const commitsData = await getRepositoryCommits(owner, repo);
      console.log("✅ 커밋 목록 조회 성공:", commitsData.length);
      console.log("📋 커밋 데이터 구조:", commitsData[0]); // 첫 번째 커밋 데이터 구조 확인

      // API 응답 데이터 구조 검증 및 정규화
      const normalizedCommits = commitsData.map((commit) => ({
        sha: commit.sha || commit.commit?.sha || "unknown",
        commit: {
          message:
            commit.commit?.message || commit.message || "커밋 메시지 없음",
          author: {
            name:
              commit.commit?.author?.name || commit.author?.name || "Unknown",
            email: commit.commit?.author?.email || commit.author?.email || "",
            date:
              commit.commit?.author?.date ||
              commit.author?.date ||
              new Date().toISOString(),
          },
        },
        author: {
          login:
            commit.author?.login || commit.commit?.author?.name || "Unknown",
          avatar_url:
            commit.author?.avatar_url ||
            "https://ui-avatars.com/api/?name=Unknown&background=random",
        },
      }));

      console.log("🔧 정규화된 커밋 데이터:", normalizedCommits[0]);
      setCommits(normalizedCommits);
    } catch (err) {
      console.error("❌ 커밋 목록 조회 실패:", err);
      setError(`커밋 목록을 가져오는데 실패했습니다: ${err.message}`);
      setCommits([]); // 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  const handleCommitClick = async (commit) => {
    try {
      setLoading(true);

      // repositoryFullName에서 owner와 repo 추출
      const [owner, repo] = repository.repositoryFullName.split("/");

      console.log(
        "🚀 커밋 상세 조회 시작:",
        commit.sha,
        "from",
        `${owner}/${repo}`
      );
      const commitDetail = await getCommitDetail(owner, repo, commit.sha);
      console.log("✅ 커밋 상세 조회 성공:", commitDetail);

      setSelectedCommit(commitDetail);
      setShowCommitDetail(true);
    } catch (err) {
      console.error("❌ 커밋 상세 조회 실패:", err);
      setError(`커밋 상세 정보를 가져오는데 실패했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCommits = () => {
    setShowCommitDetail(false);
    setSelectedCommit(null);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("날짜 포맷 오류:", error);
      return "날짜 없음";
    }
  };

  const truncateMessage = (message) => {
    if (!message) return "커밋 메시지 없음";
    return message.length > 50 ? message.substring(0, 50) + "..." : message;
  };

  if (showCommitDetail && selectedCommit) {
    return (
      <CommitDetail
        commit={selectedCommit}
        repository={repository}
        onBack={handleBackToCommits}
        user={user}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="commit-list-container">
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
                        {truncateMessage(
                          commit.commit?.message ||
                            commit.message ||
                            "커밋 메시지 없음"
                        )}
                      </h3>
                      <div className="commit-meta">
                        <span className="commit-sha">
                          {commit.sha?.substring(0, 7) || "N/A"}
                        </span>
                        <span className="commit-author">
                          {commit.author?.login ||
                            commit.commit?.author?.name ||
                            commit.author?.name ||
                            "Unknown"}
                        </span>
                        <span className="commit-date">
                          {formatDate(
                            commit.commit?.author?.date ||
                              commit.author?.date ||
                              new Date()
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="commit-avatar">
                      <img
                        src={
                          commit.author?.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            commit.commit?.author?.name ||
                              commit.author?.name ||
                              "Unknown"
                          )}&background=random`
                        }
                        alt={
                          commit.author?.login ||
                          commit.commit?.author?.name ||
                          commit.author?.name ||
                          "Unknown"
                        }
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
