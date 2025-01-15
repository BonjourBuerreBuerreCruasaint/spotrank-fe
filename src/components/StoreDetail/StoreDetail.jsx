import React, { useState, useEffect } from 'react';
import './StoreDetail.css';
import { useNavigate } from 'react-router-dom';

const StoreDetail = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const storedId = sessionStorage.getItem('id')

  // 테스트용 더미 이미지
  const dummyImages = {
    main: 'https://via.placeholder.com/500x500',
    sub: Array(6).fill('https://via.placeholder.com/500x500')
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closePopup = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    // 카카오맵 API 스크립트 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=33f41b22037c7bb6ada97e6f7c625e0d&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      loadStoreMap(); // StoreDetail 전용 지도 로드 함수 호출
    };

    return () => {
      document.head.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
    };
  }, []);

  const loadStoreMap = () => {
    const container = document.getElementById('map'); // 지도를 표시할 div
    const options = {
      center: new window.kakao.maps.LatLng(37.556229, 126.937079), // 서울의 위도, 경도
      level: 3, // 줌 레벨
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
          <p style="margin: 5px 0 0; font-size: 14px; color: #666;">카페</p>
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

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="로고" className="logo" />
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate(`/ceo-main?id=${storedId}`)} className="spotrank-button">SpotRank</button>
        </div>
      </nav>
      <div className="store-detail-container">
        <div className="map-section">
          <div id="map" className="map-placeholder" style={{ width: '100%', height: '560px' }}>
          </div>
        </div>
        
        <div className="content-section">
          <div className="images-section">
            <div className="main-image">
              <img 
                src={dummyImages.main}
                alt="매장 메인" 
                onClick={() => handleImageClick(dummyImages.main)}
              />
            </div>
            <div className="sub-images">
              {dummyImages.sub.map((src, index) => (
                <div key={index} className="sub-image">
                  <img
                    src={src}
                    alt={`매장 사진 ${index + 1}`}
                    className={`sub-image-${index + 1}`}
                    onClick={() => handleImageClick(src)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="info-section">
            <div className="store-info">
              <h2>커피빈</h2>
              <p>카테고리: 카페</p>
              <p>운영 시간: 월-일 00:00-24:00</p>
              <p>주소: 서울 서대문구 연세로 8-1 VERTIGO</p>
              <p>전화번호: 0000-0000-0000</p>
              <div className="store-description">
                <textarea 
                  readOnly 
                  value="가게 소개글이 들어갈 자리입니다."
                />
              </div>
            </div>
            
            <div className="ranking">
              <h3>인기 매장 순위</h3>
              <ul>
                <li>1위 매뉴 - ???</li>
                <li>2위 매뉴 - ???</li>
                <li>3위 매뉴 - ???</li>
                <li>4위 매뉴 - ???</li>
                <li>5위 매뉴 - ???</li>
              </ul>
            </div>
          </div>
        </div>

        {selectedImage && (
          <div className="image-popup" onClick={closePopup}>
            <div className="popup-content">
              <img src={selectedImage} alt="팝업 이미지" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetail; 