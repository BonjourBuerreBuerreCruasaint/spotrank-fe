import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FindID.css';

const FindID = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const [phoneError, setPhoneError] = useState('');
  const [responseMessage, setResponseMessage] = useState(''); // 서버 응답 메시지 상태 추가
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'phone') {
      validatePhone(value);
    }
  };

  const validatePhone = (phone) => {
    if (phone.length !== 11) {
      setPhoneError('휴대전화번호는 11자리여야 합니다.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 에러 확인
    if (phoneError) {
      alert('입력한 정보가 올바르지 않습니다.');
      return;
    }
    if (Object.values(formData).some((value) => value === '')) {
      alert('모든 필드를 입력해야 합니다.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/find-id', formData);

      if (response.status === 200) {
        setResponseMessage(`이메일: ${response.data.email}`); // 성공 메시지 설정
      }
    } catch (error) {
      if (error.response) {
        setResponseMessage(error.response.data.error || '요청 처리 중 오류가 발생했습니다.');
      } else {
        setResponseMessage('서버와의 통신에 실패했습니다.');
      }
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="findid-container">
      <div className="findid-box">
        <h1 className="findid-title" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          SpotRank
        </h1>
        <form onSubmit={handleSubmit} className="findid-form">
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="휴대전화번호"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {phoneError && <span className="error-message">{phoneError}</span>}
          <button type="submit" className="findid-button">아이디 찾기</button>
          <div className="login-footer">
          <button className="text-button" onClick={() => navigate('/find-password')}>
            비밀번호 찾기
          </button>
          <button className="text-button" onClick={() => navigate('/login')}>
            로그인
          </button>
        </div>
        </form>
        {responseMessage && <p className="response-message">{responseMessage}</p>} {/* 메시지 출력 */}
      </div>
    </div>
  );
};

export default FindID;