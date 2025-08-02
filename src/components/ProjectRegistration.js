import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Octokit } from '@octokit/rest';
import './ProjectRegistration.css';

const ProjectRegistration = ({ user, githubToken }) => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [branches, setBranches] = useState([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const watchRepoSelection = watch('repoSelection');

  useEffect(() => {
    loadRepositories();
  }, [githubToken]);

  useEffect(() => {
    if (watchRepoSelection === 'existing' && selectedRepo) {
      loadBranches(selectedRepo);
    }
  }, [selectedRepo, watchRepoSelection]);

  const loadRepositories = async () => {
    setIsLoading(true);
    setError('');

    try {
      const octokit = new Octokit({
        auth: githubToken
      });

      const { data: repos } = await octokit.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: 'updated'
      });

      setRepositories(repos);
    } catch (error) {
      console.error('Repository load error:', error);
      setError('리포지토리 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBranches = async (repo) => {
    setIsLoadingBranches(true);
    try {
      const octokit = new Octokit({
        auth: githubToken
      });

      const { data: branches } = await octokit.repos.listBranches({
        owner: repo.owner.login,
        repo: repo.name
      });

      setBranches(branches);
    } catch (error) {
      console.error('Branch load error:', error);
      setError('브랜치 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      let projectData = {
        id: Date.now().toString(),
        name: data.projectName,
        description: data.description,
        createdAt: new Date().toISOString(),
        status: 'active',
        settings: {
          branch: data.branch || 'main',
          watchPaths: data.watchPaths ? data.watchPaths.split(',').map(p => p.trim()) : [],
          webhookEnabled: data.webhookEnabled || false,
          autoComment: data.autoComment || true
        }
      };

      if (data.repoSelection === 'existing' && selectedRepo) {
        projectData.repository = {
          id: selectedRepo.id,
          name: selectedRepo.name,
          fullName: selectedRepo.full_name,
          owner: selectedRepo.owner.login,
          url: selectedRepo.html_url,
          cloneUrl: selectedRepo.clone_url
        };
      } else if (data.repoSelection === 'custom') {
        projectData.repository = {
          url: data.customRepoUrl,
          type: 'custom'
        };
      }

      // 로컬 스토리지에 프로젝트 저장
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      existingProjects.push(projectData);
      localStorage.setItem('projects', JSON.stringify(existingProjects));

      // 웹훅 등록 시뮬레이션 (실제로는 백엔드 API 호출)
      if (data.webhookEnabled && selectedRepo) {
        console.log('Webhook registration for:', selectedRepo.full_name);
        // 실제 구현에서는 백엔드 API를 호출하여 웹훅을 등록합니다
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Project registration error:', error);
      setError('프로젝트 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <div className="project-registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <h1>프로젝트 등록</h1>
          <p>모니터링할 GitHub 리포지토리를 등록하고 설정을 구성하세요.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
          {/* 프로젝트 기본 정보 */}
          <div className="form-section">
            <h2>📋 프로젝트 정보</h2>
            <div className="form-group">
              <label htmlFor="projectName">프로젝트 이름 *</label>
              <input
                type="text"
                id="projectName"
                {...register('projectName', { 
                  required: '프로젝트 이름을 입력해주세요',
                  minLength: {
                    value: 2,
                    message: '프로젝트 이름은 최소 2자 이상이어야 합니다'
                  }
                })}
                placeholder="예: My React App"
              />
              {errors.projectName && <span className="error">{errors.projectName.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">프로젝트 설명</label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                rows="3"
              />
            </div>
          </div>

          {/* 리포지토리 선택 */}
          <div className="form-section">
            <h2>📁 리포지토리 선택</h2>
            <div className="form-group">
              <label>리포지토리 타입</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="existing"
                    {...register('repoSelection', { required: '리포지토리 타입을 선택해주세요' })}
                  />
                  <span className="radio-label">기존 GitHub 리포지토리 선택</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="custom"
                    {...register('repoSelection', { required: '리포지토리 타입을 선택해주세요' })}
                  />
                  <span className="radio-label">직접 URL 입력</span>
                </label>
              </div>
              {errors.repoSelection && <span className="error">{errors.repoSelection.message}</span>}
            </div>

            {watchRepoSelection === 'existing' && (
              <div className="form-group">
                <label htmlFor="repository">GitHub 리포지토리 선택</label>
                {isLoading ? (
                  <div className="loading">리포지토리 목록을 불러오는 중...</div>
                ) : (
                  <div className="repository-list">
                    {repositories.map((repo) => (
                      <div
                        key={repo.id}
                        className={`repository-item ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                        onClick={() => handleRepoSelect(repo)}
                      >
                        <div className="repo-info">
                          <h4>{repo.name}</h4>
                          <p>{repo.full_name}</p>
                          <span className="repo-description">{repo.description || '설명 없음'}</span>
                        </div>
                        <div className="repo-meta">
                          <span className="repo-language">{repo.language || 'Unknown'}</span>
                          <span className="repo-stars">⭐ {repo.stargazers_count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {watchRepoSelection === 'custom' && (
              <div className="form-group">
                <label htmlFor="customRepoUrl">리포지토리 URL</label>
                <input
                  type="url"
                  id="customRepoUrl"
                  {...register('customRepoUrl', { 
                    required: '리포지토리 URL을 입력해주세요',
                    pattern: {
                      value: /^https?:\/\/github\.com\/[^\/]+\/[^\/]+$/,
                      message: '유효한 GitHub 리포지토리 URL을 입력해주세요'
                    }
                  })}
                  placeholder="https://github.com/username/repository"
                />
                {errors.customRepoUrl && <span className="error">{errors.customRepoUrl.message}</span>}
              </div>
            )}
          </div>

          {/* 모니터링 설정 */}
          <div className="form-section">
            <h2>⚙️ 모니터링 설정</h2>
            
            {watchRepoSelection === 'existing' && selectedRepo && (
              <div className="form-group">
                <label htmlFor="branch">모니터링할 브랜치</label>
                {isLoadingBranches ? (
                  <div className="loading">브랜치 목록을 불러오는 중...</div>
                ) : (
                  <select id="branch" {...register('branch')}>
                    {branches.map((branch) => (
                      <option key={branch.name} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="watchPaths">감시할 폴더 경로 (선택사항)</label>
              <input
                type="text"
                id="watchPaths"
                {...register('watchPaths')}
                placeholder="예: src/, components/, utils/"
              />
              <small className="help-text">
                쉼표로 구분하여 여러 경로를 입력할 수 있습니다. 비워두면 전체 프로젝트를 감시합니다.
              </small>
            </div>

            <div className="form-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  {...register('webhookEnabled')}
                />
                <span className="checkbox-label">GitHub 웹훅 등록</span>
              </label>
              <small className="help-text">
                웹훅을 등록하면 코드 변경 시 실시간으로 알림을 받을 수 있습니다.
              </small>
            </div>

            <div className="form-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  defaultChecked
                  {...register('autoComment')}
                />
                <span className="checkbox-label">자동 주석 생성</span>
              </label>
              <small className="help-text">
                코드 변경사항에 대해 AI가 자동으로 주석을 생성합니다.
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="cancel-button"
            >
              취소
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? '등록 중...' : '프로젝트 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectRegistration; 