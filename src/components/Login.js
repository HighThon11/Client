import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginUser } from '../api/auth';
import './Login.css';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      // 서버 API에 로그인 요청
      const loginResult = await loginUser({
        email: data.email,
        password: data.password
      });

      // 로그인 성공 - 서버 응답 구조에 맞게 수정
      console.log('로그인 응답:', loginResult);
      
      // 서버에서 받은 토큰들을 사용하여 사용자 정보 생성
      const userData = {
        id: 1, // 서버에서 사용자 ID를 받아야 함
        login: data.email.split('@')[0], // 임시로 이메일에서 추출
        name: data.email.split('@')[0], // 임시로 이메일에서 추출
        email: data.email,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.email.split('@')[0])}&background=random`,
        html_url: `https://github.com/${data.email.split('@')[0]}`
      };
      
      // 토큰과 사용자 정보를 함께 전달
      onLogin(userData, loginResult.githubToken, loginResult.token);
    } catch (err) {
      console.error('로그인 실패:', err);
      setError(err.message || '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
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
            <path className="cls-1" d="M92.48,42.3v32.26h-2.57v2.78h-2.48v2.52h-2.57v2.44h-2.48v2.43h-2.66v2.87h-33.95v-2.87h-2.57v-2.43h-2.48v-2.44h-2.57v-2.52h-2.48v-2.78h-2.57v-32.26h2.57v-2.7h2.48v-2.61h2.57v-2.35h2.48v-2.43h2.57v-2.44h33.95v2.44h2.66v2.43h2.48v2.35h2.57v2.61h2.48v2.7h2.57ZM75.68,49.17h-1.93v-1.91h-1.74v-1.91h-18.17v1.91h-1.83v1.91h-2.11v19.22h2.11v1.74h1.83v1.91h18.17v-1.91h1.74v-1.74h1.93v-19.22Z"/>
            <path className="cls-1" d="M147.44,55.26v2.52h2.75v2.52h2.75v2.61h2.84v2.52h2.75v2.52h2.75v2.61h2.75v2.43h2.84v9.83h-2.84v2.26h-2.75v2.52h-6.42v-2.52h-2.84v-2.52h-2.75v-2.61h-2.75v-2.52h-2.84v-2.52h-2.75v-2.61h-2.75v-2.52h-3.85v2.52h-2.84v2.61h-2.75v2.52h-2.75v2.52h-2.84v2.61h-2.75v2.52h-2.75v2.52h-6.52v-2.52h-2.75v-2.26h-2.75v-9.83h2.75v-2.43h2.75v-2.61h2.84v-2.52h2.75v-2.52h2.75v-2.61h2.75v-2.52h2.84v-2.52h2.02v-9.74h-17.53v-2.87h-3.03v-9.74h3.03v-2.87h53.41v2.87h3.03v9.74h-3.03v2.87h-17.44v9.74h1.93Z"/>
            <path className="cls-1" d="M36.13,152.57v-2.87h-3.03v-9.83h3.03v-2.87h36.89v-7.91h-36.89v-2.87h-3.03v-9.83h3.03v-2.87h52.12v2.87h3.03v50.96h-3.03v2.87h-12.21v-2.87h-3.03v-14.78h-36.89Z"/>
            <path className="cls-1" d="M162.58,116.22h3.03v9.83h-3.03v2.87h-37.81v25.74h37.81v2.87h3.03v9.83h-3.03v2.87h-52.12v-2.87h-3.03v-51.13h3.03v-2.87h52.12v2.87Z"/>
          </svg>
        </h2>
        <p className="login-title">로그인</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
              placeholder="E-mail"
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
              placeholder="password"
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="signup-link">
          <p>
            계정이 없으신가요?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={onSwitchToSignup}
            >
              회원가입하기
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 