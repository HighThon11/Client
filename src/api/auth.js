const API_BASE_URL = 'http://10.10.6.74:8081/api';

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

/**
 * GitHub 레포지토리 목록 조회 API 호출
 * @param {string} token - 인증 토큰
 * @returns {Promise<Array>} 레포지토리 목록
 */
export const getGitHubRepositories = async (token) => {
  // 더미 토큰인 경우 더미 데이터 사용
  if (token === 'dummy-github-token-12345') {
    console.log('🧪 더미 토큰 감지 - 더미 데이터 사용 중...');
    return [
      {
        id: 1,
        name: 'my-react-app',
        description: 'React로 만든 웹 애플리케이션',
        private: false,
        language: 'JavaScript',
        stargazers_count: 5,
        forks_count: 2,
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'api-service',
        description: 'Node.js API 서버',
        private: true,
        language: 'JavaScript',
        stargazers_count: 3,
        forks_count: 1,
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        name: 'portfolio-website',
        description: '개인 포트폴리오 웹사이트',
        private: false,
        language: 'HTML',
        stargazers_count: 8,
        forks_count: 4,
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
  


  try {
    console.log('🔍 API 요청 시작:', `${API_BASE_URL}/github/repositories`);
    console.log('🔑 토큰 존재 여부:', !!token);
    
    const response = await fetch(`${API_BASE_URL}/github/repositories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      mode: 'cors',
      credentials: 'omit'
    });

    console.log('📡 API 응답 상태:', response.status, response.statusText);
    console.log('📡 API 응답 헤더:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API 에러 응답:', errorData);
      throw new Error(errorData.message || `레포지토리 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API 응답 데이터:', data);
    return data;
  } catch (error) {
    console.error('❌ GitHub 레포지토리 API 호출 실패:', error);
    console.error('❌ 에러 타입:', error.name);
    console.error('❌ 에러 메시지:', error.message);
    
    // API 연결 실패 시에도 더미 데이터 반환 (프론트엔드 테스트용)
    console.log('🔄 API 연결 실패 - 더미 데이터로 대체...');
    return [
      {
        id: 1,
        name: 'my-react-app',
        description: 'React로 만든 웹 애플리케이션',
        private: false,
        language: 'JavaScript',
        stargazers_count: 5,
        forks_count: 2,
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'api-service',
        description: 'Node.js API 서버',
        private: true,
        language: 'JavaScript',
        stargazers_count: 3,
        forks_count: 1,
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        name: 'portfolio-website',
        description: '개인 포트폴리오 웹사이트',
        private: false,
        language: 'HTML',
        stargazers_count: 8,
        forks_count: 4,
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
}; 