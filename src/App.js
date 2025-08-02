import React, { useState, useEffect } from "react";
// // React 훅 사용
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Repository from "./components/Repository";
import CreateRepository from "./components/CreateRepository";
import ProjectRegistration from "./components/ProjectRegistration";
import ProjectDetails from "./components/ProjectDetails";
import Navbar from "./components/Navbar";
import { getSavedRepositories, getGitHubUserInfo } from "./api/auth";

// 인증된 사용자의 리다이렉트 처리를 위한 컴포넌트
const AuthenticatedRedirect = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState("/dashboard");

  useEffect(() => {
    const checkSavedRepositories = async () => {
      try {
        const serverToken = localStorage.getItem("serverToken");
        if (!serverToken) {
          setRedirectPath("/create-repository");
          setIsChecking(false);
          return;
        }

        console.log("🔍 루트 경로 - 저장된 레포지토리 확인 중...");
        const savedRepositories = await getSavedRepositories();

        if (savedRepositories && savedRepositories.length > 0) {
          console.log(
            "✅ 저장된 레포지토리 발견:",
            savedRepositories.length,
            "개"
          );
          setRedirectPath("/repository");
        } else {
          console.log("❌ 저장된 레포지토리 없음");
          setRedirectPath("/create-repository");
        }
      } catch (error) {
        console.error("❌ 저장된 레포지토리 확인 실패:", error);
        setRedirectPath("/create-repository");
      } finally {
        setIsChecking(false);
      }
    };

    checkSavedRepositories();
  }, []);

  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>레포지토리 정보를 확인하는 중...</p>
      </div>
    );
  }

  return <Navigate to={redirectPath} replace />;
};

