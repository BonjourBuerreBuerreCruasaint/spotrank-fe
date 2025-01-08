import React,{useState,useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import "./DayDetailSales.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';

const DayDetailSales = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lineChartRef = React.useRef(null);
  const pieChartRef = React.useRef(null);
  const [id,setId] = useState('');

  const data = [
    { day: '월', sales: 300 },
    { day: '화', sales: 450 },
    { day: '수', sales: 200 },
    { day: '목', sales: 400 },
    { day: '금', sales: 350 },
    { day: '토', sales: 500 },
    { day: '일', sales: 300 },
  ];

  const pieData = [
    { name: "카푸치노", value: 40 },
    { name: "아메리카노", value: 30 },
    { name: "바닐라라떼", value: 20 },
    { name: "카라멜마끼아또", value: 10 },
  ];

  const COLORS = ["#cedfcd", "#c2c2ca", "#ffdba4", "#559abc"];

  React.useEffect(() => {
    // Line Chart 관련 코드
  }, []);

  const getButtonClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setId(storedId);
    } else {
      console.warn('로컬 스토리지에 id 값이 없습니다.');
    }
  }, []);
  return (
    <div className="day-detail-sales-container">
      <header
        className="day-detail-sales-header"
        onClick={() => navigate("/ceo-main")}
      >
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>SpotRank</h1>
      </header>

      <div className="day-content-container">
        <nav className="day-detail-sales-sidebar">
          <ul>
            <li className={getButtonClass("/detail-sales")} onClick={() => navigate(`/detail-sales?id=${id}`)}>실시간</li>
            <li className={getButtonClass("/day-detail-sales")} onClick={() => navigate(`/day-detail-sales?id=${id}`)}>일간</li>
            <li className={getButtonClass("/week-detail-sales")} onClick={() => navigate(`/week-detail-sales?id=${id}`)}>주간</li>
            <li className={getButtonClass("/month-detail-sales")} onClick={() => navigate(`/month-detail-sales?id=${id}`)}>월간</li>
            <li className={getButtonClass("/shop-edit")} onClick={() => navigate(`/shop-edit?id=${id}`)}>정보 수정</li>
          </ul>
        </nav>

        <main className="day-main-content">
          <div className="day-chart-container">
            <div className="day-line-chart">
              <h3 style={{ textAlign: 'center', fontSize: '16px', marginTop: '15px', color: '#559abc' }}>요일별 매출 분석</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#87CEEB" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="day-pie-chart">
              <h3 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '-20px', color: '#559abc' }}>요일별 메뉴 판매량</h3>
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
