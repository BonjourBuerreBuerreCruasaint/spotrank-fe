import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessSignup.css';

const menuCategories = [
  "빵/도넛",
  "돼지고기 구이/찜",
  "요리 주점",
  "카페",
  "백반/한정식",
  "경양식",
  "일식 면 요리",
  "생맥주 전문",
  "일식 회/초밥",
  "피자",
  "파스타/스테이크",
  "김밥/만두/분식",
  "치킨",
  "국/탕/찌개류",
  "국수/칼국수",
  "버거",
  "중국집",
  "일식 카레/돈가스/덮밥",
  "마라탕/훠궈",
  "닭/오리고기 구이/찜",
];


const BusinessSignup = () => {
  const [formData, setFormData] = useState({
    businessNumber: '',
    businessName: '',
    storeName: '',
    address: '',
    category: 'restaurants',
    subCategory: '',
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
    const storedName = localStorage.getItem('name');
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

    // 사업자여부 확인 체크
    if (!formData.isVerified) {
        alert('사업자여부 확인 버튼을 눌러주세요');
        return;

    }

    const formDataToSend = new FormData();
    formDataToSend.append('businessNumber', formData.businessNumber);
    formDataToSend.append('businessName', formData.businessName);
    formDataToSend.append('storeName', formData.storeName);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('subCategory',formData.subCategory);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('openingDate', formData.openingDate);
    formDataToSend.append('storePhoneNumber', formData.storePhoneNumber);

    if (formData.image) {
        formDataToSend.append('image', formData.image);
    }

    try {
        const response = await fetch('/api/business-signup', {
            method: 'POST',
            body: formDataToSend,
        });

        const result = await response.json();
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

  const isFormValid = () => {
    // 사업자 확인이 되지 않은 경우 버튼 비활성화
    if (!formData.isVerified) {
        return false;
    }
    
    // 모든 필수 필드가 채워져 있는 경우에만 true 반환
    return (
        formData.businessNumber &&
        formData.businessName &&
        formData.storeName &&
        formData.address &&
        formData.category &&
        formData.subCategory&&
        formData.openingDate &&
        formData.storePhoneNumber
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
            setFormData(prev => ({
                ...prev,
                isVerified: true,
            }));
        } else {
            alert(`확인 실패: ${result.message}`);
            setFormData(prev => ({
                ...prev,
                isVerified: false,
            }));
        }
    } catch (error) {
        console.error('서버 오류:', error);
        alert('서버와 통신 중 오류가 발생했습니다.');
        setFormData(prev => ({
            ...prev,
            isVerified: false,
        }));
    }
  };

  console.log('사업자 확인 상태:', formData.isVerified);

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
          <label>상권업종 카테고리</label>
          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            {menuCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
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