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
  let map; // map 변수를 여기서 정의

  // 로고 이미지 경로 수정
  const logo = `${process.env.PUBLIC_URL}/logo.png`;

  const [userLocation, setUserLocation] = useState(null);
  
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
      const seoulDataResponse = await fetch('http://127.0.0.1:5000/api/seouldata');
      if (!seoulDataResponse.ok) throw new Error('서울 데이터 요청 실패');
      
      let seoulData = await seoulDataResponse.json();
      console.log('API 응답:', seoulData); // 응답 데이터 확인

      if (!Array.isArray(seoulData)) {
        if (seoulData) {
          seoulData = [seoulData]; // 단일 객체일 경우 배열로 변환
        } else {
          throw new Error('API 응답 구조가 올바르지 않습니다.');
        }
      }

      const areas = seoulData; // DATA 배열 사용
      const polygons = []; // 이미 추가된 정사각형을 저장할 배열

      areas.forEach(area => {
        console.log('현재 데이터:', area); // 현재 데이터 확인
        const latitude = area.latitude !== undefined ? parseFloat(area.latitude) : null; // "latitude" 값 사용
        const longitude = area.longitude !== undefined ? parseFloat(area.longitude) : null; // "longitude" 값 사용

        if (latitude === null || longitude === null || isNaN(latitude) || isNaN(longitude)) {
          console.error(`위도 또는 경도가 유효하지 않음: 위도=${latitude}, 경도=${longitude}`);
          return; // 유효하지 않은 경우 다음 반복으로 넘어감
        }

        const category = area.commercial_district; // "commercial_district" 값 사용
        const color = getColorByCategory(category); // 색상 결정

        // 정사각형 생성 (사이즈 0.00008)
        const size = 0.0030; // 정사각형의 크기
        const path = [
          new window.kakao.maps.LatLng(latitude + size, longitude + size), // 오른쪽 위
          new window.kakao.maps.LatLng(latitude + size, longitude - size), // 오른쪽 아래
          new window.kakao.maps.LatLng(latitude - size, longitude - size), // 왼쪽 아래
          new window.kakao.maps.LatLng(latitude - size, longitude + size)  // 왼쪽 위
        ];

        // 충돌 감지 로직
        let overlap = false;
        for (const existingPolygon of polygons) {
          if (isOverlapping(existingPolygon, path)) {
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          const polygon = new window.kakao.maps.Polygon({
            path: path,
            strokeWeight: 1,
            strokeColor: color,
            strokeOpacity: 1,
            fillColor: color,
            fillOpacity: 0.1
          });
          polygon.setMap(map); // map에 정사각형 추가
          polygons.push(path); // 추가된 정사각형 경계를 저장
        }
      });

    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  }, []);

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

  // 간단한 충돌 감지 함수 (예시)
  const isOverlapping = (existingPolygon, newPath) => {
    // 여기서 기존 폴리곤과 새로운 폴리곤의 경계를 비교하여 겹치는지 확인하는 로직을 구현
    // 이 부분은 실제 구현에 따라 다를 수 있습니다.
    return false; // 기본적으로 겹치지 않는다고 가정
  };

  // 색상 결정 함수
  const getColorByCategory = (category) => {
    switch (category) {
      case '골목상권':
        return '#559abc'; 
      case '발달상권':
        return '#90EE90'; // 연한 초록색
      case '전통시장':
        return '#FFC0CB'; // 연분홍색
      case '관광특구':
        return '#FFD700'; // 금색
      default:
        return '#D3D3D3'; // 기본 회색
    }
  };

  useEffect(() => {
    fetchPlacesFromAPI(); // API를 한 번만 호출
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
    console.log("로그아웃 버튼 클릭됨");
    navigate('/'); // MainPage로 이동
  };

  const handleOwner = () => {
    navigate('/detail-sales'); // DetailSales 페이지로 이동
  };

  useEffect(() => {
    const loadKakaoMap = () => {
      const container = document.getElementById('ceo-map');
      const options = {
        center: new window.kakao.maps.LatLng(37.556229, 126.937079),
        level: 3
      };
      map = new window.kakao.maps.Map(container, options);

      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(37.556229, 126.937079),
        radius: 500,
        strokeWeight: 2,
        strokeColor: '#87CEEB',
        strokeOpacity: 1,
        fillColor: '#87CEEB',
        fillOpacity: 0.3
      });
      circle.setMap(map);

      if (userLocation){
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
      }

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

      window.kakao.maps.event.addListener(userMarker, 'mouseover', () => {
        infoWindow.open(map, marker);
      });

      window.kakao.maps.event.addListener(userMarker, 'mouseout', () => {
        infoWindow.close();
      });
    };

    if (window.kakao && window.kakao.maps && userLocation) {
      loadKakaoMap();ß
    }
  }, [navigate, userLocation]);

  return (
    <div className="ceo-main-container">
      <header className="ceo-main-header">
        <div className="logo-container">
          <img src={logo} alt="로고" className="logo-image" />
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
