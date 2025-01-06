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
      // 서울 열린 데이터 광장에서 데이터 가져오기
      const seoulDataResponse = await fetch('http://127.0.0.1:5000/api/business-areas'); // Flask API URL
      if (!seoulDataResponse.ok) throw new Error('서울 데이터 요청 실패');
      
      const seoulData = await seoulDataResponse.json(); // JSON으로 변환
      console.log('서울 데이터:', seoulData); // 데이터 확인을 위한 로그

      // TbgisTrdarRelm.row 배열을 가져오기
      const areas = seoulData.TbgisTrdarRelm.row;

      // 지역별 색상 구분을 위한 좌표와 컬럼명 사용
      if (Array.isArray(areas)) {
        areas.forEach(area => {
          const latitude = parseFloat(area.YDNTS_VALUE); // 위도
          const longitude = parseFloat(area.XCNTS_VALUE); // 경도
          const category = area.trdar_se_cd_nm; // 카테고리
          const color = getColorByCategory(category); // 색상 결정

          // 위도, 경도를 기준으로 사각형의 경계 좌표 계산
          const path = [
            new window.kakao.maps.LatLng(latitude, longitude), // 좌상단
            new window.kakao.maps.LatLng(latitude, longitude + 0.0005), // 우상단 (0.0005는 약 50m)
            new window.kakao.maps.LatLng(latitude + 0.0005, longitude + 0.0005), // 우하단
            new window.kakao.maps.LatLng(latitude + 0.0005, longitude) // 좌하단
          ];

          // 다각형 생성
          const polygon = new window.kakao.maps.Polygon({
            path: path,
            strokeWeight: 2,
            strokeColor: color,
            strokeOpacity: 0.8,
            fillColor: color,
            fillOpacity: 0.3
          });
          polygon.setMap(map); // map에 다각형 추가
        });
      } else {
        console.error('areas는 배열이 아닙니다:', areas);
      }

    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  }, []);

  // 색상 결정 함수
  const getColorByCategory = (category) => {
    switch(category) {
      case '골목상권':
        return '#87CEEB';
        break; // 하늘색
      case '발달상권':
        return '#90EE90';
        break; // 연한 초록색
      case '전통시장':
        return '#FFC0CB';
        break; // 연분홍색
      case '관광특구':
        return '#FFD700';
        break; // 금색
      default:
        return '#D3D3D3';
        break; // 기본 회색
    }
  };

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
    navigate('/detail-sales'); // DetailSales 페이지로 이동
  };

  useEffect(() => {
    const loadKakaoMap = () => {
      const container = document.getElementById('ceo-map');
      const options = {
        center: new window.kakao.maps.LatLng(37.556229, 126.937079),
        level: 3
      };
      map = new window.kakao.maps.Map(container, options); // map 변수를 여기서 정의

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
