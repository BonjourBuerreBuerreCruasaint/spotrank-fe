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
    storePhoneNumber: '',
  });

  const [localBusinessName, setLocalBusinessName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // 로컬 스토리지에서 데이터 가져오기
  useEffect(() => {
    const storedName = localStorage.getItem('username') || localStorage.getItem('name');
    if (storedName) {
      setLocalBusinessName(storedName);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // businessName 검증
    if (name === 'businessName') {
      if (value !== localBusinessName) {
        setErrorMessage('입력한 사업자 이름이 저장된 이름과 다릅니다.');
      } else {
        setErrorMessage('');
      }
    }

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.businessNumber || !formData.openingDate || !formData.businessName) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    if (!formData.isVerified) {
      alert('사업자여부 확인 버튼을 눌러주세요');
      return;
    }

    if (errorMessage) {
      alert('사업자 이름이 올바르지 않습니다.');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'image' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else if (key !== 'isVerified') {
        formDataToSend.append(key, formData[key]);
      }
    });

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
        alert(result.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('서버 오류:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
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
          isVerified: true,
        }));
      } else {
        alert(`확인 실패: ${result.message}`);
        setFormData((prevFormData) => ({
          ...prevFormData,
          isVerified: false,
        }));
      }
    } catch (error) {
      console.error('서버 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
      setFormData((prevFormData) => ({
        ...prevFormData,
        isVerified: false,
      }));
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
      formData.storePhoneNumber &&
      formData.isVerified && // 사업자 확인이 된 경우
      !errorMessage // 오류 메시지가 없을 때만 유효
    );
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
          {errorMessage && <p className="error-message">{errorMessage}</p>}
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
          <label>가게 전화번호</label>
          <input
            type="text"
            name="storePhoneNumber"
            value={formData.storePhoneNumber}
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