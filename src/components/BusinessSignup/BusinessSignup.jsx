import React, { useState } from 'react';
import './BusinessSignup.css';

const BusinessSignup = () => {
  const [formData, setFormData] = useState({
    businessNumber: '',
    storeName: '',
    address: '',
    detailedAddress: '',
    category: '',
    description: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('사업자 정보:', formData);
  };

  return (
    <div className="business-signup-container">
      <h1 className="business-signup-title">회원가입 - 사업자정보 입력</h1>
      <form onSubmit={handleSubmit} className="business-signup-form">
        <div className="form-group">
          <label>사업자등록번호</label>
          <input
            type="text"
            name="businessNumber"
            value={formData.businessNumber}
            onChange={handleChange}
            required
          />
          <button type="button">확인</button>
        </div>
        <div className="form-group">
          <label>가게 상호명</label>
          <input
            type="text"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>주소</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <button type="button">주소 검색</button>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="detailedAddress"
            placeholder="상세 주소 입력"
            value={formData.detailedAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>카테고리</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>소개글</label>
          <textarea
            name="description"
            placeholder="1000자 이하로 작성해주세요"
            value={formData.description}
            onChange={handleChange}
            maxLength="1000"
            required
          />
        </div>
        <div className="form-group">
          <label>이미지 가져오기</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">회원가입 완료</button>
      </form>
    </div>
  );
};

export default BusinessSignup;
