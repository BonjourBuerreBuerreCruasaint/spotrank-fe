import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DayDetailSales.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';

const DayDetailSales = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lineChartRef = React.useRef(null);
  const pieChartRef = React.useRef(null);

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

  return (
    <div className="day-detail-sales-container">
      <header
        className="day-detail-sales-header"
      >
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1 onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>SpotRank</h1>
        <div className="day-detail-button-group">
          <button className="day-detail-sales-button" onClick={() => navigate('/detail-sales')}>나는 사장</button>
          <button className="day-detail-sales-logout-button" onClick={() => navigate('/ceo-main')}>Logout</button>
        </div>
      </header>

      <div className="day-content-container">
        <nav className="day-detail-sales-sidebar">
          <ul>
            <li className={getButtonClass("/detail-sales")} onClick={() => navigate("/detail-sales")}>실시간</li>
            <li className={getButtonClass("/day-detail-sales")} onClick={() => navigate("/day-detail-sales")}>일간</li>
            <li className={getButtonClass("/week-detail-sales")} onClick={() => navigate("/week-detail-sales")}>주간</li>
            <li className={getButtonClass("/month-detail-sales")} onClick={() => navigate("/month-detail-sales")}>월간</li>
            <li className={getButtonClass("/shop-edit")} onClick={() => navigate("/shop-edit")}>정보 수정</li>
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
        </main>
      </div>
    </div>
  );
};

export default DayDetailSales;
