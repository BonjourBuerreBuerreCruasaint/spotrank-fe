document.addEventListener('DOMContentLoaded', function() {
    // 시간별 매출 그래프
    const salesChart = new Chart(document.getElementById('salesChart'), {
        type: 'line',
        data: {
            labels: ['10시', '12시', '14시', '16시', '18시', '20시', '22시'],
            datasets: [{
                data: [30, 45, 60, 45, 55, 40, 35],
                borderColor: '#87CEEB',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            }
        }
    });

    // 메뉴 판매량 파이 차트
    const menuChart = new Chart(document.getElementById('menuChart'), {
        type: 'pie',
        data: {
            labels: ['카푸치노', '아이스 아메리카노', '바닐라 라떼', '카라멜 마끼아또'],
            datasets: [{
                data: [20, 40, 20, 20],
                backgroundColor: ['#87CEEB', '#FF6B6B', '#4ECDC4', '#45B7D1']
            }]
        }
    });

    // 주간 매출 막대 그래프
    const weeklyChart = new Chart(document.getElementById('weeklyChart'), {
        type: 'bar',
        data: {
            labels: ['월', '화', '수', '목', '금', '토', '일'],
            datasets: [{
                data: [300, 450, 320, 380, 400, 500, 450],
                backgroundColor: '#87CEEB'
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            }
        }
    });

    // 저장된 데이터 불러오기 함수
    function loadStoreData() {
        // 이미지 데이터 불러오기
        const savedImageData = localStorage.getItem('storeImageData');
        if (savedImageData) {
            try {
                const imageData = JSON.parse(savedImageData);
                
                // 메인 이미지 설정
                const mainImageDisplay = document.getElementById('mainImageDisplay');
                if (imageData.mainImage && imageData.mainImage !== '#') {
                    mainImageDisplay.src = imageData.mainImage;
                }

                // 추가 이미지 설정
                imageData.subImages.forEach((imgSrc, index) => {
                    if (imgSrc && imgSrc !== '#') {
                        const imgElement = document.getElementById(`subImage${index + 1}Display`);
                        if (imgElement) {
                            imgElement.src = imgSrc;
                        }
                    }
                });
            } catch (error) {
                console.error('이미지 데이터 로딩 중 오류:', error);
            }
        }

        // 설명 불러오기
        const savedDescription = localStorage.getItem('storeDescription');
        if (savedDescription) {
            document.getElementById('storeDescription').value = savedDescription;
        }
    }

    // 페이지 로드 시 데이터 불러오기
    loadStoreData();

    // localStorage 변경 감지 및 실시간 업데이트
    window.addEventListener('storage', function(e) {
        if (e.key === 'storeImageData' || e.key === 'storeDescription') {
            loadStoreData();
        }
    });

    // 실시간 데이터 업데이트 함수
    function updateCharts(realTimeData) {
        // 시간별 매출 그래프 업데이트
        salesChart.data.datasets[0].data = realTimeData.hourly_sales;
        salesChart.update();

        // 메뉴 판매량 차트 업데이트
        menuChart.data.labels = realTimeData.menu_names;
        menuChart.data.datasets[0].data = realTimeData.menu_sales;
        menuChart.update();

        // 메뉴 순위 텍스트 업데이트
        updateMenuRankings(realTimeData.menu_names, realTimeData.menu_sales);

        // 주간 매출 차트 업데이트
        weeklyChart.data.datasets[0].data = realTimeData.weekly_sales;
        weeklyChart.update();

        // 총 매출 업데이트
        document.querySelector('.total-sales p').textContent = 
            `총 매출: ${realTimeData.total_sales.toLocaleString()} 원`;
    }

    // 메뉴 순위 업데이트 함수
    function updateMenuRankings(menuNames, menuSales) {
        // 메뉴와 판매량을 결합하여 배열 생성
        const menuData = menuNames.map((name, index) => ({
            name: name,
            sales: menuSales[index]
        }));

        // 판매량 기준으로 정렬
        menuData.sort((a, b) => b.sales - a.sales);

        // 상위 4개 메뉴 순위 텍스트 업데이트
        for (let i = 0; i < 4 && i < menuData.length; i++) {
            const rankElement = document.getElementById(`menuRank${i + 1}`);
            if (rankElement) {
                rankElement.textContent = `${i + 1}위: ${menuData[i].name}`;
            }
        }
    }

    // 실시간 데이터 받아오기 예시
    function fetchRealTimeData() {
        // WebSocket 연결 예시
        const ws = new WebSocket('your_websocket_url');
        
        ws.onmessage = function(event) {
            const realTimeData = JSON.parse(event.data);
            updateCharts(realTimeData);
        };

        // 또는 주기적 API 호출 예시
        /*
        setInterval(async () => {
            try {
                const response = await fetch('your_api_endpoint');
                const realTimeData = await response.json();
                updateCharts(realTimeData);
            } catch (error) {
                console.error('데이터 업데이트 실패:', error);
            }
        }, 5000); // 5초마다 업데이트
        */
    }

    // 실시간 데이터 업데이트 시작
    fetchRealTimeData();
});