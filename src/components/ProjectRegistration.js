// ProjectRegistration.js
import React from "react";
import "./ProjectRegistration.css";

const ProjectRegistration = () => {
  return (
    <div className="project-wrap">
      <aside className="sidebar">
       

        <div className="sidebar-project">
          <p>프로젝트명 01</p>
          <span>프로젝트 디스크립션 - 설명</span>
          <div className="lang"><span className="circle"></span>javascript</div>
          <ul>
            <li>Commit c385319 <small>10d ago</small></li>
            <li>Commit c385318 <small>42d ago</small></li>
            <li>Commit c385318 <small>42d ago</small></li>
            <li>Commit c385318 <small>42d ago</small></li>
          </ul>
        </div>
      </aside>

      <main className="main">
        <header className="main-header">
          <div>
            <h1>Commit c385319</h1>
            <a href="#">🔗 GitHub - username/Commit c385319</a>
          </div>
          <div className="meta">
            <div className="tag">📅 마지막 커밋<br /><strong>2025-08-02</strong></div>
            <div className="tag">📁 추적 파일 수<br /><strong>56</strong></div>
          </div>
        </header>

        <section className="code-preview">
          <div className="code-title">2 files changed <span className="diff">+24 −6 lines changed</span></div>
          <img src="/images/commit-diff.png" alt="commit diff preview" />
          <button className="commit-btn">주석 적용해서 커밋 후 푸시하기</button>
        </section>
      </main>
    </div>
  );
};

export default ProjectRegistration;
