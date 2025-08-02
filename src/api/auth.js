const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api';

/**
 * 회원가입 API 호출
 * @param {Object} signupData - 회원가입 데이터
 * @returns {Promise<Object>} 회원가입 결과
 */
export const signupUser = async (signupData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(signupData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `회원가입 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('회원가입 API 호출 실패:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw error;
  }
};

/**
 * 로그인 API 호출
 * @param {Object} loginData - 로그인 데이터
 * @returns {Promise<Object>} 로그인 결과
 */
export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(loginData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `로그인 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('로그인 API 호출 실패:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw error;
  }
}; 