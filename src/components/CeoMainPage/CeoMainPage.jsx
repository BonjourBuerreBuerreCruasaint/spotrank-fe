import React, { useEffect } from 'react';
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

  useEffect(() => {
    const loadKakaoMap = () => {
      const container = document.getElementById('ceo-map');
      const options = {
        center: new window.kakao.maps.LatLng(37.556229, 126.937079),
        level: 3
      };
      const map = new window.kakao.maps.Map(container, options);

      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      const markerPosition = new window.kakao.maps.LatLng(37.556229, 126.937079);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      });
      marker.setMap(map);

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            background-color: white;
            font-family: 'Pretendard', sans-serif;
          ">
            <h4 style="margin: 0; font-size: 16px; color: #333;">커피빈 신촌점</h4>
            <p style="margin: 5px 0 0; font-size: 14px; color: #666;">평점: 5.0</p>
          </div>
        `,
        removable: true
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        infoWindow.open(map, marker);
      });

      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        infoWindow.close();
      });
    };

    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    }
  }, []);

  return (
    <div className="ceo-main-container">
      <header className="ceo-main-header">
        <div className="logo-container">
          <h1 className="logo">SpotRank</h1>
        </div>
        <div className="ceo-button-group">
          <button onClick={handleCeoClick} className="ceo-ceo-button">
            나는 사장
          </button>
          <button onClick={handleLogout} className="ceo-logout-button">
            Logout
          </button>
        </div>
      </header>
      <main className="ceo-main-content">
        <p>회원 전용 페이지입니다.</p>
        <div id="ceo-map" className="ceo-map-container" style={{ width: '100%', height: '100%' }}></div>
      </main>
    </div>
  );
};

export default CeoMainPage;
