import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRepository.css';

const CreateRepository = () => {
  const [formData, setFormData] = useState({
    selectedRepository: '',
    repositoryType: ''
  });
  const [repositories, setRepositories] = useState([]);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const githubToken = localStorage.getItem('githubToken');
      if (!githubToken) {
        throw new Error('GitHub 토큰이 없습니다.');
      }

      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('레포지토리를 불러오는데 실패했습니다.');
      }

      const repos = await response.json();
      setRepositories(repos);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching repositories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.selectedRepository || !formData.repositoryType) {
        throw new Error('모든 필드를 선택해주세요.');
      }

      const selectedRepo = repositories.find(repo => repo.id.toString() === formData.selectedRepository);
      
      if (!selectedRepo) {
        throw new Error('선택된 레포지토리를 찾을 수 없습니다.');
      }

      // 선택된 레포지토리를 로컬 스토리지에 저장
      localStorage.setItem('selectedRepository', JSON.stringify(selectedRepo));
      
      // 프로젝트 등록 페이지로 이동
      navigate('/register-project');
    } catch (err) {
      setError(err.message);
      console.error('Error selecting repository:', err);
    }
  };

  const handleBackToRepository = () => {
    navigate('/repository');
  };

  return (
    <div className="create-repository-container">
      <div className="create-repository-header">
        <button onClick={handleBackToRepository} className="back-button">
          ← 레포지토리 목록으로 돌아가기
        </button>
                 <div className="header-content">
           <svg className="github-logo" width="98" height="96" xmlns="http://www.w3.org/2000/svg">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#fff"/>
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

                     <div className="dropdowns-container">
             <div className="form-group">
               <select
                 id="selectedRepository"
                 name="selectedRepository"
                 value={formData.selectedRepository}
                 onChange={handleInputChange}
                 required
                 className="form-select repository-select"
               >
                 <option value="">저장소</option>
                 {repositories.map((repo) => (
                   <option key={repo.id} value={repo.id}>
                     {repo.name}
                   </option>
                 ))}
               </select>
             </div>

             <div className="form-group">
               <select
                 id="repositoryType"
                 name="repositoryType"
                 value={formData.repositoryType}
                 onChange={handleInputChange}
                 required
                 className="form-select type-select"
               >
                 <option value="">저장소를 선택하세요</option>
                 <option value="public">Public</option>
                 <option value="private">Private</option>
               </select>
             </div>
           </div>

          
        </form>
      </div>

      
    </div>
  );
};

export default CreateRepository; 