# Code Comment AI

GitHub 코드 변경사항을 자동으로 감지하고 AI가 코드 주석을 생성해주는 웹 애플리케이션입니다.

## 🎯 프로젝트 개요

Code Comment AI는 개발자들이 코드 변경사항을 더 쉽게 이해하고 관리할 수 있도록 도와주는 서비스입니다. GitHub 리포지토리의 변경사항을 실시간으로 감지하고, AI가 자동으로 한국어 주석을 생성하여 코드의 의도와 변경 내용을 명확하게 설명합니다.

### 주요 기능
- 🔐 **사용자 인증**: 이메일/비밀번호 기반 로그인, GitHub PAT 연동
- 📊 **대시보드**: 프로젝트 요약, 최근 변경사항, 통계 정보
- 🔧 **프로젝트 등록**: GitHub 리포지토리 선택 및 모니터링 설정
- 🤖 **AI 주석 생성**: 코드 변경사항에 대한 자동 주석 생성
- 📋 **프로젝트 관리**: 상세 설정 및 변경사항 히스토리

## 🏗️ 기술 스택

- **Frontend**: React.js
- **Routing**: React Router DOM
- **Form Management**: React Hook Form
- **GitHub API**: Octokit REST API
- **Styling**: CSS3 (모던 디자인)
- **Data Storage**: Local Storage (프로토타입용)

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js (v14 이상)
- npm 또는 yarn
- GitHub 계정 및 Personal Access Token

### 설치 방법

1. **저장소 클론**
```bash
git clone <repository-url>
cd hackathon-project
```

2. **의존성 설치**
```bash
npm install
```

3. **개발 서버 실행**
```bash
npm start
```

4. **브라우저에서 확인**
```
http://localhost:3000
```

## 🔐 GitHub Personal Access Token 생성

### 1. GitHub에서 토큰 생성
1. GitHub.com에 로그인
2. 우측 상단 프로필 → **Settings**
3. 좌측 메뉴에서 **Developer settings**
4. **Personal access tokens** → **Tokens (classic)**
5. **Generate new token** → **Generate new token (classic)**

### 2. 토큰 설정
- **Note**: "Code Comment AI" 입력
- **Expiration**: 90 days (권장)
- **Scopes**: **repo** 체크 (전체 리포지토리 접근 권한)

### 3. 토큰 저장
- 생성된 토큰을 안전한 곳에 복사하여 저장
- ⚠️ **주의**: 토큰은 한 번만 표시되므로 반드시 저장하세요!

## 📖 사용 방법

### 1. 회원가입
1. 로그인 화면에서 **"회원가입하기"** 클릭
2. 다음 정보 입력:
   - **이메일**: 유효한 이메일 주소
   - **비밀번호**: 6자 이상
   - **비밀번호 확인**: 동일한 비밀번호
   - **GitHub PAT**: 위에서 생성한 Personal Access Token
3. **"회원가입"** 버튼 클릭
4. 성공 메시지 확인 후 로그인 화면으로 자동 이동

### 2. 로그인
1. **이메일**과 **비밀번호** 입력
2. **"로그인"** 버튼 클릭
3. 대시보드로 자동 이동

### 3. 프로젝트 등록
1. 대시보드에서 **"새 프로젝트 등록"** 클릭
2. **GitHub 리포지토리 선택** 또는 **URL 직접 입력**
3. **모니터링 설정**:
   - **브랜치**: main, develop 등 선택
   - **감시 경로**: 특정 폴더만 모니터링 (선택사항)
   - **GitHub Webhook**: 활성화 권장
   - **자동 주석 생성**: 활성화
4. **"프로젝트 등록"** 버튼 클릭

### 4. 프로젝트 관리
1. **대시보드**에서 등록된 프로젝트 목록 확인
2. **프로젝트명 클릭**하여 상세 페이지 이동
3. **Overview 탭**: 프로젝트 정보 및 통계
4. **Changes 탭**: 변경사항 히스토리 및 AI 주석
5. **Settings 탭**: 모니터링 설정 수정

## 🤖 AI 주석 생성 기능

### 작동 원리
1. **변경사항 감지**: GitHub Webhook 또는 로컬 에이전트
2. **Diff 추출**: 변경된 코드 부분 자동 분석
3. **AI 분석**: 코드 패턴 및 컨텍스트 이해
4. **주석 생성**: 한국어로 변경사항 설명

