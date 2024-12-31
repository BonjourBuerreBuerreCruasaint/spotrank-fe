document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 메뉴 처리
    const menuItems = document.querySelectorAll('.side-menu li');
    const viewContents = document.querySelectorAll('.view-content');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // 활성 메뉴 변경
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // 해당 뷰 표시
            const viewId = this.dataset.view + '-view';
            viewContents.forEach(view => {
                view.classList.remove('active');
                if (view.id === viewId) {
                    view.classList.add('active');
                }
            });
        });
    });

    // 실시간 매출 차트
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
            plugins: { legend: { display: false } }
        }
    });

    // 메뉴 판매량 차트
    const menuChart = new Chart(document.getElementById('menuChart'), {
        type: 'pie',
        data: {
            labels: ['카푸치노', '아메리카노', '바닐라라떼', '카라멜마끼아또'],
            datasets: [{
                data: [40, 20, 20, 20],
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
            }]
        }
    });

    const dayMenuChart = new Chart(document.getElementById('dayMenuChart'), {
        type: 'pie',
        data: {
            labels: ['카푸치노', '아메리카노', '바닐라라떼', '카라멜마끼아또'],
            datasets: [{
                data: [40, 20, 20, 20],
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
            }]
        }
    });

    const weekMenuChart = new Chart(document.getElementById('weekMenuChart'), {
        type: 'pie',
        data: {
            labels: ['카푸치노', '아메리카노', '바닐라라떼', '카라멜마끼아또'],
            datasets: [{
                data: [40, 20, 20, 20],
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
            }]
        }
    });

    const monthMenuChart = new Chart(document.getElementById('monthMenuChart'), {
        type: 'pie',
        data: {
            labels: ['카푸치노', '아메리카노', '바닐라라떼', '카라멜마끼아또'],
            datasets: [{
                data: [40, 20, 20, 20],
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
            }]
        }
    });

    // 일별 매출 차트
    const dailyChart = new Chart(document.getElementById('dailyChart'), {
        type: 'bar',
        data: {
            labels: ['월', '화', '수', '목', '금', '토', '일'],
            datasets: [{
                data: [300, 450, 320, 380, 400, 500, 450],
                backgroundColor: '#87CEEB'
            }]
        },
        options: {
            plugins: { legend: { display: false } }
        }
    });

    // 주간 매출 차트
    const weeklyChart = new Chart(document.getElementById('weeklyChart'), {
        type: 'line',
        data: {
            labels: ['1주차', '2주차', '3주차', '4주차'],
            datasets: [{
                data: [1500, 1800, 2000, 1700],
                borderColor: '#87CEEB',
                fill: true
            }]
        },
        options: {
            plugins: { legend: { display: false } }
        }
    });

    // 실시간 매출 데이터 수정
    const realtimeSalesData = [
        { time: '14:15', menu: '원조김밥', price: 3000, quantity: 3 },
        { time: '14:15', menu: '원조김밥', price: 3000, quantity: 5 },
        { time: '14:16', menu: '참치김밥', price: 4500, quantity: 2 },
        { time: '14:17', menu: '돈까스', price: 7000, quantity: 1 }
    ];

    // 실시간 매출 현황표와 총 매출 현황표 업데이트 함수
    function updateSalesTables(data) {
        // 실시간 매출 현황표 업데이트
        const realtimeBody = document.querySelector('#realtimeSalesTable tbody');
        realtimeBody.innerHTML = '';

        // 최신 거래가 위에 오도록 정렬
        data.sort((a, b) => {
            return new Date('2024-01-01 ' + b.time) - new Date('2024-01-01 ' + a.time);
        });

        // 메뉴별 총계 계산을 위한 객체
        const menuTotals = {};

        // 실시간 매출 현황표 업데이트
        data.forEach(item => {
            // 실시간 매출 현황표에 행 추가
            const row = document.createElement('tr');
            const subtotal = item.price * item.quantity;
            row.innerHTML = `
                <td>${item.time}</td>
                <td>${item.menu}</td>
                <td>${item.price.toLocaleString()}원</td>
                <td>${item.quantity}개</td>
                <td>${subtotal.toLocaleString()}원</td>
            `;
            realtimeBody.appendChild(row);

            // 메뉴별 총계 계산
            if (!menuTotals[item.menu]) {
                menuTotals[item.menu] = {
                    price: item.price,
                    quantity: 0,
                    total: 0
                };
            }
            menuTotals[item.menu].quantity += item.quantity;
            menuTotals[item.menu].total += subtotal;
        });

        // 총 매출 현황표 업데이트
        const totalBody = document.querySelector('#totalSalesTable tbody');
        totalBody.innerHTML = '';
        let grandTotal = 0;

        // 메뉴별 총계를 테이블에 추가
        Object.entries(menuTotals).forEach(([menu, data]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${menu}</td>
                <td>${data.price.toLocaleString()}원</td>
                <td>${data.quantity}개</td>
                <td>${data.total.toLocaleString()}원</td>
            `;
            totalBody.appendChild(row);
            grandTotal += data.total;
        });

        // 총 합계 금액 업데이트
        document.getElementById('grandTotal').textContent = 
            grandTotal.toLocaleString() + '원';
    }

    // 실시간 데이터 시뮬레이션
    function simulateRealTimeData() {
        // 초기 데이터로 테이블 업데이트
        updateSalesTables(realtimeSalesData);

        // 5초마다 새로운 거래 추가
        setInterval(() => {
            const currentTime = new Date();
            const timeString = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
            
            const newTransaction = {
                time: timeString,
                menu: ['원조김밥', '참치김밥', '돈까스'][Math.floor(Math.random() * 3)],
                price: [3000, 4500, 7000][Math.floor(Math.random() * 3)],
                quantity: Math.floor(Math.random() * 5) + 1
            };

            // 새로운 거래를 배열에 추가
            realtimeSalesData.push(newTransaction);
            
            // 두 테이블 모두 업데이트
            updateSalesTables(realtimeSalesData);
        }, 5000);
    }

    // 초기화
    simulateRealTimeData();

    // 더미 데이터 생성
    const dummyData = {
        '2024-03-01': { 
            sales: 850000,
            menuSales: {
                '카푸치노': 25,
                '아메리카노': 42,
                '바닐라라떼': 18,
                '카라멜마끼아또': 15
            }
        },
        '2024-03-02': {
            sales: 920000,
            menuSales: {
                '카푸치노': 30,
                '아메리카노': 38,
                '바닐라라떼': 22,
                '카라멜마끼아또': 20
            }
        },
        // ... 더 많은 날짜 데이터 추가
    };

    // Flatpickr 초기화
    const monthlyCalendar = flatpickr("#monthlyCalendar", {
        inline: true,
        defaultDate: "today",
        maxDate: "today",
        dateFormat: "Y-m-d",
        locale: "ko", // 한국어 설정
        enable: Object.keys(dummyData), // 더미 데이터가 있는 날짜만 선택 가능
        mode: "single", // 단일 선택 모드
        onChange: function(selectedDates, dateStr) {
            updateDailySalesInfo(dateStr);
        }
    });

    // 선택된 날짜의 매출 정보 업데이트
    function updateDailySalesInfo(dateStr) {
        const data = dummyData[dateStr];
        if (!data) return;

        // 매출액 표시
        const priceElement = document.getElementById('price');
        priceElement.innerHTML = `
            <h4>선택된 날짜: ${dateStr}</h4>
            <p>총 매출: ${data.sales.toLocaleString()}원</p>
            <h5>메뉴별 판매량:</h5>
            <ul>
                ${Object.entries(data.menuSales).map(([menu, count]) => 
                    `<li>${menu}: ${count}개</li>`
                ).join('')}
            </ul>
        `;

        // 차트 업데이트
        updateMonthlyCharts(data);
    }

    // 차트 업데이트 함수
    function updateMonthlyCharts(data) {
        // 메뉴 판매량 차트 업데이트
        monthlyMenuChart.data.datasets[0].data = Object.values(data.menuSales);
        monthlyMenuChart.update();

        // 매출 분석표 차트 업데이트 (시간대별 매출 - 더미 데이터)
        const hourlyData = generateHourlyData(data.sales);
        monthlySalesChart.data.datasets[0].data = hourlyData;
        monthlySalesChart.update();
    }

    // 시간대별 매출 더미 데이터 생성
    function generateHourlyData(totalSales) {
        const hours = [];
        let remaining = totalSales;
        for (let i = 0; i < 7; i++) {
            const hourSale = Math.floor(remaining * (Math.random() * 0.3 + 0.1));
            hours.push(hourSale);
            remaining -= hourSale;
        }
        return hours;
    }

    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .sales-info {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .sales-info h4 {
            margin-bottom: 10px;
            color: #333;
        }
        .sales-info ul {
            list-style: none;
            padding: 0;
        }
        .sales-info li {
            margin: 5px 0;
            color: #666;
        }
        .flatpickr-calendar {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
}); 