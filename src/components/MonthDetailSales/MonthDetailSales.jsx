import React from "react";
import { useNavigate } from "react-router-dom";
import "./MonthDetailSales.css";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const MonthDetailSales = () => {
  const navigate = useNavigate();
  const lineChartRef = React.useRef(null);
  const pieChartRef = React.useRef(null);
  const lineChartInstance = React.useRef(null);
  const pieChartInstance = React.useRef(null);

  React.useEffect(() => {
    // Line Chart
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy(); // 기존 차트를 파괴
    }
    if (lineChartRef.current) {
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: "bar",
        data: {
          labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
          datasets: [
            {
              label: "월간 매출 분석",
              data: [1500, 1800, 2000, 1700, 1900, 2100, 2300, 2500, 2700, 2900, 3100, 3300],
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
                position: 'center',
              },
            },
          },
        },
      });
    }

    // Pie Chart
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy(); // 기존 차트를 파괴
    }
    if (pieChartRef.current) {
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
          datasets: [
            {
              label: "월간 메뉴 판매량",
              data: [1000, 1500, 1800, 1500, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200],
              backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0", "#FFCE56", "#FF6384", "#36A2EB", "#4BC0C0", "#FFCE56", "#FF6384", "#36A2EB", "#4BC0C0", "#FFCE56"],
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
    <div className="month-detail-sales-container">
      <header
        className="month-detail-sales-header"
        onClick={() => navigate("/ceo-main")}
      >
        <h1>SpotRank</h1>
      </header>

      <div className="month-content-container">
        <nav className="month-detail-sales-sidebar">
          <ul>
            <li onClick={() => navigate("/detail-sales")}>실시간</li>
            <li onClick={() => navigate("/day-detail-sales")}>일간</li>
            <li onClick={() => navigate("/week-detail-sales")}>주간</li>
            <li onClick={() => navigate("/month-detail-sales")}>월간</li>
          </ul>
        </nav>

        <main className="month-main-content">
          <div className="month-chart-container">
            <div className="month-line-chart">
              <canvas
                ref={lineChartRef}
                style={{ width: "100%", height: "400px" }}
              ></canvas>
            </div>
            <div className="month-pie-chart">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
          <div className="month-table-section">
            <h2>월간 매출 현황표</h2>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>월</th>
                    <th>총 판매량</th>
                    <th>총 매출</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1월</td>
                    <td>1,000개</td>
                    <td>15,000,000원</td>
                  </tr>
                  <tr>
                    <td>2월</td>
                    <td>1,500개</td>
                    <td>18,000,000원</td>
                  </tr>
                  <tr>
                    <td>3월</td>
                    <td>1,800개</td>
                    <td>20,000,000원</td>
                  </tr>
                  <tr>
                    <td>4월</td>
                    <td>1,500개</td>
                    <td>17,000,000원</td>
                  </tr>
                  <tr>
                    <td>5월</td>
                    <td>1,800개</td>
                    <td>19,000,000원</td>
                  </tr>
                  <tr>
                    <td>6월</td>
                    <td>2,000개</td>
                    <td>21,000,000원</td>
                  </tr>
                  <tr>
                    <td>7월</td>
                    <td>2,200개</td>
                    <td>23,000,000원</td>
                  </tr>
                  <tr>
                    <td>8월</td>
                    <td>2,400개</td>
                    <td>25,000,000원</td>
                  </tr>
                  <tr>
                    <td>9월</td>
                    <td>2,600개</td>
                    <td>27,000,000원</td>
                  </tr>
                  <tr>
                    <td>10월</td>
                    <td>2,800개</td>
                    <td>29,000,000원</td>
                  </tr>
                  <tr>
                    <td>11월</td>
                    <td>3,000개</td>
                    <td>31,000,000원</td>
                  </tr>
                  <tr>
                    <td>12월</td>
                    <td>3,200개</td>
                    <td>33,000,000원</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MonthDetailSales;
