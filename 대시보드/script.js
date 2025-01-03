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

    // 저장된 이미지 불러오기
    function loadStoreImages() {
        // 메인 이미지 불러오기
        const mainImage = localStorage.getItem('store_image_mainImage');
        if (mainImage) {
            document.getElementById('mainImageDisplay').src = mainImage;
        }

        // 서브 이미지 불러오기
        for (let i = 1; i <= 6; i++) {
            const subImage = localStorage.getItem(`store_image_subImage${i}`);
            if (subImage) {
                document.getElementById(`subImage${i}Display`).src = subImage;
            }
        }

        // 설명 불러오기
        const description = localStorage.getItem('storeDescription');
        if (description) {
            document.getElementById('storeDescription').value = description;
        }
    }

    // 페이지 로드 시 이미지 불러오기
    loadStoreImages();

    // localStorage 변경 감지
    window.addEventListener('storage', function(e) {
        if (e.key.startsWith('store_image_') || e.key === 'storeDescription') {
            loadStoreImages();
        }
    });
});