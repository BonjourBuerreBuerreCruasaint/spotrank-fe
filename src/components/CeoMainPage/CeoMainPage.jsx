import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CeoMainPage.css';

const Legend = () => {
  return (
    <div className="legend-container">
      <div className="legend-texts">
        <span className="legend-text">골목상권</span>
        <span className="legend-text">발달상권</span>
        <span className="legend-text">전통시장</span>
        <span className="legend-text">관광특구</span>
      </div>
      <div className="legend-bar">
        <span className="legend-color" style={{ backgroundColor: '#82c3ec' }}></span>
        <span className="legend-color" style={{ backgroundColor: '#009eff' }}></span>
        <span className="legend-color" style={{ backgroundColor: '#ffbbcc' }}></span>
        <span className="legend-color" style={{ backgroundColor: '#0014ff' }}></span>
      </div>
      <div className="legend-label">상권영역 분류</div>
    </div>
  );
};

const NewLegend = () => {
  return (
    <div className="new-legend-container">
      <div className="new-legend-texts">
        <span className="new-legend-text">적음</span>
        <span className="new-legend-text">많음</span>
      </div>
      <div className="new-legend-bar">
        <span className="new-legend-color" style={{ backgroundColor: '#ffff00' }}></span>
        <span className="new-legend-color" style={{ backgroundColor: '#ffa500' }}></span>
        <span className="new-legend-color" style={{ backgroundColor: '#ff0000' }}></span>
      </div>
      <div className="new-legend-label">유동인구(2024년 2분기)</div>
    </div>
  );
};

const AnotherLegend = () => {
  return (
    <div className="another-legend-container">
      <div className="another-legend-texts">
        <span className="another-legend-text">적음</span>
        <span className="another-legend-text">많음</span>
      </div>
      <div className="another-legend-bar">
        <span className="another-legend-color" style={{ backgroundColor: '#666666' }}></span>
        <span className="another-legend-color" style={{ backgroundColor: '#dba979' }}></span>
        <span className="another-legend-color" style={{ backgroundColor: '#ffdb5c' }}></span>
        <span className="another-legend-color" style={{ backgroundColor: '#88d66c' }}></span>
        <span className="another-legend-color" style={{ backgroundColor: '#ffff00' }}></span>
      </div>
      <div className="another-legend-label">매출액</div>
    </div>
  );
};


