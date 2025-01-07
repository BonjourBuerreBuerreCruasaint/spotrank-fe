import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindPassWord.css';

const FindPassWord = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
  });

  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
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
      setIsEmailVerified(false);
    } else {
      setEmailError('');
    }
  };

  const handleEmailVerification = () => {
    if (!emailError && formData.email) {
      setIsEmailVerified(true);
      alert('이메일 인증이 완료되었습니다.');
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
    if (emailError || phoneError || !isEmailVerified) {
      alert('입력한 정보가 올바르지 않거나 이메일 인증이 필요합니다.');
      return;
    }
    if (Object.values(formData).some(value => value === '')) {
      alert('모든 필드를 입력해야 합니다.');
      return;
    }
    alert('비밀번호가 메일로 발송되었습니다.');
    navigate('/login'); // 로그인 화면으로 이동
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="findpassword-container">
      <div className="findpassword-box">
        <h1 className="findpassword-title" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src="/logo-one.png" alt="로고" className="logo" />
          SpotRank
        </h1>
        <form onSubmit={handleSubmit} className="findpassword-form">
          <div className="email-verification">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleEmailVerification} className="verify-button">
              인증
            </button>
          </div>
          {emailError && <span className="error-message">{emailError}</span>}
          {isEmailVerified && <span className="success-message">인증 완료</span>}
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
          <button type="submit" className="findpassword-button" disabled={!isEmailVerified}>
            비밀번호 찾기
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindPassWord;
