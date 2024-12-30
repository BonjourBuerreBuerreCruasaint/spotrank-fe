import React from 'react';
import './CeoMainPage.css';

const CeoMainPage = () => {
  const handleLogout = () => {
    // 로그아웃 로직 추가
    alert('로그아웃 되었습니다.');
  };

  const handleCeoClick = () => {
    // "나는 사장" 버튼 클릭 시 로직 추가
    alert('오신걸 환영합니다.');
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <h1>SpotRank</h1>
        <div className="button-group">
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
          <button onClick={handleCeoClick} className="ceo-button">
            나는 사장
          </button>
        </div>
      </header>
      <main className="main-content">
        {/* MainPage와 동일한 콘텐츠 */}
        <p>회원 전용 페이지입니다.</p>
      </main>
    </div>
  );
};

export default CeoMainPage;
