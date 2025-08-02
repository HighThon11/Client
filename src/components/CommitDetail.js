import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Octokit } from '@octokit/rest';
import './CommitDetail.css';

const CommitDetail = ({ user, githubToken, onLogout }) => {
  const { commitId } = useParams();
  const [commitData, setCommitData] = useState(null);
  const [commitHistory, setCommitHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [githubUser, setGithubUser] = useState(null);
  useEffect(() => {
    if (githubToken) {
      const octokitInstance = new Octokit({
        auth: githubToken
      });
      loadGithubUser(octokitInstance);
      loadCommitHistory();
    }
    loadCommitData();
  }, [commitId, githubToken]);

  const loadGithubUser = async (octokitInstance) => {
    try {
      const { data: userData } = await octokitInstance.rest.users.getAuthenticated();
      setGithubUser(userData);
    } catch (error) {
      console.error('GitHub user load error:', error);
    }
  };

  const loadCommitHistory = async () => {
    try {
      // 실제 프로젝트 정보는 나중에 동적으로 가져와야 함
      // 현재는 임시로 하드코딩된 값 사용
      const owner = 'username'; // 실제 사용자명으로 변경 필요
      const repo = 'project-name'; // 실제 레포지토리명으로 변경 필요
      
      const response = await fetch(`http://10.10.6.74:8081/api/github/repositories/${owner}/${repo}/commits`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const commits = await response.json();
      setCommitHistory(commits);
    } catch (error) {
      console.error('Commit history load error:', error);
      // API 호출 실패 시 임시 데이터 사용
      const mockCommits = [
        {
          sha: 'c385319',
          commit: {
            message: 'refactor: mbti 조치방식 변경',
            author: {
              name: 'username',
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        },
        {
          sha: 'c385318',
          commit: {
            message: 'feat: 새로운 기능 추가',
            author: {
              name: 'username',
              date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        },
        {
          sha: 'c385317',
          commit: {
            message: 'fix: 버그 수정',
            author: {
              name: 'username',
              date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        },
        {
          sha: 'c385316',
          commit: {
            message: 'docs: 문서 업데이트',
            author: {
              name: 'username',
              date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        }
      ];
      setCommitHistory(mockCommits);
    }
  };

  const loadCommitData = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 임시 데이터 (나중에 실제 API로 교체)
      const mockCommitData = {
        id: commitId,
        message: "refactor: mbti 조치방식 변경",
        author: "username",
        date: "2025-08-02",
        parent: "05b9a36",
        filesChanged: 2,
        linesChanged: { added: 7, deleted: 8 },
        files: [
          {
            path: "src/main/java/com/tina/tina_server/domain/mbti/domain/repository/MbtiCompatibilityRepository.java",
            changes: [
              { type: 'deleted', line: 8, content: 'Optional<MbtiCompatibility> findByFirstMbtiAndSecondMbti(String firstMbti, String secondMbti);' },
              { type: 'added', line: 8, content: 'Optional<MbtiCompatibility> findByFirstMbtiAndSecondMbti(' },
              { type: 'added', line: 9, content: '    String firstMbti,' },
              { type: 'added', line: 10, content: '    String secondMbti' },
              { type: 'added', line: 11, content: ');' }
            ]
          },
          {
            path: "src/main/java/com/tina/tina_server/domain/mbti/service/implementation/MbtiReader.java",
            changes: [
              { type: 'added', line: 13, content: 'public class MbtiReader {' },
              { type: 'added', line: 14, content: '    private final MbtiCompatibilityRepository mbtiCompatibilityRepository;' }
            ]
          }
        ]
      };

      setCommitData(mockCommitData);
    } catch (error) {
      console.error('Commit data load error:', error);
      setError('커밋 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeTypeIcon = (type) => {
    switch (type) {
      case 'added':
        return '➕';
      case 'deleted':
        return '➖';
      case 'modified':
        return '✏️';
      default:
        return '📝';
    }
  };

  const getChangeTypeClass = (type) => {
    switch (type) {
      case 'added':
        return 'added';
      case 'deleted':
        return 'deleted';
      case 'modified':
        return 'modified';
      default:
        return '';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'today';
    } else if (diffInDays === 1) {
      return '1d ago';
    } else {
      return `${diffInDays}d ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="commit-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>커밋 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="commit-detail-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="commit-detail-container">
      {/* 상단 헤더 */}
      <div className="top-header">
        <div className="header-left">
          <div className="logo">
            <svg width="60" height="60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <style>
                  {`
                    .cls-1 {
                      fill: #fff;
                    }
                  `}
                </style>
              </defs>
              <path className="cls-1" d="M92.48,42.3v32.26h-2.57v2.78h-2.48v2.52h-2.57v2.44h-2.48v2.43h-2.66v2.87h-33.95v-2.87h-2.57v-2.43h-2.48v-2.44h-2.57v-2.52h-2.48v-2.78h-2.57v-32.26h2.57v-2.7h2.48v-2.61h2.57v-2.35h2.48v-2.43h2.57v-2.44h33.95v2.44h2.66v2.43h2.48v2.35h2.57v2.61h2.48v2.7h2.57ZM75.68,49.17h-1.93v-1.91h-1.74v-1.91h-18.17v1.91h-1.83v1.91h-2.11v19.22h2.11v1.74h1.83v1.91h18.17v-1.91h1.74v-1.74h1.93v-19.22Z"/>
              <path className="cls-1" d="M147.44,55.26v2.52h2.75v2.52h2.75v2.61h2.84v2.52h2.75v2.52h2.75v2.61h2.75v2.43h2.84v9.83h-2.84v2.26h-2.75v2.52h-6.42v-2.52h-2.84v-2.52h-2.75v-2.61h-2.75v-2.52h-2.84v-2.52h-2.75v-2.61h-2.75v-2.52h-3.85v2.52h-2.84v2.61h-2.75v2.52h-2.75v2.52h-2.84v2.61h-2.75v2.52h-2.75v2.52h-6.52v-2.52h-2.75v-2.26h-2.75v-9.83h2.75v-2.43h2.75v-2.61h2.84v-2.52h2.75v-2.52h2.75v-2.61h2.75v-2.52h2.84v-2.52h2.02v-9.74h-17.53v-2.87h-3.03v-9.74h3.03v-2.87h53.41v2.87h3.03v9.74h-3.03v2.87h-17.44v9.74h1.93Z"/>
              <path className="cls-1" d="M36.13,152.57v-2.87h-3.03v-9.83h3.03v-2.87h36.89v-7.91h-36.89v-2.87h-3.03v-9.83h3.03v-2.87h52.12v2.87h3.03v50.96h-3.03v2.87h-12.21v-2.87h-3.03v-14.78h-36.89Z"/>
              <path className="cls-1" d="M162.58,116.22h3.03v9.83h-3.03v2.87h-37.81v25.74h37.81v2.87h3.03v9.83h-3.03v2.87h-52.12v-2.87h-3.03v-51.13h3.03v-2.87h52.12v2.87Z"/>
            </svg>
          </div>
        </div>
                 <div className="header-right">
           <span className="project-name">프로젝트</span>
           <span className="username">{githubUser?.login || user?.name || user?.login || '사용자'}</span>
           <button className="logout-btn" onClick={onLogout}>로그아웃</button>
         </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        {/* 왼쪽 사이드바 - 커밋 히스토리 */}
        <div className="sidebar">
          <div className="commit-history">
            <h3>커밋 히스토리</h3>
                         <div className="commit-list">
               {commitHistory.map((commit, index) => (
                 <div 
                   key={commit.sha} 
                   className={`commit-item ${commit.sha === commitId ? 'active' : ''}`}
                   onClick={() => {
                     // 커밋 클릭 시 해당 커밋의 상세 정보 로드
                     window.history.pushState(null, '', `/commit/${commit.sha}`);
                     // URL 파라미터가 변경되므로 useEffect가 다시 실행됨
                   }}
                 >
                   <div className="commit-info">
                     <div className="commit-message">{commit.commit.message}</div>
                     <div className="commit-meta">
                       <span className="commit-id">{commit.sha.substring(0, 7)}</span>
                       <span className="commit-time">{getTimeAgo(commit.commit.author.date)}</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* 오른쪽 메인 영역 - 코드 변경사항 */}
        <div className="main-area">
          <div className="commit-detail">
            <div className="commit-header">
              <h1>Commit {commitData.id}</h1>
              <div className="commit-link">
                <span>🔗</span>
                <span>GitHub - {commitData.author}/Commit {commitData.id}</span>
              </div>
            </div>

            <div className="commit-message">
              <h2>{commitData.message}</h2>
              <button className="deploy-btn">deploy (#15)</button>
              <div className="commit-parent">
                <span>1 parent {commitData.parent} commit {commitData.id}</span>
                <button className="copy-btn">📋</button>
              </div>
            </div>

            <div className="file-changes">
              <div className="changes-header">
                <div className="search-bar">
                  <input type="text" placeholder="Q Filter files..." />
                </div>
                <div className="changes-summary">
                  <span>{commitData.filesChanged} files changed</span>
                  <span>+{commitData.linesChanged.added} -{commitData.linesChanged.deleted} lines changed</span>
                </div>
                <div className="search-bar">
                  <input type="text" placeholder="Q Search within code" />
                </div>
              </div>

              <div className="changes-content">
                {/* 파일 트리 */}
                <div className="file-tree">
                  <div className="tree-item">
                    <span>📁</span>
                    <span>src/main/java/com/tina/tina...</span>
                  </div>
                  <div className="tree-item">
                    <span>📁</span>
                    <span>domain/repository</span>
                    <div className="tree-subitem">
                      <span>📄</span>
                      <span>MbtiCompatibilityRepository.java</span>
                    </div>
                  </div>
                  <div className="tree-item">
                    <span>📁</span>
                    <span>service/implementation</span>
                    <div className="tree-subitem">
                      <span>📄</span>
                      <span>MbtiReader.java</span>
                    </div>
                  </div>
                </div>

                {/* 코드 변경사항 */}
                <div className="code-diff">
                  {commitData.files.map((file, fileIndex) => (
                    <div key={fileIndex} className="file-diff">
                      <div className="file-path">{file.path}</div>
                      <div className="diff-summary">@@ -5,5 +5,8 @@</div>
                      <div className="code-changes">
                        {file.changes.map((change, changeIndex) => (
                          <div key={changeIndex} className={`code-line ${getChangeTypeClass(change.type)}`}>
                            <span className="line-number">{change.line}</span>
                            <span className="change-icon">{getChangeTypeIcon(change.type)}</span>
                            <span className="code-content">{change.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="commit-actions">
              <button className="apply-comments-btn">
                주석 적용해서 커밋 후 푸시하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitDetail; 