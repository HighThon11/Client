import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSavedRepositories,
  deleteSavedRepository,
} from "../api/auth";
import { 
  fetchRepositoryCommits, 
  fetchCommitDetail, 
  generatePreviewComments,
  applyComments,
  updateCommentSession,
  formatTimeAgo 
} from "../api/github";
import CreateRepositoryModal from "./CreateRepositoryModal";
import "./Repository.css";

const Repository = ({ user, githubToken, onLogout, onNavigationChange }) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [commitDetailLoading, setCommitDetailLoading] = useState(false);
  const [previewComments, setPreviewComments] = useState(null);
  const [commentSessionId, setCommentSessionId] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
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
      setCommitsLoading(true);
      setCommits([]);

      console.log("🔍 선택된 레포지토리:", {
        repositoryName: repo.repositoryName,
        repositoryFullName: repo.repositoryFullName,
        repositoryId: repo.id,
      });

      // GitHub 커밋 목록 가져오기
      if (repo.repositoryFullName && githubToken) {
        const [owner, repoName] = repo.repositoryFullName.split('/');
        
        console.log("🚀 GitHub API 호출:", { owner, repoName });
        
        const commitsData = await fetchRepositoryCommits(owner, repoName, githubToken);
        console.log("✅ 커밋 데이터 로딩 완료:", commitsData.length, "개");
        setCommits(commitsData);
      } else {
        console.log("❌ GitHub 토큰 또는 레포지토리 정보 없음");
      }
      
    } catch (error) {
      console.error("❌ 레포지토리 선택 실패:", error);
      setError(`레포지토리 정보를 가져오는데 실패했습니다: ${error.message}`);
    } finally {
      setCommitsLoading(false);
    }
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

  const handleBackToRepository = () => {
    setSelectedRepo(null);
    setCommits([]);
    setSelectedCommit(null);
  };

  const handleCommitClick = async (commit) => {
    try {
      setSelectedCommit(commit);
      setCommitDetailLoading(true);

      console.log("🔍 선택된 커밋:", commit);

      // 커밋 상세 정보 가져오기
      if (selectedRepo.repositoryFullName && githubToken) {
        const [owner, repoName] = selectedRepo.repositoryFullName.split('/');
        
        console.log("🚀 커밋 상세 API 호출:", { owner, repoName, sha: commit.id });
        
        const commitDetail = await fetchCommitDetail(owner, repoName, commit.id, githubToken);
        console.log("✅ 커밋 상세 데이터 로딩 완료:", commitDetail);
        setSelectedCommit(commitDetail);
      }
      
    } catch (error) {
      console.error("❌ 커밋 상세 조회 실패:", error);
      setError(`커밋 상세 정보를 가져오는데 실패했습니다: ${error.message}`);
    } finally {
      setCommitDetailLoading(false);
    }
  };

  const handleBackFromCommitDetail = () => {
    setSelectedCommit(null);
    setPreviewComments(null);
    setCommentSessionId(null);
  };

  const handleGeneratePreviewComments = async () => {
    try {
      setCommentLoading(true);
      setPreviewComments(null);

      console.log("🚀 AI 주석 미리보기 생성 시작");

      if (selectedRepo.repositoryFullName && selectedCommit) {
        const [owner, repoName] = selectedRepo.repositoryFullName.split('/');
        
        // 기본 브랜치는 main으로 설정 (실제로는 프로젝트 설정에서 가져올 수 있음)
        const branch = 'main';
        
        const result = await generatePreviewComments(owner, repoName, selectedCommit.id, branch);
        
        setPreviewComments(result.comments || result);
        setCommentSessionId(result.sessionId);
        
        console.log("✅ AI 주석 미리보기 생성 완료");
      }
      
    } catch (error) {
      console.error("❌ AI 주석 미리보기 생성 실패:", error);
      setError(`AI 주석 생성에 실패했습니다: ${error.message}`);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleApplyComments = async () => {
    try {
      setApplyLoading(true);

      console.log("🚀 AI 주석 적용 시작");

      if (selectedRepo.repositoryFullName && selectedCommit) {
        const [owner, repoName] = selectedRepo.repositoryFullName.split('/');
        
        // 기본 브랜치는 main으로 설정
        const branch = 'main';
        
        const result = await applyComments(owner, repoName, selectedCommit.id, branch);
        
        console.log("✅ AI 주석 적용 완료:", result);
        
        // 성공 메시지 표시
        alert("🎉 AI 주석이 성공적으로 적용되어 GitHub에 푸시되었습니다!");
        
        // 상태 초기화
        setPreviewComments(null);
        setCommentSessionId(null);
      }
      
    } catch (error) {
      console.error("❌ AI 주석 적용 실패:", error);
      setError(`AI 주석 적용에 실패했습니다: ${error.message}`);
    } finally {
      setApplyLoading(false);
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    try {
      console.log("🚀 주석 수정 시작:", { commentId, newContent });

      if (commentSessionId) {
        const result = await updateCommentSession(commentSessionId, {
          commentId,
          content: newContent
        });
        
        console.log("✅ 주석 수정 완료:", result);
        
        // 미리보기 주석 업데이트
        if (previewComments) {
          const updatedComments = previewComments.map(comment => 
            comment.id === commentId 
              ? { ...comment, content: newContent }
              : comment
          );
          setPreviewComments(updatedComments);
        }
      }
      
    } catch (error) {
      console.error("❌ 주석 수정 실패:", error);
      setError(`주석 수정에 실패했습니다: ${error.message}`);
    }
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



  // 커밋 목록이 표시되어야 하는 경우
  if (selectedRepo) {
    return (
      <div className="repository-container">
        <div className="repository-header">
          <button onClick={handleBackToRepository} className="back-button">
            ← 레포지토리 목록
          </button>
          <h1>{selectedRepo.repositoryName}</h1>
          <p>{selectedRepo.repositoryDescription || "설명 없음"}</p>
        </div>

        <div className="commit-layout">
          {/* 왼쪽: 커밋 목록 */}
          <div className="commits-sidebar">
            <h2>● 커밋 히스토리</h2>
            
            {commitsLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>커밋 정보를 불러오는 중...</p>
              </div>
            ) : commits.length === 0 ? (
              <div className="empty-commits">
                <p>커밋 정보를 불러올 수 없습니다.</p>
                <small>GitHub 토큰이 필요하거나 레포지토리 정보가 올바르지 않을 수 있습니다.</small>
              </div>
            ) : (
              <div className="commits-list">
                {commits.slice(0, 10).map((commit) => (
                  <div 
                    key={commit.id} 
                    className={`commit-item ${selectedCommit && selectedCommit.id === commit.id ? 'selected' : ''}`} 
                    onClick={() => handleCommitClick(commit)}
                  >
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
                  </div>
                ))}
                
                {commits.length > 10 && (
                  <div className="more-commits">
                    <a 
                      href={`https://github.com/${selectedRepo.repositoryFullName}/commits`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      더 많은 커밋 보기 →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 오른쪽: 커밋 상세 정보 */}
          <div className="commit-detail-panel">
            {selectedCommit && selectedCommit.files ? (
              <>
                <div className="commit-detail-header">
                  <div className="commit-detail-info">
                    <h2>Commit {selectedCommit.sha}</h2>
                    <p className="commit-detail-message">{selectedCommit.message}</p>
                                          <div className="commit-detail-meta">
                        <div className="commit-author">
                          {selectedCommit.avatar && (
                            <img 
                              src={selectedCommit.avatar} 
                              alt={selectedCommit.author} 
                              className="author-avatar"
                            />
                          )}
                          <span className="author-name">{selectedCommit.author}</span>
                          <span className="commit-time">{formatTimeAgo(selectedCommit.date)}</span>
                        </div>
                      </div>
                  </div>
                  <a 
                    href={selectedCommit.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="github-link"
                  >
                    GitHub에서 보기 →
                  </a>
                </div>

                                 {commitDetailLoading ? (
                   <div className="loading-spinner">
                     <div className="spinner"></div>
                     <p>커밋 상세 정보를 불러오는 중...</p>
                   </div>
                 ) : (
                   <>
                     <div className="commit-files">
                       <h3>변경된 파일 ({selectedCommit.files.length}개)</h3>
                       {selectedCommit.files.map((file, index) => (
                         <div key={index} className="commit-file">
                           <div className="file-header">
                             <span className="file-name">{file.filename}</span>
                             <div className="file-stats">
                               <span className={`file-status ${file.status}`}>{file.status}</span>
                               {file.additions > 0 && <span className="additions">+{file.additions}</span>}
                               {file.deletions > 0 && <span className="deletions">-{file.deletions}</span>}
                             </div>
                           </div>
                           {file.patch && (
                             <details className="file-diff">
                               <summary>변경사항 보기</summary>
                               <pre className="diff-content">{file.patch}</pre>
                             </details>
                           )}
                         </div>
                       ))}
                     </div>

                     {/* AI 주석 섹션 */}
                     <div className="ai-comments-section">
                       <div className="ai-comments-header">
                         <h3>AI 주석</h3>
                         {!previewComments && (
                           <button 
                             onClick={handleGeneratePreviewComments}
                             disabled={commentLoading}
                             className="generate-comments-btn"
                           >
                             {commentLoading ? '생성 중...' : 'AI 주석 미리보기 생성'}
                           </button>
                         )}
                       </div>

                       {commentLoading && (
                         <div className="loading-spinner">
                           <div className="spinner"></div>
                           <p>AI 주석을 생성하는 중...</p>
                         </div>
                       )}

                       {previewComments && (
                         <div className="preview-comments">
                           <div className="comments-list">
                             {previewComments.map((comment, index) => (
                               <div key={comment.id || index} className="comment-item">
                                 <div className="comment-header">
                                   <span className="comment-file">{comment.fileName || comment.filename}</span>
                                   <span className="comment-line">라인 {comment.lineNumber || comment.line}</span>
                                 </div>
                                 <div className="comment-content">
                                   <textarea
                                     value={comment.content}
                                     onChange={(e) => handleUpdateComment(comment.id, e.target.value)}
                                     className="comment-textarea"
                                     placeholder="주석 내용을 입력하세요..."
                                   />
                                 </div>
                               </div>
                             ))}
                           </div>
                           
                           <div className="comments-actions">
                             <button 
                               onClick={handleApplyComments}
                               disabled={applyLoading}
                               className="apply-comments-btn"
                             >
                               {applyLoading ? '적용 중...' : '주석 적용해서 커밋 후 푸시하기'}
                             </button>
                           </div>
                         </div>
                       )}
                     </div>
                   </>
                 )}
              </>
            ) : (
              <div className="no-selection">
                <div className="no-selection-content">
                  <h3>커밋을 선택하세요</h3>
                  <p>왼쪽에서 커밋을 선택하면 상세 정보를 볼 수 있습니다.</p>
                </div>
              </div>
            )}
          </div>
        </div>
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
