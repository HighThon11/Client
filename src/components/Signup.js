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
        <h2>
          <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>
                {`
                  .cls-1 {
                    fill: #fff;
                  }
                `}
              </style>
            </defs>
            <path class="cls-1" d="M92.48,42.3v32.26h-2.57v2.78h-2.48v2.52h-2.57v2.44h-2.48v2.43h-2.66v2.87h-33.95v-2.87h-2.57v-2.43h-2.48v-2.44h-2.57v-2.52h-2.48v-2.78h-2.57v-32.26h2.57v-2.7h2.48v-2.61h2.57v-2.35h2.48v-2.43h2.57v-2.44h33.95v2.44h2.66v2.43h2.48v2.35h2.57v2.61h2.48v2.7h2.57ZM75.68,49.17h-1.93v-1.91h-1.74v-1.91h-18.17v1.91h-1.83v1.91h-2.11v19.22h2.11v1.74h1.83v1.91h18.17v-1.91h1.74v-1.74h1.93v-19.22Z"/>
            <path class="cls-1" d="M147.44,55.26v2.52h2.75v2.52h2.75v2.61h2.84v2.52h2.75v2.52h2.75v2.61h2.75v2.43h2.84v9.83h-2.84v2.26h-2.75v2.52h-6.42v-2.52h-2.84v-2.52h-2.75v-2.61h-2.75v-2.52h-2.84v-2.52h-2.75v-2.61h-2.75v-2.52h-3.85v2.52h-2.84v2.61h-2.75v2.52h-2.75v2.52h-2.84v2.61h-2.75v2.52h-2.75v2.52h-6.52v-2.52h-2.75v-2.26h-2.75v-9.83h2.75v-2.43h2.75v-2.61h2.84v-2.52h2.75v-2.52h2.75v-2.61h2.75v-2.52h2.84v-2.52h2.02v-9.74h-17.53v-2.87h-3.03v-9.74h3.03v-2.87h53.41v2.87h3.03v9.74h-3.03v2.87h-17.44v9.74h1.93Z"/>
            <path class="cls-1" d="M36.13,152.57v-2.87h-3.03v-9.83h3.03v-2.87h36.89v-7.91h-36.89v-2.87h-3.03v-9.83h3.03v-2.87h52.12v2.87h3.03v50.96h-3.03v2.87h-12.21v-2.87h-3.03v-14.78h-36.89Z"/>
            <path class="cls-1" d="M162.58,116.22h3.03v9.83h-3.03v2.87h-37.81v25.74h37.81v2.87h3.03v9.83h-3.03v2.87h-52.12v-2.87h-3.03v-51.13h3.03v-2.87h52.12v2.87Z"/>
          </svg>
        </h2>
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
            <div className="label-container">
              <label htmlFor="githubToken">GitHub Personal Access Token</label>
              <button 
                type="button" 
                className="help-btn"
                onClick={() => setShowPatGuide(!showPatGuide)}
              >
                ?
              </button>
            </div>
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
    </div>
  );
};

export default Signup; 