import React,{ useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DetailSales.css";
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

const DetailSales = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const location = useLocation(); // 현재 경로를 가져오기 위한 useLocation 훅 사용
  const lineChartRef = React.useRef(null);
  const lineChartInstance = React.useRef(null);
  const [id,setId] = useState('');

  const pieData = [
    { name: "카츠/스노", value: 40 },
    { name: "아메리카노", value: 30 },
    { name: "버블티/타로", value: 20 },
    { name: "기타/간이 메뉴", value: 10 },
  ];
  
  const COLORS = ["#87CEEB", "#CEDFCD", "#C2C2CA", "#FFDBA4"];

  const lineData = [
    { time: "12시", sales: 30 },
    { time: "14시", sales: 60 },
    { time: "16시", sales: 50 },
    { time: "18시", sales: 80 },
    { time: "20시", sales: 40 },
    { time: "22시", sales: 20 },
  ];

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
  }, []); // 의존성 배열: 빈 배열로 설정

  // 현재 경로에 따라 버튼의 활성화 상태를 결정
  const getButtonClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // 로컬 스토리지에서 email 가져오기
  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setId(storedId);
    } else {
      console.warn('로컬 스토리지에 id 값이 없습니다.');
    }
  }, []);

  return (
    <div className="detail-sales-container">
      <header
        className="detail-sales-header"
        onClick={() => navigate("/ceo-main")}
      >
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo" />
        <h1>SpotRank</h1>
      </header>

      <div className="content-container">
        <nav className="detail-sales-sidebar">
          <ul>
            <li className={getButtonClass("/detail-sales")} onClick={() => navigate(`/detail-sales?id=${id}`)}>실시간</li>
            <li className={getButtonClass("/day-detail-sales")} onClick={() => navigate(`/day-detail-sales?id=${id}`)}>일간</li>
            <li className={getButtonClass("/week-detail-sales")} onClick={() => navigate(`/week-detail-sales?id=${id}`)}>주간</li>
            <li className={getButtonClass("/month-detail-sales")} onClick={() => navigate(`/month-detail-sales?id=${id}`)}>월간</li>
            <li className={getButtonClass("/shop-edit")} onClick={() => navigate(`/shop-edit?id=${id}`)}>정보 수정</li>
          </ul>
        </nav>

        <main className="main-content">
          <div className="chart-container">
            <div className="line-chart">
              <h3 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '0px', color: '#559abc' }}>시간별 매출 현황</h3>
              <RechartsResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis
                    domain={[0, 'dataMax + 10']}
                    label={{ value: '단위: 만원', angle: -90, fontSize: '12px', position: 'insideLeft' }}
                  />
                  <RechartsTooltip />
                  <RechartsLegend />
                  <Line type="monotone" dataKey="sales" stroke="#87CEEB" />
                </LineChart>
              </RechartsResponsiveContainer>
            </div>
            <div className="pie-chart">
              <h3 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '-20px', color: '#559abc' }}>실시간 메뉴 판매량</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip />
                  <Legend />
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
          <div className="summary-section">
            <h2>우리매장 인기상품★</h2>
            <table>
              <thead>
                <tr>
                  <th>메뉴</th>
                  <th>가격</th>
                  <th>총 개수</th>
                  <th>매출 합계</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>예시 메뉴 1</td>
                  <td>0원</td>
                  <td>0개</td>
                  <td>0원</td>
                </tr>
                <tr>
                  <td>예시 메뉴 2</td>
                  <td>0원</td>
                  <td>0개</td>
                  <td>0원</td>
                </tr>
                <tr>
                  <td>예시 메뉴 3</td>
                  <td>0원</td>
                  <td>0개</td>
                  <td>0원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DetailSales;
