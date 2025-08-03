const API_BASE_URL = "http://10.10.6.74:8081/api";
// // 변수 선언

/**
 * 회원가입 API 호출
 * @param {Object} signupData - 회원가입 데이터
 * @returns {Promise<Object>} 회원가입 결과
 */
export const signupUser = async (signupData) => {
  // // 새로운 함수 정의
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      // // 변수 선언
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "omit",
      body: JSON.stringify(signupData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // // 새로운 함수 정의
      throw new Error(errorData.message || `회원가입 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("회원가입 API 호출 실패:", error);
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
      );
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
  // // 새로운 함수 정의
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      // // 변수 선언
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "omit",
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // // 새로운 함수 정의
      throw new Error(errorData.message || `로그인 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("로그인 API 호출 실패:", error);
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
      );
    }
    throw error;
  }
};

/**
 * GitHub 레포지토리 목록 조회 API 호출
 * @returns {Promise<Array>} 레포지토리 목록
 */
export const getGitHubRepositories = async () => {
  // // 새로운 함수 정의
  // 로컬 스토리지에서 JWT 토큰 가져오기
  const serverToken = localStorage.getItem("serverToken");

  if (!serverToken) {
    console.error("❌ JWT 토큰이 없습니다.");
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  // 더미 토큰인 경우 더미 데이터 사용
  const githubToken = localStorage.getItem("githubToken");
  if (githubToken === "dummy-github-token-12345") {
    console.log("🧪 더미 토큰 감지 - 더미 데이터 사용 중...");
    return [
      {
        id: 1,
        name: "my-react-app",
        description: "React로 만든 웹 애플리케이션",
        private: false,
        language: "JavaScript",
        stargazers_count: 5,
        forks_count: 2,
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "api-service",
        description: "Node.js API 서버",
        private: true,
        language: "JavaScript",
        stargazers_count: 3,
        forks_count: 1,
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        name: "portfolio-website",
        description: "개인 포트폴리오 웹사이트",
        private: false,
        language: "HTML",
        stargazers_count: 8,
        forks_count: 4,
        updated_at: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ];
  }

  try {
    console.log("🔍 API 요청 시작:", `${API_BASE_URL}/github/repositories`);
    console.log("🔑 JWT 토큰 존재 여부:", !!serverToken);

    const response = await fetch(`${API_BASE_URL}/github/repositories`, {
      // // 변수 선언
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${serverToken}`,
      },
      mode: "cors",
      credentials: "omit",
    });

    console.log("📡 API 응답 상태:", response.status, response.statusText);
    console.log(
      "📡 API 응답 헤더:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // // 새로운 함수 정의
      console.error("❌ API 에러 응답:", errorData);
      throw new Error(
        errorData.message || `레포지토리 조회 실패: ${response.status}`
      );
    }

    const data = await response.json();
    // // 변수 선언
    console.log("✅ API 응답 데이터:", data);
    return data;
  } catch (error) {
    console.error("❌ GitHub 레포지토리 API 호출 실패:", error);
    console.error("❌ 에러 타입:", error.name);
    console.error("❌ 에러 메시지:", error.message);

    // API 연결 실패 시에도 더미 데이터 반환 (프론트엔드 테스트용)
    console.log("🔄 API 연결 실패 - 더미 데이터로 대체...");
    return [
      {
        id: 1,
        name: "my-react-app",
        description: "React로 만든 웹 애플리케이션",
        private: false,
        language: "JavaScript",
        stargazers_count: 5,
        forks_count: 2,
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "api-service",
        description: "Node.js API 서버",
        private: true,
        language: "JavaScript",
        stargazers_count: 3,
        forks_count: 1,
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        name: "portfolio-website",
        description: "개인 포트폴리오 웹사이트",
        private: false,
        language: "HTML",
        stargazers_count: 8,
        forks_count: 4,
        updated_at: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ];
  }
};

/**
 * 저장된 레포지토리 목록 조회 API 호출
 * @returns {Promise<Array>} 저장된 레포지토리 목록
 */
export const getSavedRepositories = async () => {
  // // 새로운 함수 정의
  // 로컬 스토리지에서 JWT 토큰 가져오기
  const serverToken = localStorage.getItem("serverToken");

  if (!serverToken) {
    console.error("❌ JWT 토큰이 없습니다.");
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  try {
    console.log(
      "🔍 저장된 레포지토리 조회 시작:",
      `${API_BASE_URL}/saved-repositories`
    );
    console.log("🔑 JWT 토큰 존재 여부:", !!serverToken);

    const response = await fetch(`${API_BASE_URL}/saved-repositories`, {
      // // 변수 선언
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${serverToken}`,
      },
      mode: "cors",
      credentials: "omit",
    });

    console.log("📡 API 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // // 새로운 함수 정의
      console.error("❌ API 에러 응답:", errorData);
      throw new Error(
        errorData.message || `저장된 레포지토리 조회 실패: ${response.status}`
      );
    }

    const data = await response.json();
    // // 변수 선언
    console.log("✅ 저장된 레포지토리 응답 데이터:", data);
    return data;
  } catch (error) {
    console.error("❌ 저장된 레포지토리 API 호출 실패:", error);
    console.error("❌ 에러 타입:", error.name);
    console.error("❌ 에러 메시지:", error.message);
    throw error;
  }
};

/**
 * GitHub 사용자 정보 조회 API 호출
 * @returns {Promise<Object>} GitHub 사용자 정보
 */
export const getGitHubUserInfo = async () => {
  // // 새로운 함수 정의
  // 로컬 스토리지에서 JWT 토큰 가져오기
  const serverToken = localStorage.getItem("serverToken");

  if (!serverToken) {
    console.error("❌ JWT 토큰이 없습니다.");
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  try {
    console.log(
      "🔍 GitHub 사용자 정보 조회 시작:",
      `${API_BASE_URL}/github/user`
    );
    console.log("🔑 JWT 토큰 존재 여부:", !!serverToken);

    const response = await fetch(`${API_BASE_URL}/github/user`, {
      // // 변수 선언
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${serverToken}`,
      },
      mode: "cors",
      credentials: "omit",
    });

    console.log("📡 API 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // // 새로운 함수 정의
      console.error("❌ API 에러 응답:", errorData);
      throw new Error(
        errorData.message || `GitHub 사용자 정보 조회 실패: ${response.status}`
      );
    }

    const data = await response.json();
    // // 변수 선언
    console.log("✅ GitHub 사용자 정보 응답 데이터:", data);
    return data;
  } catch (error) {
    console.error("❌ GitHub 사용자 정보 API 호출 실패:", error);
    console.error("❌ 에러 타입:", error.name);
    console.error("❌ 에러 메시지:", error.message);
    throw error;
  }
};

/**
 * 저장된 레포지토리 저장 API 호출
 * @param {Object} repositoryData - 저장할 레포지토리 데이터
 * @returns {Promise<Object>} 저장 결과
 */
export const saveRepository = async (repositoryData) => {
  // // 새로운 함수 정의
  // 로컬 스토리지에서 JWT 토큰 가져오기
  const serverToken = localStorage.getItem("serverToken");

  if (!serverToken) {
    console.error("❌ JWT 토큰이 없습니다.");
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  try {
    console.log(
      "🔍 레포지토리 저장 시작:",
      `${API_BASE_URL}/saved-repositories`
    );
    console.log("📦 저장할 레포지토리 데이터:", repositoryData);
    console.log("🔑 JWT 토큰 존재 여부:", !!serverToken);

    const response = await fetch(`${API_BASE_URL}/saved-repositories`, {
      // // 변수 선언
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${serverToken}`,
      },
      mode: "cors",
      credentials: "omit",
      body: JSON.stringify(repositoryData),
    });

    console.log("📡 API 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // // 새로운 함수 정의
      console.error("❌ API 에러 응답:", errorData);
      throw new Error(
        errorData.message || `레포지토리 저장 실패: ${response.status}`
      );
    }

    const data = await response.json();
    // // 변수 선언
    console.log("✅ 레포지토리 저장 응답 데이터:", data);
    return data;
  } catch (error) {
    console.error("❌ 레포지토리 저장 API 호출 실패:", error);
    console.error("❌ 에러 타입:", error.name);
    console.error("❌ 에러 메시지:", error.message);
    throw error;
  }
};

/**
 * 레포지토리 커밋 목록 조회 API 호출
 * @param {string} owner - 레포지토리 소유자
 * @param {string} repo - 레포지토리 이름
 * @returns {Promise<Array>} 커밋 목록
 */
export const getRepositoryCommits = async (owner, repo) => {
  const serverToken = localStorage.getItem("serverToken");
  if (!serverToken) {
    console.error("❌ JWT 토큰이 없습니다.");
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  try {
    console.log(`🚀 커밋 목록 조회 API 호출: ${owner}/${repo}`);
    const response = await fetch(
      `${API_BASE_URL}/github/repositories/${owner}/${repo}/commits`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${serverToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ 커밋 목록 조회 실패:", errorData);
      throw new Error(
        errorData.message || "커밋 목록을 가져오는데 실패했습니다."
      );
    }

    const result = await response.json();
    console.log("✅ 커밋 목록 조회 성공:", result);
    return result;
  } catch (error) {
    console.error("❌ 커밋 목록 조회 중 오류:", error);
    throw error;
  }
};

/**
 * 저장된 레포지토리 삭제 API 호출
 * @param {number} repositoryId - 삭제할 레포지토리 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteSavedRepository = async (repositoryId) => {
  const serverToken = localStorage.getItem("serverToken");
  if (!serverToken) {
    console.error("❌ JWT 토큰이 없습니다.");
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  try {
    console.log(`🚀 저장된 레포지토리 삭제 API 호출: ${repositoryId}`);
    const response = await fetch(
      `${API_BASE_URL}/saved-repositories/${repositoryId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${serverToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ 저장된 레포지토리 삭제 실패:", errorData);
      throw new Error(
        errorData.message || "저장된 레포지토리 삭제에 실패했습니다."
      );
    }

    const result = await response.json();
    console.log("✅ 저장된 레포지토리 삭제 성공:", result);
    return result;
  } catch (error) {
    console.error("❌ 저장된 레포지토리 삭제 중 오류:", error);
    throw error;
  }
};

/**
 * 커밋 상세 정보 조회 API 호출
 * @param {string} owner - 레포지토리 소유자
 * @param {string} repo - 레포지토리 이름
 * @param {string} sha - 커밋 SHA
 * @returns {Promise<Object>} 커밋 상세 정보
 */
export const getCommitDetail = async (owner, repo, sha) => {
  const serverToken = localStorage.getItem("serverToken");
  if (!serverToken) {
    console.error("❌ JWT 토큰이 없습니다.");
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  try {
    console.log(`🚀 커밋 상세 조회 API 호출: ${owner}/${repo}/${sha}`);
    const response = await fetch(
      `${API_BASE_URL}/github/repositories/${owner}/${repo}/commits/${sha}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${serverToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ 커밋 상세 조회 실패:", errorData);
      throw new Error(
        errorData.message || "커밋 상세 정보를 가져오는데 실패했습니다."
      );
    }

    const result = await response.json();
    console.log("✅ 커밋 상세 조회 성공:", result);
    return result;
  } catch (error) {
    console.error("❌ 커밋 상세 조회 중 오류:", error);
    throw error;
  }
};
