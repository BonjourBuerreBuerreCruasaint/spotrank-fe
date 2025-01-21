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

  const [userLocation, setUserLocation] = useState(null);

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

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('위치 정보를 가져오는 중 오류 발생:', error);
        }
      );
    } else {
      console.warn('Geolocation이 지원되지 않습니다.');
    }
  }, []);

  // 카카오맵 로드 함수 추가
  const loadKakaoMap = () => {
    console.log('Loading Kakao Map...'); // 디버깅 로그 추가
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.556229, 126.937079),
      level: 3
    };

    // 지도 객체 생성
    const map = new window.kakao.maps.Map(container, options);
    
    // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성
    const mapTypeControl = new window.kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

    // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성
    const zoomControl = new window.kakao.maps.ZoomControl();
    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    if (userLocation) {
      const userMarkerPosition = new window.kakao.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude
      );

      const userMarker = new window.kakao.maps.Marker({
        position: userMarkerPosition,
      });

      // 마커를 지도에 표시
      userMarker.setMap(map);
      map.setCenter(userMarkerPosition);

      // 마커 클릭 이벤트 추가
      window.kakao.maps.event.addListener(userMarker, 'click', () => {
        navigate('/store-detail'); // StoreDetail 페이지로 이동
      });

      // InfoWindow 생성
      const userInfoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            background-color: white;
            font-family: 'Pretendard', sans-serif;
          ">
            <h4 style="margin: 0; font-size: 16px; color: #333;">사용자 위치</h4>
          </div>
        `,
        removable: true
      });

      // 마커에 마우스 오버 이벤트 등록
      window.kakao.maps.event.addListener(userMarker, 'mouseover', () => {
        userInfoWindow.open(map, userMarker);
      });

      // 마커에 마우스 아웃 이벤트 등록
      window.kakao.maps.event.addListener(userMarker, 'mouseout', () => {
        userInfoWindow.close();
      });
    }
  };

  // 카카오맵 SDK가 로드된 후 실행
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=33f41b22037c7bb6ada97e6f7c625e0d&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      loadKakaoMap();
    };

    return () => {
      document.head.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
    };
  }, [userLocation]);

  // 로그인 버튼 클릭 핸들러 추가
  const handleLoginClick = () => {
    navigate('/login'); // '/login' 경로로 이동
  };

  // 홈으로 이동하는 핸들러 추가
  const handleHomeClick = () => {
    window.location.href = '/'; // 또는 React Router 사용 시: navigate('/')
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="로고" className="logo" /> {/* 로고 추가 */}
          <span className="logo-text" onClick={() => (window.location.href = '/')}>
            SpotRank
          </span>
        </div>
        <div className="nav-buttons">
          <button className="login-button" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="left-panels">
          <div className="panel hot-places-panel">
            <div className="main-category-toggle">
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