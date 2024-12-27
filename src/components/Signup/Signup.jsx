import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    name: '',
    birthdate: '',
    phone: '',
    agree: false,
  });

  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });

    if (name === 'id') {
      validateEmail(value);
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

  const handleBusinessSignup = (e) => {
    e.preventDefault();
    if (!formData.agree) {
      alert('개인정보 수집 및 이용에 동의해야 합니다.');
      return;
    }
    if (emailError) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (Object.values(formData).some(value => value === '' || value === false)) {
      alert('모든 필드를 입력해야 합니다.');
      return;
    }
    navigate('/business-signup');
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">SpotRank</h1>
      <div className="privacy-box">
        <label className="privacy-label">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
          />
          개인정보 수집 및 이용에 동의합니다.
        </label>
        <div className="privacy-content">
          홈페이지 이용약관, 개인정보 수집 및 이용안내에 미동의가 가능하며 이 경우 회원가입에 제한이 있습니다.
          회원님의 개인정보는 [개인정보보호법]에 의거 철저하게 보호됩니다.
          개인정보보호법에 의거하여 회원가입 후 2년이 경과된 회원에 대하여 개인정보수집에 대한 재동의를 받고 있습니다.
          미동의 시, 회원탈퇴 및 회원정보가 삭제 처리될 수 있습니다.
          아이디/비밀번호를 정상적으로 입력했으나 로그인이 되지 않는 경우, 회원 정보가 삭제된 경우이므로 불편하시더라도 회원 재가입을 부탁드립니다.
        </div>
      </div>
      <form onSubmit={handleBusinessSignup} className="signup-form">
        <input
          type="email"
          name="id"
          placeholder="이메일"
          value={formData.id}
          onChange={handleChange}
          required
        />
        {emailError && <span className="error-message">{emailError}</span>}
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
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
          name="birthdate"
          placeholder="생년월일 (YYYYMMDD)"
          value={formData.birthdate}
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
        <button type="submit" className="signup-button">사업자인증단계</button>
      </form>
    </div>
  );
};

export default Signup;
