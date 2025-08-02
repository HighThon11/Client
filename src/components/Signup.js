import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Octokit } from '@octokit/rest';
import './Signup.css';

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPatGuide, setShowPatGuide] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // GitHub PAT 검증
      const octokit = new Octokit({
        auth: data.githubToken
      });

      // 사용자 정보 가져오기
      const { data: userData } = await octokit.users.getAuthenticated();
      
      // 리포지토리 목록 가져오기 (repo 권한 확인)
      await octokit.repos.listForAuthenticatedUser({ per_page: 1 });

      // 회원가입 성공 - 사용자 정보와 함께 저장
      const signupData = {
        email: data.email,
        password: data.password, // 실제로는 해시화해야 함
        githubToken: data.githubToken,
        githubUser: userData,
        createdAt: new Date().toISOString()
      };

      onSignup(signupData);
      setSuccess('회원가입이 완료되었습니다! 로그인 화면으로 이동합니다.');
      
      // 2초 후 로그인 화면으로 전환
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      console.error('GitHub PAT 검증 실패:', err);
      if (err.status === 401) {
        setError('GitHub Personal Access Token이 유효하지 않습니다. 토큰을 확인해주세요.');
      } else if (err.status === 403) {
        setError('GitHub Personal Access Token에 repo 권한이 필요합니다.');
      } else {
        setError('GitHub 연결 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>잊은코드</h2>
        <p className="signup-subtitle">회원가입</p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: '이메일을 입력해주세요',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '유효한 이메일 주소를 입력해주세요'
                }
              })}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              {...register('password', { 
                required: '비밀번호를 입력해주세요',
                minLength: {
                  value: 6,
                  message: '비밀번호는 최소 6자 이상이어야 합니다'
                }
              })}
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', { 
                required: '비밀번호를 다시 입력해주세요',
                validate: value => value === watch('password') || '비밀번호가 일치하지 않습니다'
              })}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="githubToken">
              GitHub Personal Access Token
              <button 
                type="button" 
                className="help-btn"
                onClick={() => setShowPatGuide(!showPatGuide)}
              >
                ?
              </button>
            </label>
            <input
              type="password"
              id="githubToken"
              {...register('githubToken', { 
                required: 'GitHub Personal Access Token을 입력해주세요'
              })}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
            {errors.githubToken && <span className="error">{errors.githubToken.message}</span>}
          </div>

          {showPatGuide && (
            <div className="pat-guide">
              <h4>GitHub Personal Access Token 생성 방법:</h4>
              <ol>
                <li>GitHub.com에 로그인</li>
                <li>우측 상단 프로필 → Settings</li>
                <li>좌측 메뉴에서 "Developer settings" 클릭</li>
                <li>"Personal access tokens" → "Tokens (classic)" 클릭</li>
                <li>"Generate new token" → "Generate new token (classic)" 클릭</li>
                <li>Note에 "Code Comment AI" 입력</li>
                <li>Expiration 선택 (권장: 90 days)</li>
                <li>Scopes에서 <strong>"repo"</strong> 체크 (전체 repo 권한)</li>
                <li>"Generate token" 클릭</li>
                <li>생성된 토큰을 복사하여 위에 입력</li>
              </ol>
              <p><strong>⚠️ 주의:</strong> 토큰은 한 번만 표시되므로 안전한 곳에 저장하세요!</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="signup-btn" disabled={isLoading}>
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="login-link">
          <p>
            이미 계정이 있으신가요?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={onSwitchToLogin}
            >
              로그인하기
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 