### 주석 예시
```javascript
// 이 부분에서 null 체크가 추가되었습니다. NPE 방지를 위한 조치로 보입니다.
// 함수의 반환 타입이 string에서 number로 변경되었습니다.
// 새로운 에러 핸들링 로직이 추가되었습니다.
// 성능 최적화를 위해 불필요한 반복문이 제거되었습니다.
```

## 📊 대시보드 기능

### 프로젝트 요약
- **등록된 프로젝트 수** 표시
- **새 프로젝트 등록** 링크
- **프로젝트별 상세 보기** 링크

### 최근 변경사항
- **AI 생성 주석** 미리보기
- **코드 diff** 표시
- **변경 시간** 및 **프로젝트명**
- **상태별 필터링** (추가, 수정, 삭제)

### 통계 정보
- **총 프로젝트 수**
- **이번 주 변경사항**
- **AI 주석 생성 수**

## 🔧 프로젝트 설정

### 모니터링 옵션
- **브랜치 선택**: main, develop, feature 등
- **감시 경로**: 특정 폴더만 모니터링
- **파일 확장자**: 특정 파일 타입만 감지
- **제외 경로**: 특정 폴더/파일 제외

### 고급 설정
- **GitHub Webhook**: 실시간 변경사항 감지
- **로컬 에이전트**: 로컬에서 변경사항 감지
- **알림 설정**: 변경사항 발생 시 알림
- **자동 주석 생성**: AI 주석 자동 생성 여부

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── Login.js              # 로그인 컴포넌트
│   ├── Login.css             # 로그인 스타일
│   ├── Signup.js             # 회원가입 컴포넌트
│   ├── Signup.css            # 회원가입 스타일
│   ├── Dashboard.js          # 대시보드 컴포넌트
│   ├── Dashboard.css         # 대시보드 스타일
│   ├── ProjectRegistration.js # 프로젝트 등록 컴포넌트
│   ├── ProjectRegistration.css # 프로젝트 등록 스타일
│   ├── ProjectDetails.js     # 프로젝트 상세 컴포넌트
│   ├── ProjectDetails.css    # 프로젝트 상세 스타일
│   ├── Navbar.js             # 네비게이션 컴포넌트
│   └── Navbar.css            # 네비게이션 스타일
├── App.js                    # 메인 앱 컴포넌트
├── App.css                   # 전역 스타일
└── index.js                  # 앱 진입점
```

## 🔄 데이터 플로우

```
1. 사용자 회원가입 → GitHub PAT 검증 → Local Storage 저장
2. 로그인 → 저장된 정보로 GitHub API 접근
3. 프로젝트 등록 → 리포지토리 선택 → 모니터링 설정
4. 코드 변경 감지 → diff 추출 → AI 주석 생성
5. 결과 저장 → 대시보드 표시
```

## 🎨 UI/UX 특징

### 모던 디자인
- **그라데이션 배경** (보라-파랑)
- **카드 기반 레이아웃**
- **부드러운 애니메이션**
- **반응형 디자인**

### 사용자 경험
- **로딩 상태** 표시
- **에러 메시지** 명확한 안내
- **성공 피드백** 제공
- **직관적인 네비게이션**

## 🚀 향후 개발 계획

### 백엔드 연동
- **Node.js/Express** 또는 **Python/FastAPI**
- **데이터베이스** 연동 (PostgreSQL, MongoDB)
- **실제 LLM API** 연동 (OpenAI, Claude)

### 고급 기능
- **팀 협업** 기능
- **주석 히스토리** 관리
- **알림 시스템** (이메일, Slack)
- **다국어 지원**
- **코드 리뷰** 자동화

### 보안 강화
- **JWT 토큰** 인증
- **비밀번호 해시화**
- **HTTPS** 적용
- **API 요청 제한**

## 🎯 핵심 가치

1. **개발자 생산성 향상** - 자동 주석 생성으로 코드 이해도 증진
2. **코드 품질 개선** - AI 기반 코드 분석 및 제안
3. **팀 협업 강화** - 명확한 코드 변경사항 설명
4. **학습 도구** - 초보 개발자를 위한 코드 이해 지원

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**Code Comment AI** - 더 나은 코드 이해를 위한 AI 기반 주석 생성 서비스 🚀
