import React from "react";
import { useNavigate } from "react-router-dom";
import "./DetailSales.css";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const DetailSales = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
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
        type: "line",
        data: {
          labels: ["12시", "14시", "16시", "18시", "20시", "22시"],
          datasets: [
            {
              label: "매출 분석",
              data: [30, 60, 50, 80, 40, 20],
              backgroundColor: "rgba(135, 206, 235, 0.2)",
              borderColor: "#87CEEB",
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          layout: {
            padding: {
              top: -10,
              bottom: -5,
              left: 10,
              right: 10,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
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
          labels: ["카츠/스노", "아메리카노", "버블티/타로", "기타/간이 메뉴"],
          datasets: [
            {
              label: "시간별 메뉴 판매량",
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
  }, []); // 의존성 배열: 빈 배열로 설정

  return (
    <div className="detail-sales-container">
      <header
        className="detail-sales-header"
        onClick={() => navigate("/ceo-main")} // navigate 사용
      >
        <h1>SpotRank</h1>
      </header>

      <div className="content-container">
        <nav className="detail-sales-sidebar">
          <ul>
            <li>실시간</li>
            <li>주간</li>
            <li>월간</li>
          </ul>
        </nav>

        <main className="main-content">
          <div className="chart-container">
            <div className="line-chart">
              <canvas
                ref={lineChartRef}
                style={{
                  width: "562px",
                  height: "300px",
                  boxSizing: "border-box",
                  display: "block",
                }}
                width="703"
                height="234"
              ></canvas>
            </div>
            <div className="pie-chart">
              <canvas ref={pieChartRef} style={{ width: "100%", height: "100px" }}></canvas>
            </div>
          </div>
          <div className="summary-section">
            <h2>총 매출 현황표</h2>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailSales;
