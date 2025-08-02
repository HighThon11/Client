/**
 * Local Storage를 사용하는 프로토타입 인증 시스템
 * 실제 서버 없이도 작동하도록 구현
 */

/**
 * 회원가입 (Local Storage 사용)
 * @param {Object} signupData - 회원가입 데이터
 * @returns {Promise<Object>} 회원가입 결과
 */
export const signupUser = async (signupData) => {
  try {
    // 기존 사용자 확인
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = existingUsers.find(user => user.email === signupData.email);
    
    if (existingUser) {
      throw new Error('이미 등록된 이메일입니다.');
    }

    // GitHub PAT 검증 (간단한 형식 검증)
    // if (!signupData.githubToken || signupData.githubToken.length < 10) {
    //   throw new Error('유효한 GitHub Personal Access Token을 입력해주세요.');
    // }

    // 새 사용자 생성
    const newUser = {
      id: Date.now().toString(),
      email: signupData.email,
      password: signupData.password, // 실제로는 해시화해야 함
      // githubToken: signupData.githubToken,
      createdAt: new Date().toISOString()
    };

    // Local Storage에 저장
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // 성공 응답 (비밀번호 제외)
    const { password, ...userWithoutPassword } = newUser;
    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

/**
 * 로그인 (Local Storage 사용)
 * @param {Object} loginData - 로그인 데이터
 * @returns {Promise<Object>} 로그인 결과
 */
export const loginUser = async (loginData) => {
  try {
    // 저장된 사용자 목록 가져오기
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 로그인 성공 시 세션 정보 저장
    const sessionData = {
      userId: user.id,
      email: user.email,
      // githubToken: user.githubToken,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(sessionData));

    // 성공 응답 (비밀번호 제외)
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      message: '로그인되었습니다.',
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

/**

 * 로그아웃
 */
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  return { success: true, message: '로그아웃되었습니다.' };
};

/**
 * 현재 로그인된 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보 또는 null
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    return null;
  }
};

/**
 * 사용자 인증 상태 확인
 * @returns {boolean} 인증 상태
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
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
      { id: 1, name: 'dummy-repo-1' },
      { id: 2, name: 'dummy-repo-2' },
    ];
  }

  // 실제 GitHub API 호출 (axios 사용 예시)
  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('GitHub API 오류:', error);
    return [];
  }
};

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
  };