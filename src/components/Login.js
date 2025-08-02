import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Login.css';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      // Local Storage에서 사용자 정보 확인
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === data.email && u.password === data.password);

      if (user) {
        // 로그인 성공 - 저장된 GitHub 정보 사용
        onLogin(user.githubUser, user.githubToken);
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('로그인 실패:', err);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>잊은 코드</h2>
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