function App() {
  // // 새로운 함수 정의
  // 테스트를 위한 더미 데이터 사용 (API 연결 테스트용)
  const USE_DUMMY_AUTH = false;
  // // 변수 선언

  const dummyUser = {
    // // 변수 선언
    id: 1,
    login: "testuser",
    name: "테스트 사용자",
    email: "test@example.com",
    avatar_url: "https://ui-avatars.com/api/?name=Test+User&background=random",
    html_url: "https://github.com/testuser",
  };
  const dummyToken = "dummy-github-token-12345";
  // // 변수 선언

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // // 변수 선언
  const [user, setUser] = useState(null);
  // // 변수 선언
  const [githubToken, setGithubToken] = useState("");
  // // 변수 선언
  const [showSignup, setShowSignup] = useState(false);
  // // 변수 선언

  useEffect(() => {
    // // React 훅 사용
    // 실제 인증 로직
    const githubToken = localStorage.getItem("githubToken");
    const serverToken = localStorage.getItem("serverToken");
    const userData = localStorage.getItem("user");
    // // 변수 선언

    // GitHub 토큰과 서버 토큰이 모두 있고, 사용자 데이터가 있으면 인증된 것으로 간주
    if (
      githubToken &&
      serverToken &&
      userData &&
      userData !== "null" &&
      userData !== "undefined"
    ) {
      try {
        const parsedUserData = JSON.parse(userData);
        setGithubToken(githubToken);
        setUser(parsedUserData);
        setIsAuthenticated(true);
        console.log("저장된 인증 정보로 로그인 복원:", {
          githubToken,
          serverToken,
          userData: parsedUserData,
        });

        // GitHub 사용자 정보 업데이트 시도
        getGitHubUserInfo()
          .then((githubUserInfo) => {
            console.log("✅ GitHub 사용자 정보 업데이트:", githubUserInfo);
            const updatedUserData = {
              ...parsedUserData,
              ...githubUserInfo,
              avatar_url:
                githubUserInfo.avatar_url || parsedUserData.avatar_url,
              name:
                githubUserInfo.name ||
                githubUserInfo.login ||
                parsedUserData.name,
              login: githubUserInfo.login || parsedUserData.login,
              html_url: githubUserInfo.html_url || parsedUserData.html_url,
            };
            setUser(updatedUserData);
            localStorage.setItem("user", JSON.stringify(updatedUserData));
          })
          .catch((error) => {
            console.error("❌ GitHub 사용자 정보 업데이트 실패:", error);
            // 실패해도 기존 사용자 정보 유지
          });
      } catch (error) {
        console.error("Error parsing user data:", error);
        // 로컬 스토리지 정리
        localStorage.removeItem("githubToken");
        localStorage.removeItem("serverToken");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = async (userData, githubToken, serverToken) => {
    // // 새로운 함수 정의
    console.log("로그인 처리:", { userData, githubToken, serverToken });

    // 두 토큰 모두 저장
    localStorage.setItem("githubToken", githubToken);
    localStorage.setItem("serverToken", serverToken);

    // GitHub 사용자 정보 가져오기
    try {
      console.log("🔍 GitHub 사용자 정보 가져오는 중...");
      const githubUserInfo = await getGitHubUserInfo();
      console.log("✅ GitHub 사용자 정보:", githubUserInfo);

      // GitHub 사용자 정보로 업데이트
      const updatedUserData = {
        ...userData,
        ...githubUserInfo,
        avatar_url: githubUserInfo.avatar_url || userData.avatar_url,
        name: githubUserInfo.name || githubUserInfo.login || userData.name,
        login: githubUserInfo.login || userData.login,
        html_url: githubUserInfo.html_url || userData.html_url,
      };

      setUser(updatedUserData);
      setGithubToken(githubToken);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      // 저장된 레포지토리 확인
      console.log("🔍 저장된 레포지토리 확인 중...");
      const savedRepositories = await getSavedRepositories();
      console.log("📦 API 응답:", savedRepositories);

      if (savedRepositories && savedRepositories.length > 0) {
        console.log(
          "✅ 저장된 레포지토리 발견:",
          savedRepositories.length,
          "개"
        );
        console.log("🔄 /repository로 리다이렉트 중...");
        window.location.replace("/repository");
      } else {
        console.log("❌ 저장된 레포지토리 없음");
        console.log("🔄 /create-repository로 리다이렉트 중...");
        window.location.replace("/create-repository");
      }
    } catch (error) {
      console.error("❌ GitHub 사용자 정보 가져오기 실패:", error);

      // GitHub 사용자 정보 가져오기 실패 시 기본 사용자 정보 사용
      setUser(userData);
      setGithubToken(githubToken);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));

      // 저장된 레포지토리 확인
      try {
        console.log("🔍 저장된 레포지토리 확인 중...");
        const savedRepositories = await getSavedRepositories();
        console.log("📦 API 응답:", savedRepositories);

        if (savedRepositories && savedRepositories.length > 0) {
          console.log(
            "✅ 저장된 레포지토리 발견:",
            savedRepositories.length,
            "개"
          );
          console.log("🔄 /repository로 리다이렉트 중...");
          window.location.replace("/repository");
        } else {
          console.log("❌ 저장된 레포지토리 없음");
          console.log("🔄 /create-repository로 리다이렉트 중...");
          window.location.replace("/create-repository");
        }
      } catch (repoError) {
        console.error("❌ 저장된 레포지토리 확인 실패:", repoError);
        console.log("🔄 에러로 인해 /create-repository로 리다이렉트 중...");
        window.location.replace("/create-repository");
      }
    }
  };

  const handleSignup = (signupData) => {
    // // 새로운 함수 정의
    console.log("회원가입 완료:", signupData);

    // GitHub 토큰을 로컬 스토리지에 저장
    if (signupData.githubToken) {
      localStorage.setItem("githubToken", signupData.githubToken);
      setGithubToken(signupData.githubToken);
    }

    // 회원가입 완료 후 로그인 화면으로 전환
    setShowSignup(false);
  };

  const handleLogout = () => {
    // // 새로운 함수 정의
    setUser(null);
    setGithubToken("");
    setIsAuthenticated(false);
    localStorage.removeItem("githubToken");
    localStorage.removeItem("serverToken");
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        <div className="container">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <AuthenticatedRedirect />
                ) : showSignup ? (
                  <Signup
                    onSignup={handleSignup}
                    onSwitchToLogin={() => setShowSignup(false)}
                  />
                ) : (
                  <Login
                    onLogin={handleLogin}
                    onSwitchToSignup={() => setShowSignup(true)}
                  />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard user={user} githubToken={githubToken} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/repository"
              element={
                isAuthenticated ? (
                  <Repository user={user} githubToken={githubToken} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/create-repository"
              element={
                isAuthenticated ? (
                  <CreateRepository user={user} githubToken={githubToken} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/register-project"
              element={
                isAuthenticated ? (
                  <ProjectRegistration user={user} githubToken={githubToken} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/project/:projectId"
              element={
                isAuthenticated ? (
                  <ProjectDetails user={user} githubToken={githubToken} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <AuthenticatedRedirect />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