const CeoMainPage = () => {
  const navigate = useNavigate();
  const [randomRestaurants, setRandomRestaurants] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [places, setPlaces] = useState({
    restaurants: [],
    cafes: [],
  });
  const [category, setCategory] = useState('restaurants'); // 카테고리 상태
  const [viewMode, setViewMode] = useState('상권영역'); // 새로운 상태 추가
  const [userLocation, setUserLocation] = useState(null);
  let map; // map 변수를 여기서 정의
  let polygons = []; // 폴리곤을 저장할 배열
  let circles = []; // 서클을 저장할 배열
  let zones = []; // 새로운 폴리곤을 저장할 배열

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

  // 랜덤 추천 식당 업데이트
  useEffect(() => {
    if (places.restaurants.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * places.restaurants.length);
        setRandomRestaurants(places.restaurants[randomIndex].shop_name);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [places.restaurants]); // places.restaurants 추가
  

  // Flask API에서 데이터 가져오기
  const fetchPlacesFromAPI = useCallback(async () => {
    try {
      polygons.forEach(polygon => polygon.setMap(null)); // 기존 폴리곤을 지도에서 제거
      polygons = []; // 폴리곤 배열 초기화

      const seoulDataResponse = await fetch('http://127.0.0.1:5000/api/seouldata');
      if (!seoulDataResponse.ok) throw new Error('서울 데이터 요청 실패');
      
      let seoulData = await seoulDataResponse.json();

      if (!Array.isArray(seoulData)) {
        if (seoulData) {
          seoulData = [seoulData]; // 단일 객체일 경우 배열로 변환
        } else {
          throw new Error('API 응답 구조가 올바르지 않습니다.');
        }
      }

      const areas = seoulData; // DATA 배열 사용

      areas.forEach(area => {
        const lat = area.lat !== undefined ? parseFloat(area.lat) : null; // "lat" 값 사용
        const lng = area.lng !== undefined ? parseFloat(area.lng) : null; // "lng" 값 사용

        if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
          console.error(`위도 또는 경도가 유효하지 않음: 위도=${lat}, 경도=${lng}`);
          return; // 유효하지 않은 경우 다음 반복으로 넘어감
        }

        const category = area.commercial_district; // "commercial_district" 값 사용
        const color = getColorByCategory(category); // 색상 결정

        // 정사각형 생성 (사이즈 0.00008)
        const size = 0.0020; // 정사각형의 크기
        const path = [
          new window.kakao.maps.LatLng(lat + size, lng + size), // 오른쪽 위
          new window.kakao.maps.LatLng(lat + size, lng - size), // 오른쪽 아래
          new window.kakao.maps.LatLng(lat - size, lng - size), // 왼쪽 아래
          new window.kakao.maps.LatLng(lat - size, lng + size)  // 왼쪽 위
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
            fillOpacity: 0.2
          });
          polygons.push(polygon); // 폴리곤 객체 저장
        }
      });

      showPolygons(); // 폴리곤을 지도에 추가

    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
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
        return '#82c3ec'; //연한파란색
      case '발달상권':
        return '#009eff'; // 진한파란색
      case '전통시장':
        return '#ffbbcc'; // 연분홍색
      case '관광특구':
        return '#0014ff'; // 금색
      default:
        return '#D3D3D3'; // 기본 회색
    }
  };

  // 유동인구 데이터 가져오기 및 Circle 추가
  const fetchPopulationData = useCallback(async () => {
    try {
      circles.forEach(circle => circle.setMap(null)); // 기존 서클을 지도에서 제거
      circles = []; // 서클 배열 초기화

      const response = await fetch('http://127.0.0.1:5000/api/jinfinalpeople');
      if (!response.ok) throw new Error('유동인구 데이터 요청 실패');
      
      const rawData = await response.json();
      console.log(rawData);
  
      // 데이터 배열로 변환 (헤더 제외)
      const dataLines = rawData.content.slice(1); // 첫 번째 줄은 헤더
      const data = dataLines
        .filter(line => line.trim() !== '') // 빈 줄 제거
        .map(line => {
          const [ , , , TotalPeople, lat, lng] = line.split(',');
          return {
            TotalPeople: isNaN(parseInt(TotalPeople, 10)) ? 0 : parseInt(TotalPeople, 10),
            lat: isNaN(parseFloat(lat)) ? 0 : parseFloat(lat),
            lng: isNaN(parseFloat(lng)) ? 0 : parseFloat(lng),
          };
        });
  
      // 각 데이터 항목 출력
      data.forEach((item, index) => {
        const { TotalPeople, lat, lng } = item;
      });
  
      // 지도에 Polyline 추가
      data.forEach((item) => {
        const { TotalPeople, lat, lng } = item;

        if (lat === 0 || lng === 0) {
          console.warn(`잘못된 좌표 데이터: ${item}`);
          return;
        }

        const color = getColorByPopulation(TotalPeople);
  
        // Circle 객체 생성
        const circle = new window.kakao.maps.Circle({
          center: new window.kakao.maps.LatLng(lat, lng),
          radius: 170, // 예시 반지름
          strokeWeight: 2,
          strokeColor: color,
          strokeOpacity: 0.3,
          fillColor: color,
          fillOpacity: 0.2,
        });
        circles.push(circle); // 서클 객체 저장
  
        // Circle 지도에 추가
        circle.setMap(map);
      });
    } catch (error) {
      console.error('유동인구 데이터 가져오기 실패:', error);
    }
  }, []);
  
  // 유동인구 수에 따른 색상 결정 함수
  const getColorByPopulation = (TotalPeople) => {
    if (TotalPeople >= 10000000) {
      return "#FF0000"; // 빨간색
    } else if (TotalPeople >= 1000000) {
      return "#FFA500"; // 주황색
    } else {
      return "#FFF323"; // 노란색
    }
  };
  
  const showNewPolygons = (newPolygons) => {
    console.log('showNewPolygons called');
    newPolygons.forEach(Newpolygon => {
      Newpolygon.setMap(map); // 폴리곤을 지도에 추가
    });
  };

  const getColorBySalesRank = (rank, total_count) => {
    const percent = (rank / total_count) * 100;

    if (percent <= 10) return '#FF0000'; // 빨간색
    if (percent <= 35) return '#88d66c'; // 녹색
    if (percent <= 60) return '#ffdb5c'; // 노란색
    if (percent <= 80) return '#dba979'; // 갈색
    return '#666666'; // 회색
  };

  const fetchNewPolygonData = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/colored-zones');
      if (!response.ok) throw new Error('새로운 폴리곤 데이터 요청 실패');

      const newData = await response.json();

      const newPolygons = []; // 새로운 폴리곤을 저장할 배열
      const total_count = newData.length; // 전체 데이터 개수

      // total_sales 기준으로 데이터 정렬
      const sortedData = [...newData].sort((a, b) => b.total_sales - a.total_sales);

      sortedData.forEach((store, index) => {
        const { lat, lng, total_sales } = store;

        // 색상 결정
        const color = getColorBySalesRank(index + 1, total_count);

        // 정사각형 폴리곤 생성
        const size = 0.00010; // 정사각형의 크기
        const path = [
          new window.kakao.maps.LatLng(lat + size, lng + size),
          new window.kakao.maps.LatLng(lat + size, lng - size),
          new window.kakao.maps.LatLng(lat - size, lng - size),
          new window.kakao.maps.LatLng(lat - size, lng + size)
        ];

        const Newpolygon = new window.kakao.maps.Polygon({
          path: path,
          strokeWeight: 1,
          strokeColor: color,
          strokeOpacity: 0.5,
          fillColor: color,
          fillOpacity: 0.25
        });
        newPolygons.push(Newpolygon); // 새로운 폴리곤 객체 저장
        Newpolygon.setMap(map); // 폴리곤을 지도에 추가
      });

    } catch (error) {
      console.error('새로운 폴리곤 데이터 가져오기 실패:', error);
    }
  }, []);

  useEffect(() => {
    // 초기 로딩 시 데이터 가져오기
    const loadData = async () => {
      await fetchPlacesFromAPI(); // 기존 상권역 데이터 가져오기
      await fetchPopulationData(); // 기존 유동인구 데이터 가져오기
      await fetchNewPolygonData(); // 새로운 폴리곤 데이터 가져오기
      showPolygons(); // 초기에는 폴리곤을 보여줌
      showCircles(); // 초기에는 서클을 보여줌
      showNewPolygons(zones); // 새로운 폴리곤을 지도에 추가
    };
    loadData();
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
      if (!window.kakao || !window.kakao.maps) {
        console.error("카카오맵 API가 로드되지 않았습니다.");
        return;
      }
  
      const container = document.getElementById('ceo-map');
      const options = {
        center: new window.kakao.maps.LatLng(37.556229, 126.937079),
        level: 3,
      };
      map = new window.kakao.maps.Map(container, options);
  
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
  
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
              <h4 style="margin: 0; font-size: 16px; color: #333;">커피빈 신촌점</h4>
              <p style="margin: 5px 0 0; font-size: 14px; color: #666;">평점: 5.0</p>
            </div>
          `,
          removable: true,
        });
  
        // 마커에 마우스 오버 이벤트 등록
        window.kakao.maps.event.addListener(userMarker, 'mouseover', () => {
          userInfoWindow.open(map, userMarker);
        });
  
        // 마커에 마우스 아웃 이벤트 등록
        window.kakao.maps.event.addListener(userMarker, 'mouseout', () => {
          userInfoWindow.close();
        });
  
        // 500m 범위 원 생성
        const circle = new window.kakao.maps.Circle({
          center: userMarkerPosition, // 원의 중심좌표
          radius: 500, // 미터 단위의 반지름
          strokeWeight: 2, // 선의 두께
          strokeColor: '#87CEEB', // 선의 색깔
          strokeOpacity: 0.8, // 선의 불투명도
          strokeStyle: 'solid', // 선의 스타일
          fillColor: '#87CEEB', // 채우기 색깔
          fillOpacity: 0.2, // 채우기 불투명도
        });
  
        // 원을 지도에 표시
        circle.setMap(map);
  
        // 유동인구 데이터 가져오기 및 Polyline 추가
        fetchPopulationData();
      }
    };
    console.log(userLocation);
    if (window.kakao && window.kakao.maps && userLocation) {
      loadKakaoMap();
    }
  }, [navigate, userLocation]);

  // 지도에 폴리곤 추가
  const showPolygons = () => {
    polygons.forEach(polygon => {
      polygon.setMap(map); // 폴리곤을 지도에 추가
    });
  };

  // 지도에 서클 추가
  const showCircles = () => {
    circles.forEach(circle => {
      circle.setMap(map); // 서클을 지도에 추가
    });
  };


  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      console.log('Kakao Maps API loaded');
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="ceo-main-container">
      <header className="ceo-main-header">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1 onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>SpotRank</h1>
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
        <div className="vertical-toggle">
        </div>
      </main>
      <Legend />
      <NewLegend />
      <AnotherLegend />
    </div>
  );
};

export default CeoMainPage;
