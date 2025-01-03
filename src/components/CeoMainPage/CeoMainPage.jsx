import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CeoMainPage.css';

const CeoMainPage = () => {
  const navigate = useNavigate();
  const [randomRestaurants, setRandomRestaurants] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [places, setPlaces] = useState({
    restaurants: [],
    cafes: [],
  });
  const [category, setCategory] = useState('restaurants'); // 카테고리 상태

  // 랜덤 추천 식당 업데이트
  useEffect(() => {
    if (places.restaurants.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * places.restaurants.length);
        setRandomRestaurants(places.restaurants[randomIndex].shop_name);
      }, 3000); // 3초마다 변경
      return () => clearInterval(interval);
    }
  }, [places.restaurants]);

  // Flask API에서 데이터 가져오기
  const fetchPlacesFromAPI = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/ranking'); // Flask API URL
      if (!response.ok) throw new Error('API 요청 실패');
      const data = await response.json();
      setPlaces({
        restaurants: data.restaurant_ranking,
        cafes: data.cafe_ranking,
      });
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  }, []);

  useEffect(() => {
    fetchPlacesFromAPI();
    const interval = setInterval(() => {
      fetchPlacesFromAPI();
    }, 60000); // 1분 간격
    return () => clearInterval(interval);
  }, [fetchPlacesFromAPI]);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const formattedHours = hours.toString().padStart(2, '0');
    setCurrentTime(`${formattedHours}:00`);
  }, []);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const handleLogout = () => {
    // 로그아웃 기능 구현
    console.log("로그아웃 버튼 클릭됨");
    navigate('/'); // MainPage로 이동
  };

  const handleOwner = () => {
    // "나는 사장" 버튼 클릭 시 CeoDashBoard로 이동
    navigate('/ceo-dashboard'); // CeoDashBoard 페이지로 이동
  };

  useEffect(() => {
    const loadKakaoMap = () => {
      const container = document.getElementById('ceo-map');
      const options = {
        center: new window.kakao.maps.LatLng(37.556229, 126.937079),
        level: 3
      };
      const map = new window.kakao.maps.Map(container, options);

      // 500m 반경 원 추가
      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(37.556229, 126.937079), // 기준 좌표
        radius: 500, // 반경 500m
        strokeWeight: 2,
        strokeColor: '#87CEEB',
        strokeOpacity: 0.8,
        fillColor: '#87CEEB',
        fillOpacity: 0.3
      });
      circle.setMap(map);

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
          <button className="ceo-ceo-button" onClick={handleOwner}>나는 사장</button>
          <button className="ceo-logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="ceo-main-content">
        <div className="overlay">
          <div className="category-toggle">
            <button
              className={`toggle-button ${category === 'restaurants' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('restaurants')}
            >
              음식점
            </button>
            <span className="divider">|</span>
            <button
              className={`toggle-button ${category === 'cafes' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('cafes')}
            >
              카페
            </button>
          </div>
          <div className="hot-places">
            <h2>핫플레이스 <span>({currentTime} 판매량 기준)</span></h2>
            <ul>
              {(category === 'restaurants' ? places.restaurants : places.cafes).map((place) => (
                <li key={place.shop_name} className="restaurant-item">
                  {place.rank}. {place.shop_name}
                </li>
              ))}
            </ul>
          </div>
          <div className="recommendation">
            <h2>오늘 뭐 먹지?</h2>
            <div className="random-restaurants">
              {randomRestaurants || '로딩 중...'}
            </div>
          </div>
        </div>
        <div id="ceo-map" className="ceo-map-container" style={{ width: '100%', height: '100%' }}></div>
      </main>
    </div>
  );
};

export default CeoMainPage;
