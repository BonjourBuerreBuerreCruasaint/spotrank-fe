import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import "./CeoDashBoard.css";

Chart.register(...registerables);

const CeoDashBoard = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    // 임의의 데이터 생성
    const generateRandomData = () => {
      return Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
    };

    setSalesData(generateRandomData());
    setMenuData(generateRandomData());

    // 그래프 그리기
    const salesChart = new Chart(document.getElementById("salesChart"), {
      type: "line",
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}시`),
        datasets: [{
          label: "시간별 매출",
          data: salesData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        }],
      },
    });

    const menuChart = new Chart(document.getElementById("menuChart"), {
      type: "pie",
      data: {
        labels: ["카푸치노", "아이스 아메리카노", "바닐라 라떼", "카라멜 마끼아또"],
        datasets: [{
          label: "시간별 메뉴 판매량",
          data: menuData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        }],
      },
    });

    return () => {
      salesChart.destroy();
      menuChart.destroy();
    };
  }, []);

  const handleLogout = () => {
    // 로그아웃 버튼 클릭 시 MainPage로 이동
    navigate('/'); // MainPage로 이동
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = () => {
    // 수정하기 버튼 클릭 시 처리 로직
    console.log("수정 내용:", description);
    console.log("업로드된 이미지:", images);
  };

  const handleViewAllSales = () => {
    // 매출 전체보기 버튼 클릭 시 처리 로직
    console.log("매출 전체보기 버튼 클릭됨");
  };

  return (
    <div className="main-container">
      <header>
        <h1 onClick={() => navigate('/ceo-main')} style={{ cursor: 'pointer' }}>SpotRank</h1>
        <a href="#" className="login-btn" onClick={handleLogout}>Logout</a>
      </header>
      <div className="dashboard-container">
        <div className="dashboard-item">
          <h3>시간별 매출 분석표</h3>
          <canvas id="salesChart" />
        </div>
        <div className="dashboard-item">
          <h3>시간별 메뉴 판매량</h3>
          <canvas id="menuChart" />
        </div>
        <div className="dashboard-item">
          <h3>매출 정보 확인</h3>
          <div>
            <p>총 매출: {salesData.reduce((a, b) => a + b, 0)} 원</p>
            <canvas id="salesInfoChart" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '1rem' }}>
              <button className="view-all-sales-button" onClick={handleViewAllSales}>매출 전체보기</button>
            </div>
          </div>
        </div>
        <div className="dashboard-item">
          <h3>가게 정보 수정</h3>
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginBottom: '1rem' }}
            />
            <textarea
              placeholder="가게 정보를 입력하세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', height: '7px', marginBottom: '1rem' }}
            />
            <button className="submit-button" onClick={handleSubmit}>수정하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CeoDashBoard;
