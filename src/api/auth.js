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