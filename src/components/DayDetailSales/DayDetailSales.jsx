import React from "react";
import { useNavigate } from "react-router-dom";
import "./DayDetailSales.css";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const DayDetailSales = () => {
  const navigate = useNavigate();
  const lineChartRef = React.useRef(null);
  const pieChartRef = React.useRef(null);
  const barChartInstance = React.useRef(null);
  const pieChartInstance = React.useRef(null);

  React.useEffect(() => {
    // Bar Chart
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }
    if (lineChartRef.current) {
      barChartInstance.current = new Chart(lineChartRef.current, {
        type: "bar",
        data: {
          labels: ["월", "화", "수", "목", "금", "토", "일"],
          datasets: [
            {
              label: "요일별 매출 분석",
              data: [300, 450, 200, 400, 350, 500, 300],
              backgroundColor: "rgba(135, 206, 235, 0.6)",
              borderColor: "#87CEEB",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '단위: 만원',
                padding: 20,
                align: 'center',
              },
              ticks: {
                callback: function(value) {
                  return value;
                },
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
              },
            },
          },
        },
      });
    }

    // Pie Chart
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }
    if (pieChartRef.current) {
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: ["카푸치노", "아메리카노", "바닐라라떼", "카라멜마끼아또"],
          datasets: [
            {
              label: "요일별 메뉴 판매량",
              data: [40, 30, 20, 10],
              backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0", "#FFCE56"],
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }
  }, []);

  return (
    <div className="day-detail-sales-container">
      <header
        className="day-detail-sales-header"
        onClick={() => navigate("/ceo-main")}
      >
        <h1>SpotRank</h1>
      </header>

      <div className="day-content-container">
        <nav className="day-detail-sales-sidebar">
          <ul>
            <li onClick={() => navigate("/detail-sales")}>실시간</li>
            <li onClick={() => navigate("/day-detail-sales")}>일간</li>
            <li onClick={() => navigate("/week-detail-sales")}>주간</li>
            <li>월간</li>
          </ul>
        </nav>

        <main className="day-main-content">
          <div className="day-chart-container">
            <div className="day-line-chart">
              <canvas
                ref={lineChartRef}
                style={{ width: "100%", height: "400px" }}
              ></canvas>
            </div>
            <div className="day-pie-chart">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
          <div className="day-table-section">
            <h2>요일별 매출 현황표</h2>
            <table>
              <thead>
                <tr>
                  <th>매장 이름</th>
                  <th>메뉴</th>
                  <th>가격</th>
                  <th>개수</th>
                  <th>매출 합계</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>예시 매장 1</td>
                  <td>카푸치노</td>
                  <td>5,000원</td>
                  <td>10개</td>
                  <td>50,000원</td>
                </tr>
                <tr>
                  <td>예시 매장 2</td>
                  <td>아메리카노</td>
                  <td>4,000원</td>
                  <td>15개</td>
                  <td>60,000원</td>
                </tr>
                <tr>
                  <td>예시 매장 3</td>
                  <td>바닐라라떼</td>
                  <td>6,000원</td>
                  <td>5개</td>
                  <td>30,000원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DayDetailSales;
