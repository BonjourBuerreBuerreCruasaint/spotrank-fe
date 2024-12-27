import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const MainPage = () => {
  const [randomRestaurants, setRandomRestaurants] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [category, setCategory] = useState('restaurants'); // 기본값: 음식점
  const navigate = useNavigate();

  // API로부터 받아올 데이터 상태
  const [places, setPlaces] = useState({
    restaurants: [],
    cafes: [],
  });

  // 현재 선택된 카테고리 데이터 가져오기
  const currentPlaces = places[category];

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

  // 현재 시간 업데이트 함수
  const updateCurrentTime = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const formattedHours = hours.toString().padStart(2, '0');
    setCurrentTime(`${formattedHours}:00`);
  }, []);

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

  // Flask API 데이터 및 시간 업데이트
  useEffect(() => {
    fetchPlacesFromAPI();
    updateCurrentTime();

    // 1분마다 데이터 및 시간 업데이트
    const interval = setInterval(() => {
      fetchPlacesFromAPI();
      updateCurrentTime();
    }, 60000); // 1분 간격
    return () => clearInterval(interval);
  }, [fetchPlacesFromAPI, updateCurrentTime]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const handleRestaurantClick = (restaurantName) => {
    console.log(`${restaurantName} 클릭됨 - 상세 페이지로 이동 예정`);
    // 상세 페이지 이동 로직 추가 가능
  };

  useEffect(() => {
    const loadKakaoMap = () => {
      const container = document.getElementById('map');
      
      // 지도의 중심좌표 (신촌 버티고빌딩)
      const options = {
        center: new window.kakao.maps.LatLng(37.556229, 126.937079),
        level: 3 // 지도의 확대 레벨
      };

      // 지도 객체 생성
      const map = new window.kakao.maps.Map(container, options);
      

      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 마커 생성
      const markerPosition = new window.kakao.maps.LatLng(37.556229, 126.937079);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      });

      // 마커를 지도에 표시
      marker.setMap(map);
    };

    // 카카오맵 SDK가 로드된 후 실행
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    }
  }, []);

  // 로그인 버튼 클릭 핸들러 추가
  const handleLoginClick = () => {
    navigate('/login');
  };

  // 홈으로 이동하는 핸들러 추가
  const handleHomeClick = () => {
    window.location.href = '/'; // 또는 React Router 사용 시: navigate('/')
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-text" onClick={() => (window.location.href = '/')}>
            SpotRank
          </span>
        </div>
        <div className="nav-buttons">
          <button className="login-button" onClick={() => console.log('로그인 클릭')}>
            Login
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="left-panels">
          <div className="panel hot-places-panel">
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
                {currentPlaces.map((place) => (
                  <li
                    key={place.shop_name}
                    onClick={() => handleRestaurantClick(place.shop_name)}
                    className="restaurant-item"
                  >
                    {place.rank}. {place.shop_name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel recommendation-panel">
            <div className="recommendation">
              <h2>오늘 뭐 먹지?</h2>
              <div className="random-restaurants">
                {randomRestaurants || '로딩 중...'}
              </div>
            </div>
          </div>
        </div>

        <div id="map" className="map-container"></div>
      </div>
    </div>
  );
};

export default MainPage;