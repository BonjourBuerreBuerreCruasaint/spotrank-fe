import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopEditPage.css";

const ShopEditPage = () => {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImages, setShopImages] = useState([]);
  const storedId = localStorage.getItem("user_id"); // 로컬 스토리지에서 user_id 가져오기

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storedId) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("shopName", shopName || ""); // 기본값 설정
    formData.append("shopPhone", shopPhone || ""); // 기본값 설정
    formData.append("shopAddress", shopAddress || ""); // 기본값 설정
    formData.append("shopDescription", shopDescription || ""); // 기본값 설정

    shopImages.forEach((image) => {
      formData.append("shopImages", image);
    });

    try {
      const response = await fetch("http://127.0.0.1:5000/api/update-store", {
        headers: { Authorization: storedId }, // 로컬 스토리지에서 가져온 user_id를 Authorization 헤더에 포함
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("서버 오류:", errorData);
        alert(errorData.error || "업데이트 실패");
      } else {
        const result = await response.json();
        console.log("응답 데이터:", result);
        alert("업데이트 성공!");
      }
    } catch (error) {
      console.error("요청 실패:", error);
      alert("요청 실패");
    }

    navigate(`/ceo-main?id=${storedId}`);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setShopImages(files);
  };

  return (
    <div className="shop-edit-container">
      <div className="shop-edit-box">
        <h2
          className="shop-edit-title"
          onClick={() => navigate(`/ceo-main?id=${storedId}`)}
          style={{ cursor: "pointer" }}
        >
          <img src="/logo-one.png" alt="로고" className="logo" />
          SpotRank
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="shopName"
            placeholder="가게 이름"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />
          <input
            type="text"
            name="shopPhone"
            placeholder="가게 전화번호"
            value={shopPhone}
            onChange={(e) => setShopPhone(e.target.value)}
          />
          <input
            type="text"
            name="shopAddress"
            placeholder="가게 주소"
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
          />
          <textarea
            name="shopDescription"
            placeholder="소개글"
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
          />
          <input
            type="file"
            name="shopImages"
            onChange={handleImageChange}
            multiple
          />
          <button type="submit" className="save-button">
            저장
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopEditPage;