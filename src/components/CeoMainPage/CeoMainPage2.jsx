import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CeoMainPage.css';

const CeoMainPage2 = () => {
  const navigate = useNavigate();
  const [randomRestaurants, setRandomRestaurants] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [places, setPlaces] = useState({
    restaurants: [],
    cafes: [],
  });
  const [category, setCategory] = useState('restaurants');
  const [userLocation, setUserLocation] = useState(null);
  const [zones, setZones] = useState([]);
  const storedId = sessionStorage.getItem('id');
  
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

  // 지도 데이터를 API에서 가져오기
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/colored-zones');
        const data = await response.json();
        console.log('Fetched zones data:', data);
        setZones(data);
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };
    fetchLocations();
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
    console.log('로그아웃 버튼 클릭됨');
    navigate('/logout'); // MainPage로 이동
  };

  const handleOwner = () => {
    navigate(`/detail-sales?id=${storedId}`); // DetailSales 페이지로 이동
  };

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error('Kakao Maps API가 로드되지 않았습니다.');
        return;
      }

      const container = document.getElementById('ceo-map');
      const options = {
        center: new window.kakao.maps.LatLng(37.556229, 126.937079),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      
      // zones 배열의 각 영역을 처리
      zones.forEach((zone) => {
        const { polygon, color } = zone;

        // polygon이 유효한 배열인지 확인
        if (Array.isArray(polygon)) {
          const path = polygon.map(([lat, lng]) => {
            return new window.kakao.maps.LatLng(parseFloat(lat), parseFloat(lng));
          });
          const polygonArea = new window.kakao.maps.Polygon({
            path: path,
            strokeWeight: 3,
            strokeColor: color,
            strokeOpacity: 0.3,
            fillColor: color,
            fillOpacity: 0.2,
          });

          polygonArea.setMap(map);
        } else {
          console.warn('Invalid polygon data:', polygon);
        }
      });

      // 500m 반경 원 추가
      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(37.556229, 126.937079),
        radius: 500, // 반경 500m
        strokeWeight: 2,
        strokeColor: '#87CEEB',
        strokeOpacity: 0.3,
        fillColor: '#87CEEB',
        fillOpacity: 0.2,
      });
      circle.setMap(map);

      // 사용자 위치 마커 추가
      if (userLocation) {
        const userMarkerPosition = new window.kakao.maps.LatLng(
          userLocation.latitude,
          userLocation.longitude
        );

        const userMarker = new window.kakao.maps.Marker({
          position: userMarkerPosition,
        });

        userMarker.setMap(map);
        map.setCenter(userMarkerPosition);

        // 사용자 마커 클릭 이벤트
        window.kakao.maps.event.addListener(userMarker, 'click', () => {
          navigate(`/store-detail?id=${storedId}`); // StoreDetail 페이지로 이동
        });

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              background-color: white;
              font-family: 'Pretendard', sans-serif;
            ">
              <h4 style="margin: 0; font-size: 16px; color: #333;">현재 위치</h4>
              <p style="margin: 5px 0 0; font-size: 14px; color: #666;">여기를 클릭하세요!</p>
            </div>
          `,
        });

        window.kakao.maps.event.addListener(userMarker, 'mouseover', () => {
          infoWindow.open(map, userMarker);
        });

        window.kakao.maps.event.addListener(userMarker, 'mouseout', () => {
          infoWindow.close();
        });
      }
    };

    // Kakao 지도 API가 로드된 후 처리
    if (window.kakao && window.kakao.maps && userLocation && zones.length > 0) {
      loadKakaoMap();
    }
  }, [userLocation, navigate, zones]);

  return (
    <div className="ceo-main-container">
      <header className="ceo-main-header">
        <div className="logo-container">
          <h1 className="logo">SpotRank</h1>
        </div>
        <div className="ceo-button-group">
          <button className="ceo-ceo-button" onClick={handleOwner}>
            나는 사장
          </button>
          <button className="ceo-logout-button" onClick={handleLogout}>
            Logout
          </button>
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
            <h2>
              핫플레이스 <span>({currentTime} 판매량 기준)</span>
            </h2>
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
            <div className="random-restaurants">{randomRestaurants || '로딩 중...'}</div>
          </div>
        </div>
        <div id="ceo-map" className="ceo-map-container" style={{ width: '100%', height: '100%' }}></div>
      </main>
    </div>
  );
};

export default CeoMainPage2;