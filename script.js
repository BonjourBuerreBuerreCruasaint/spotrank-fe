// 카카오맵 API 초기화 예시
function initMap() {
    const mapContainer = document.getElementById('map');
    const mapOption = {
        center: new kakao.maps.LatLng(37.556, 126.937), // 신촌역 좌표
        level: 3
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 핫플레이스 위치 데이터
    const places = [
        { name: '후라토 식당', lat: 37.556, lng: 126.937, rank: 1 },
        { name: '핵밥', lat: 37.555, lng: 126.936, rank: 2 },
        // ... 나머지 장소들
    ];

    // 마커 생성 및 표시
    places.forEach(place => {
        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(place.lat, place.lng),
            map: map
        });

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, 'click', function() {
            alert(`${place.rank}위: ${place.name}`);
        });
    });
}

// 실시간 순위 업데이트 함수
function updateRankings() {
    setInterval(() => {
        fetch('/api/rankings')
            .then(response => response.json())
            .then(data => {
                // 순위 목록 업데이트 로직
            });
    }, 5000); // 5초마다 업데이트
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    updateRankings();
}); 