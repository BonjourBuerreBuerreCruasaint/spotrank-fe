import React from "react";
import { useNavigate } from "react-router-dom";
import "./WeekDetailSales.css";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const WeekDetailSales = () => {
  const navigate = useNavigate();
  const barChartRef = React.useRef(null);
  const pieChartRef = React.useRef(null);
  const barChartInstance = React.useRef(null);
  const pieChartInstance = React.useRef(null);

  React.useEffect(() => {
    // Bar Chart
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }
    if (barChartRef.current) {
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels: ["1주차", "2주차", "3주차", "4주차"],
          datasets: [
            {
              label: "주간 매출 분석",
              data: [500, 750, 1000, 600],
              backgroundColor: "rgba(135, 206, 235, 0.6)",
              borderColor: "#87CEEB",
              borderWidth: 2,
              fill: true,
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
                position: 'center',
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
          labels: ["1주차", "2주차", "3주차", "4주차"],
          datasets: [
            {
              label: "주간 메뉴 판매량",
              data: [100, 150, 200, 120],
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
    <div className="week-detail-sales-container">
      <header
        className="week-detail-sales-header"
        onClick={() => navigate("/ceo-main")}
      >
        <h1>SpotRank</h1>
      </header>

      <div className="week-content-container">
        <nav className="week-detail-sales-sidebar">
          <ul>
            <li onClick={() => navigate("/detail-sales")}>실시간</li>
            <li onClick={() => navigate("/day-detail-sales")}>일간</li>
            <li onClick={() => navigate("/week-detail-sales")}>주간</li>
            <li onClick={() => navigate("/month-detail-sales")}>월간</li>
          </ul>
        </nav>

        <main className="week-main-content">
          <div className="week-chart-container">
            <div className="week-line-chart">
              <canvas
                ref={barChartRef}
                style={{ width: "100%", height: "400px" }}
              ></canvas>
            </div>
            <div className="week-pie-chart">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
          <div className="week-table-section">
            <h2>주간 매출 현황표</h2>
            <table>
              <thead>
                <tr>
                  <th>주차</th>
                  <th>판매량</th>
                  <th>매출 합계</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1주차</td>
                  <td>100개</td>
                  <td>5,000,000원</td>
                </tr>
                <tr>
                  <td>2주차</td>
                  <td>150개</td>
                  <td>7,500,000원</td>
                </tr>
                <tr>
                  <td>3주차</td>
                  <td>200개</td>
                  <td>10,000,000원</td>
                </tr>
                <tr>
                  <td>4주차</td>
                  <td>120개</td>
                  <td>6,000,000원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WeekDetailSales;
