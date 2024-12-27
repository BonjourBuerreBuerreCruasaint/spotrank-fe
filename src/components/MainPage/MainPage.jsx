import React, { useEffect, useState, useCallback } from 'react';
import '../../App.css';

const MainPage = () => {
  const [randomRestaurants, setRandomRestaurants] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [category, setCategory] = useState('음식점');
  
  // 각 카테고리별 독립적인 순위 데이터
  const [places, setPlaces] = useState({
    restaurants: [
      { id: 1, name: "후라토 식당", rank: 1, sales: 150 },
      { id: 2, name: "핵밥", rank: 2, sales: 145 },
      { id: 3, name: "아웃닭", rank: 3, sales: 140 },
      { id: 4, name: "한신포차", rank: 4, sales: 135 },
      { id: 5, name: "평안도", rank: 5, sales: 130 },
      { id: 6, name: "정순", rank: 6, sales: 125 },
      { id: 7, name: "전집", rank: 7, sales: 120 },
      { id: 8, name: "로바타", rank: 8, sales: 115 },
      { id: 9, name: "김밥천국", rank: 9, sales: 110 },
      { id: 10, name: "단토리", rank: 10, sales: 105 }
    ],
    cafes: [
      { id: 1, name: "스타벅스", rank: 1, sales: 200 },
      { id: 2, name: "이디야", rank: 2, sales: 180 },
      { id: 3, name: "메가커피", rank: 3, sales: 170 },
      { id: 4, name: "빽다방", rank: 4, sales: 160 },
      { id: 5, name: "커피빈", rank: 5, sales: 150 },
      { id: 6, name: "블루보틀", rank: 6, sales: 140 },
      { id: 7, name: "폴바셋", rank: 7, sales: 130 },
      { id: 8, name: "투썸플레이스", rank: 8, sales: 120 },
      { id: 9, name: "카페베네", rank: 9, sales: 110 },
      { id: 10, name: "할리스", rank: 10, sales: 100 }
    ]
  });

  
    // 현재 선택된 카테고리의 데이터 가져오기
    const currentPlaces = places[category === '음식점' ? 'restaurants' : 'cafes'];
  const handleRestaurantClick = (restaurantName) => {
    console.log(`${restaurantName} 클릭됨 - 상세 페이지로 이동 예정`);
    // 나중에 여기에 상세 페이지 이동 로직 추가
  };

  // 현재 시간 업데이트 함수 수정
  const updateCurrentTime = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    // 항상 "00"분으로 표시
    const formattedHours = hours.toString().padStart(2, '0');
    setCurrentTime(`${formattedHours}:00`);
  }, []);

  // useCallback으로 함수 메모이제이션
  const fetchHotPlacesData = useCallback(async () => {
    try {
      const now = new Date();
      const minutes = now.getMinutes();
      
      // 정시(분이 0일 때)에만 데이터 업데이트
      if (minutes === 0) {
        // 각 카테고리별로 독립적으로 순위 업데이트
        const updatePlaceData = (placeList) => {
          return placeList
            .map(place => ({
              ...place,
              sales: place.sales + Math.floor(Math.random() * 10 - 5) // 약간의 변동
            }))
            .sort((a, b) => b.sales - a.sales)
            .map((place, index) => ({
              ...place,
              rank: index + 1 // 각 카테고리 내에서 1~10위 독립적으로 부여
            }));
        };

        setPlaces(prev => ({
          restaurants: updatePlaceData(prev.restaurants),
          cafes: updatePlaceData(prev.cafes)
        }));
      }
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  }, []);

  // 랜덤 식당 업데이트를 위한 useEffect
  useEffect(() => {
    // 3초마다 랜덤 식당 변경
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * places.restaurants.length);
      setRandomRestaurants(places.restaurants[randomIndex].name);
    }, 3000);

    return () => clearInterval(interval);
  }, [places.restaurants]);

  // 시간과 데이터 업데이트
  useEffect(() => {
    updateCurrentTime();
    fetchHotPlacesData();

    // 1분마다 시간 업데이트 및 데이터 체크
    const interval = setInterval(() => {
      updateCurrentTime();
      fetchHotPlacesData();
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, [updateCurrentTime, fetchHotPlacesData]);

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
    console.log('로그인 버튼 클릭됨 - 로그인 페이지로 이동 예정');
    // 나중에 실제 로그인 페이지로 이동하는 로직 추가
    // 예: navigate('/login') 또는 window.location.href = '/login'
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-text" onClick={handleHomeClick}>
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
            <div className="category-toggle">
              <button 
                className={`toggle-button ${category === '음식점' ? 'active' : ''}`}
                onClick={() => setCategory('음식점')}
              >
                음식점
              </button>
              <span className="divider">|</span>
              <button 
                className={`toggle-button ${category === '카페' ? 'active' : ''}`}
                onClick={() => setCategory('카페')}
              >
                카페
              </button>
            </div>

            <div className="hot-places">
              <h2>핫플레이스 <span>({currentTime} 판매량 기준)</span></h2>
              <ul>
                {currentPlaces.map((place) => (
                  <li 
                    key={place.id}
                    onClick={() => handleRestaurantClick(place.name)}
                    className="restaurant-item"
                  >
                    {place.rank}. {place.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel recommendation-panel">
            <div className="recommendation">
              <h2>오늘 뭐 먹지?</h2>
              <div className="random-restaurants">
                {randomRestaurants}
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