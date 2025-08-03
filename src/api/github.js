// GitHub API 관련 함수들
export const fetchRepositoryCommits = async (owner, repo, token) => {
  console.log(`🔗 API URL: https://api.github.com/repos/${owner}/${repo}/commits`);
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    console.log(`📡 API 응답 상태: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API 오류 응답:`, errorText);
      throw new Error(`GitHub API 오류: ${response.status} - ${errorText}`);
    }

    const commits = await response.json();
    console.log(`📊 받은 커밋 수: ${commits.length}`);
    
    const formattedCommits = commits.map(commit => {
      console.log('🔍 원본 커밋 데이터:', commit);
      
      return {
        id: commit.sha,
        sha: commit.sha.substring(0, 7),
        message: commit.message || commit.commit?.message || 'No message',
        author: commit.authorName || commit.commit?.author?.name || commit.author?.login || 'Unknown',
        email: commit.commit?.author?.email || '',
        date: commit.commit?.author?.date || new Date().toISOString(),
        url: commit.html_url || `https://github.com/${owner}/${repo}/commit/${commit.sha}`,
        avatar: commit.author?.avatar_url || '',
      };
    });
    
    console.log(`✅ 포맷된 커밋 데이터:`, formattedCommits.slice(0, 2));
    return formattedCommits;
  } catch (error) {
    console.error('❌ 커밋 목록 가져오기 오류:', error);
    throw error;
  }
};

export const fetchCommitDetail = async (owner, repo, sha, token) => {
  console.log(`🔗 커밋 상세 API URL: https://api.github.com/repos/${owner}/${repo}/commits/${sha}`);
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    console.log(`📡 커밋 상세 API 응답 상태: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ 커밋 상세 API 오류 응답:`, errorText);
      throw new Error(`GitHub API 오류: ${response.status} - ${errorText}`);
    }

    const commitDetail = await response.json();
    console.log(`📊 커밋 상세 데이터:`, commitDetail);
    
    return {
      id: commitDetail.sha,
      sha: commitDetail.sha.substring(0, 7),
      message: commitDetail.commit.message,
      author: commitDetail.commit.author.name,
      email: commitDetail.commit.author.email,
      date: commitDetail.commit.author.date,
      url: commitDetail.html_url,
      avatar: commitDetail.author?.avatar_url,
      // 상세 정보 추가
      stats: commitDetail.stats,
      files: commitDetail.files?.map(file => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch
      })) || [],
      parents: commitDetail.parents?.map(parent => ({
        sha: parent.sha.substring(0, 7),
        url: parent.html_url
      })) || []
    };
  } catch (error) {
    console.error('❌ 커밋 상세 정보 가져오기 오류:', error);
    throw error;
  }
};

// AI 주석 관련 함수들 (시뮬레이션)
export const generatePreviewComments = async (owner, repo, sha, branch = 'main') => {
  console.log(`🎭 AI 주석 미리보기 생성 시뮬레이션: ${owner}/${repo}/${sha}`);
  
  // 시뮬레이션을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 더미 주석 데이터 생성
  const dummyComments = [
    {
      id: 'comment-1',
      fileName: 'src/main/java/com/example/Service.java',
      lineNumber: 15,
      content: '이 메서드는 사용자 인증을 처리합니다. JWT 토큰을 검증하고 사용자 정보를 반환합니다.'
    },
    {
      id: 'comment-2', 
      fileName: 'src/main/java/com/example/Controller.java',
      lineNumber: 25,
      content: 'REST API 엔드포인트입니다. 클라이언트로부터 요청을 받아 적절한 서비스 메서드를 호출합니다.'
    },
    {
      id: 'comment-3',
      fileName: 'src/main/java/com/example/Repository.java', 
      lineNumber: 8,
      content: '데이터베이스 접근을 위한 리포지토리 인터페이스입니다. Spring Data JPA를 사용합니다.'
    }
  ];
  
  console.log('✅ AI 주석 미리보기 생성 완료 (시뮬레이션)');
  return {
    comments: dummyComments,
    sessionId: 'session-' + Date.now()
  };
};

export const applyComments = async (owner, repo, sha, branch = 'main') => {
  console.log(`🎭 AI 주석 적용 시뮬레이션: ${owner}/${repo}/${sha}`);
  
  // 시뮬레이션을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('✅ AI 주석 적용 완료 (시뮬레이션)');
  return {
    success: true,
    message: '주석이 성공적으로 적용되었습니다.',
    commitUrl: `https://github.com/${owner}/${repo}/commit/${sha}`
  };
};

export const updateCommentSession = async (sessionId, commentData) => {
  console.log(`🎭 주석 세션 수정 시뮬레이션: ${sessionId}`, commentData);
  
  // 시뮬레이션을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('✅ 주석 세션 수정 완료 (시뮬레이션)');
  return {
    success: true,
    message: '주석이 성공적으로 수정되었습니다.'
  };
};

export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}년 전`;
}; 