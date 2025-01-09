import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessSignup.css';

const BusinessSignup = () => {
  const [formData, setFormData] = useState({
    businessNumber: '',
    businessName: '',
    storeName: '',
    address: '',
    category: 'restaurants',
    description: '',
    image: null,
    openingDate: '',
    isVerified: false,
    isVerified: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setId(storedId);
    } else {
      console.warn('로컬 스토리지에 id 값이 없습니다.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('businessNumber', formData.businessNumber);
    formDataToSend.append('storeName', formData.storeName);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('openingDate',formData.openingDate);
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch('/api/business-signup', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        console.log('회원가입 성공:', result.message);
        navigate('/login');
      } else {
        console.error('회원가입 실패:', result.error);
      }
    } catch (error) {
      console.error('서버 오류:', error);
    }
  };

  const isFormValid = () => {
    return (
      formData.businessNumber &&
      formData.businessName &&
      formData.storeName &&
      formData.address &&
      formData.category &&
      formData.openingDate &&
      formData.isVerified
      formData.openingDate &&
      formData.isVerified
    );
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCheckClick = async () => {
    if (!formData.businessNumber || !formData.openingDate || !formData.businessName) {
      alert('사업자등록번호, 개업일, 대표자 성명을 모두 입력하세요.');
      return;
    }
  
    try {
      const response = await fetch('/api/verify-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessNumber: formData.businessNumber,
          openingDate: formData.openingDate,
          businessName: formData.businessName,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(`사업자 진위 여부 확인: ${result.message}`);
        setFormData((prevFormData) => ({
          ...prevFormData,
          isVerified: true, // 사업자 등록 확인 성공 시 업데이트
        }));
        setFormData((prevFormData) => ({
          ...prevFormData,
          isVerified: true, // 사업자 등록 확인 성공 시 업데이트
        }));
      } else {
        alert(`확인 실패: ${result.message}`);
        setFormData((prevFormData) => ({
          ...prevFormData,
          isVerified: false, // 실패 시 비활성화
        }));
        setFormData((prevFormData) => ({
          ...prevFormData,
          isVerified: false, // 실패 시 비활성화
        }));
      }
    } catch (error) {
      console.error('서버 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
      setFormData((prevFormData) => ({
        ...prevFormData,
        isVerified: false,
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        isVerified: false,
      }));
    }
  };

  return (
    <div className="business-signup-container">
      <h1 className="business-signup-title" onClick={handleLogoClick}>
        <img src="/logo-one.png" alt="Logo" className="logo" />
        SpotRank
      </h1>
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
          <button type="button" onClick={handleCheckClick}>확인</button>
        </div>
        <div className="form-group">
          <label>사업자 이름</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>개업일</label>
          <input
            type="date"
            name="openingDate"
            value={formData.openingDate}
            onChange={handleChange}
            required
          />
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
        </div>
        <div className="form-group">
          <label>카테고리</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="restaurants">음식점</option>
            <option value="cafes">카페</option>
          </select>
        </div>
        <div className="form-group">
          <label>소개글</label>
          <textarea
            name="description"
            placeholder="1000자 이하로 작성해주세요"
            value={formData.description}
            onChange={handleChange}
            maxLength="1000"
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
        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid()}
        >
          회원가입 완료
        </button>
      </form>
    </div>
  );
};

export default BusinessSignup;