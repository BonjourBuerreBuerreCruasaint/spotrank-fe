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
  const storedId = sessionStorage.getItem('id');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('shopName', shopName);
    formData.append('shopPhone', shopPhone);
    formData.append('shopAddress', shopAddress);
    formData.append('shopDescription', shopDescription);

    shopImages.forEach((image) => {
        formData.append('shopImages', image); // Flask에서 'shopImages'로 처리
    });

    try {
      const response = await fetch("http://127.0.0.1:5000/api/update-store", {
          method: "POST",
          body: formData, // FormData 사용
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

    // 성공 메시지 표시
    alert("가게 정보가 수정되었습니다."); // 팝업 메시지
    navigate(`/ceo-main?id=${storedId}`);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setShopImages(files); // 선택한 파일들을 상태에 저장
  };

  return (
    <div className="shop-edit-container">
      <div className="shop-edit-box">
        <h2 className="shop-edit-title" onClick={() => navigate(`/ceo-main?id=${storedId}`)} style={{ cursor: 'pointer' }}>
          <img src="/logo-one.png" alt="로고" className="logo" />
          SpotRank
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="shopName" // Flask와 일치
            placeholder="가게 이름"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />
          <input
            type="text"
            name="shopPhone" // Flask와 일치
            placeholder="가게 전화번호"
            value={shopPhone}
            onChange={(e) => setShopPhone(e.target.value)}
          />
          <input
            type="text"
            name="shopAddress" // Flask와 일치
            placeholder="가게 주소"
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
          />
          <textarea
            name="shopDescription" // Flask와 일치
            placeholder="소개글"
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
          />
          <input
            type="file"
            name="shopImages" // Flask에서 'shopImages' 처리
            onChange={handleImageChange}
            multiple
          />
          <button type="submit" className="save-button">저장</button>
        </form>
      </div>
    </div>
  );
};

export default ShopEditPage;