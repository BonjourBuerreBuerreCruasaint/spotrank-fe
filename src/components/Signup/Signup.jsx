import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthdate: '',
    phone: '',
    agree: false,
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });

    if (name === 'id') {
      validateEmail(value);
    } else if (name === 'password') {
      validatePassword(value);
      validateConfirmPassword(formData.confirmPassword, value);
    } else if (name === 'confirmPassword') {
      validateConfirmPassword(value, formData.password);
    } else if (name === 'birthdate') {
      validateBirthdate(value);
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

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 15) {
      setPasswordError('비밀번호는 8~15자리여야 합니다.');
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateBirthdate = (birthdate) => {
    if (birthdate.length !== 8) {
      setBirthdateError('생년월일은 8자리여야 합니다.');
    } else {
      setBirthdateError('');
    }
  };

  const validatePhone = (phone) => {
    if (phone.length !== 11) {
      setPhoneError('휴대전화번호는 11자리여야 합니다.');
    } else {
      setPhoneError('');
    }
  };

  const handleBusinessSignup = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      alert('개인정보 수집 및 이용에 동의해야 합니다.');
      return;
    }
    if (emailError || passwordError || confirmPasswordError || birthdateError || phoneError) {
      alert('입력한 정보가 올바르지 않습니다.');
      return;
    }
    if (Object.values(formData).some(value => value === '' || value === false)) {
      alert('모든 필드를 입력해야 합니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      alert(response.data.message);
      navigate('/business-signup'); // 사업자 인증 페이지로 이동
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  // SpotRank 클릭 메인 페이지로 이동
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title" onClick={handleLogoClick}>SpotRank</h1>
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
        {passwordError && <span className="error-message">{passwordError}</span>}
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {confirmPasswordError && <span className="error-message">{confirmPasswordError}</span>}
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
        {birthdateError && <span className="error-message">{birthdateError}</span>}
        <input
          type="text"
          name="phone"
          placeholder="휴대전화번호"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        {phoneError && <span className="error-message">{phoneError}</span>}
        <button type="submit" className="signup-button">사업자인증단계</button>
      </form>
    </div>
  );
};

export default Signup;