import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MonthDetailSales.css";
import { Chart, registerables } from "chart.js";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RechartsResponsiveContainer,
} from "recharts";

Chart.register(...registerables);

const MonthDetailSales = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lineChartRef = React.useRef(null);
  const pieChartRef = React.useRef(null);
  const lineChartInstance = React.useRef(null);
  const pieChartInstance = React.useRef(null);

  // 월간 매출 데이터
  const lineData = [
    { month: "1월", sales: 1500 },
    { month: "2월", sales: 1800 },
    { month: "3월", sales: 2000 },
    { month: "4월", sales: 1700 },
    { month: "5월", sales: 1900 },
    { month: "6월", sales: 2100 },
    { month: "7월", sales: 2300 },
    { month: "8월", sales: 2500 },
    { month: "9월", sales: 2700 },
    { month: "10월", sales: 2900 },
    { month: "11월", sales: 3100 },
    { month: "12월", sales: 3300 },
  ];

  // PieChart 데이터
  const pieData = [
    { name: "1월", value: 1000 },
    { name: "2월", value: 1500 },
    { name: "3월", value: 1800 },
    { name: "4월", value: 1500 },
    { name: "5월", value: 1800 },
    { name: "6월", value: 2000 },
    { name: "7월", value: 2200 },
    { name: "8월", value: 2400 },
    { name: "9월", value: 2600 },
    { name: "10월", value: 2800 },
    { name: "11월", value: 3000 },
    { name: "12월", value: 3200 },
  ];

  const COLORS = ["#87CEEB", "#CEDFCD", "#C2C2CA", "#FFDBA4"];

  React.useEffect(() => {
    // Line Chart
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy(); // 기존 차트를 파괴
    }
    if (lineChartRef.current) {
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: lineData.map(data => data.month),
          datasets: [
            {
              label: "월간 매출 분석",
              data: lineData.map(data => data.sales),
              backgroundColor: "rgba(135, 206, 235, 0.2)",
              borderColor: "#87CEEB",
              borderWidth: 2,
              fill: true,
              tension: 0.4, // 곡선의 부드러움을 조정
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
            x: {
              title: {
                display: true,
                text: '월',
                padding: 20,
                position: 'bottom',
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}만원`;
                },
              },
            },
            legend: {
              display: true,
              position: 'top',
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
              backgroundColor: COLORS,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}개`;
                },
              },
            },
          },
        },
      });
    }
  }, []);

  // 현재 경로에 따라 버튼의 활성화 상태를 결정
  const getButtonClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

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
            <li className={getButtonClass("/detail-sales")} onClick={() => navigate("/detail-sales")}>실시간</li>
            <li className={getButtonClass("/day-detail-sales")} onClick={() => navigate("/day-detail-sales")}>일간</li>
            <li className={getButtonClass("/week-detail-sales")} onClick={() => navigate("/week-detail-sales")}>주간</li>
            <li className={getButtonClass("/month-detail-sales")} onClick={() => navigate("/month-detail-sales")}>월간</li>
            <li className={getButtonClass("/shop-edit")} onClick={() => navigate("/shop-edit")}>정보 수정</li>
          </ul>
        </nav>

        <main className="month-main-content">
          <div className="month-chart-container">
            <div className="month-line-chart">
              <h3 style={{ textAlign: 'center', fontSize: '16px', marginTop: '-10px', color: '#559abc' }}>월간 매출 분석</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    title={{
                      display: true,
                      text: '단위: 만원',
                      fontSize: 14,
                      padding: 30,
                    }}
                  />
                  <RechartsTooltip />
                  <RechartsLegend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#87CEEB"
                    activeDot={{ r: 8 }}
                    fill="rgba(135, 206, 235, 0.2)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="month-pie-chart">
              <h3 style={{ textAlign: 'center', fontSize: '16px', marginTop: '-12px', color: '#559abc' }}>월별 총 매출</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <RechartsTooltip />
                  <RechartsLegend />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
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
