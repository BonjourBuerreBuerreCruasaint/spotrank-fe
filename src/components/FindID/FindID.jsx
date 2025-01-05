import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindID.css';

const FindID = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      validateEmail(value);
    } else if (name === 'phone') {
      validatePhone(value);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError('이메일 형식으로 입력해주세요');
    } else {
      setEmailError('');
    }
  };

  const validatePhone = (phone) => {
    if (phone.length !== 11) {
      setPhoneError('휴대전화번호는 11자리여야 합니다.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailError || phoneError) {
      alert('입력한 정보가 올바르지 않습니다.');
      return;
    }
    if (Object.values(formData).some(value => value === '')) {
      alert('모든 필드를 입력해야 합니다.');
      return;
    }
    alert('이메일로 아이디가 발송되었습니다.');
    navigate('/login');
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
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {emailError && <span className="error-message">{emailError}</span>}
          <button type="submit" className="findid-button">아이디 찾기</button>
        </form>
      </div>
    </div>
  );
};

export default FindID;
