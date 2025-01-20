import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DetailSales.css";
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
import axios from "axios";

const DetailSales = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 로컬 스토리지에서 사용자 ID 가져오기
  const storedUserId = localStorage.getItem("user_id");

  // 차트 데이터
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

  // 메뉴 데이터 상태
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 메뉴 데이터 가져오기
  useEffect(() => {
    if (!storedUserId) {
      console.error("사용자 ID가 없습니다. 로그인을 다시 시도하세요.");
      navigate("/login");
      return;
    }

    // API 호출로 메뉴 데이터 가져오기
    axios
      .get("http://127.0.0.1:5000/api/get-menu-data", {
        headers: { Authorization: storedUserId }, // 사용자 ID를 Authorization 헤더에 포함
        withCredentials: true,
      })
      .then((response) => {
        setMenuData(response.data);
      })
      .catch((error) => {
        console.error("메뉴 데이터 가져오기 실패:", error);
        if (error.response?.status === 401) {
          alert("세션이 만료되었습니다. 다시 로그인하세요.");
          navigate("/login");
        } else {
          alert("메뉴 데이터를 가져오지 못했습니다. 서버를 확인하세요.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [storedUserId, navigate]);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("user_id"); // 로컬 스토리지에서 사용자 ID 삭제
    navigate("/login");
  };

  // 현재 페이지 버튼 활성화
  const getButtonClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="detail-sales-container">
      <header className="detail-sales-header">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1 onClick={() => navigate(`/ceo-main?id=${storedUserId}`)} style={{ cursor: "pointer" }}>
          SpotRank
        </h1>
        <div className="detail-sales-button-group">
          <button
            className="detail-sales-button"
            onClick={() => navigate(`/detail-sales?id=${storedUserId}`)}
          >
            나는 사장
          </button>
          <button className="detail-sales-logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="content-container">
        <nav className="detail-sales-sidebar">
          <ul>
            <li
              className={getButtonClass("/detail-sales")}
              onClick={() => navigate(`/detail-sales?id=${storedUserId}`)}
            >
              실시간
            </li>
            <li
              className={getButtonClass("/day-detail-sales")}
              onClick={() => navigate(`/day-detail-sales?id=${storedUserId}`)}
            >
              일간
            </li>
            <li
              className={getButtonClass("/week-detail-sales")}
              onClick={() => navigate(`/week-detail-sales?id=${storedUserId}`)}
            >
              주간
            </li>
            <li
              className={getButtonClass("/month-detail-sales")}
              onClick={() => navigate(`/month-detail-sales?id=${storedUserId}`)}
            >
              월간
            </li>
            <li
              className={getButtonClass("/shop-edit")}
              onClick={() => navigate(`/shop-edit?id=${storedUserId}`)}
            >
              정보 수정
            </li>
          </ul>
        </nav>

        <main className="main-content">
          {loading ? (
            <p>데이터를 불러오는 중입니다...</p>
          ) : (
            <>
              <div className="chart-container">
                <div className="line-chart">
                  <h3
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      marginBottom: "0px",
                      color: "#559abc",
                    }}
                  >
                    시간별 매출 현황
                  </h3>
                  <RechartsResponsiveContainer width="100%" height={250}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis
                        domain={[0, "dataMax + 10"]}
                        label={{
                          value: "단위: 만원",
                          angle: -90,
                          fontSize: "12px",
                          position: "insideLeft",
                        }}
                      />
                      <RechartsTooltip />
                      <RechartsLegend />
                      <Line type="monotone" dataKey="sales" stroke="#87CEEB" />
                    </LineChart>
                  </RechartsResponsiveContainer>
                </div>
                <div className="pie-chart">
                  <h3
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      marginBottom: "-20px",
                      color: "#559abc",
                    }}
                  >
                    실시간 메뉴 판매량
                  </h3>
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
                    {menuData.map((menu) => (
                      <tr key={menu.id}>
                        <td>{menu.name}</td>
                        <td>{menu.price}원</td>
                        <td>{menu.total_count}개</td>
                        <td>{menu.total_sales}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DetailSales;