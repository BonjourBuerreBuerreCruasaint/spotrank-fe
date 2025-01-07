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
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 유효성 검사 및 제출 로직 추가
    if (!shopName || !shopPhone || !shopAddress || !shopDescription || shopImages.length === 0) {
      setErrorMessage("모든 필드를 입력해야 합니다.");
      return;
    }
    // 가게 정보 수정 API 호출 로직 추가
    console.log("가게 정보 수정:", { shopName, shopPhone, shopAddress, shopDescription, shopImages });
    setErrorMessage(""); // 오류 메시지 초기화

    // 성공 메시지 표시
    alert("가게 정보가 수정되었습니다."); // 팝업 메시지
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setShopImages(files); // 선택한 파일들을 상태에 저장
  };

  return (
    <div className="shop-edit-container">
      <div className="shop-edit-box">
        <h2 className="shop-edit-title" onClick={() => navigate("/ceo-main")} style={{ cursor: 'pointer' }}>
          <img src="/logo-one.png" alt="로고" className="logo" />
          SpotRank
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="가게 이름"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className={errorMessage ? "error" : ""}
          />
          <input
            type="text"
            placeholder="가게 전화번호"
            value={shopPhone}
            onChange={(e) => setShopPhone(e.target.value)}
            className={errorMessage ? "error" : ""}
          />
          <input
            type="text"
            placeholder="가게 주소"
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
            className={errorMessage ? "error" : ""}
          />
          <textarea
            placeholder="소개글"
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            className={errorMessage ? "error" : ""}
          />
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            className={errorMessage ? "error" : ""}
          />
          {errorMessage && <span className="error-message">{errorMessage}</span>}
          <button type="submit" className="save-button">저장</button>
        </form>
      </div>
    </div>
  );
};

export default ShopEditPage;
