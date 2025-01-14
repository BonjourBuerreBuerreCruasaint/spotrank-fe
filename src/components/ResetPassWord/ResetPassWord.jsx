import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassWord.css';

const ResetPassword = () => {
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    if (name === 'newPassword') {
      validatePassword(value);
    } else if (name === 'confirmPassword') {
      validateConfirmPassword(value, passwordData.newPassword);
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      setPasswordError('비밀번호는 최소 8자, 문자 및 숫자를 포함해야 합니다.');
    } else {
      setPasswordError('');
    }
  };

  const validateConfirmPassword = (confirmPassword, newPassword) => {
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError || confirmPasswordError) {
      alert('입력한 정보가 올바르지 않습니다.');
      return;
    }

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      alert('모든 필드를 입력해야 합니다.');
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: passwordData.newPassword }),
        credentials: 'include', // 세션 쿠키 포함
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // "비밀번호가 성공적으로 변경되었습니다."
        navigate('/login'); // 로그인 화면으로 이동
      } else {
        alert(result.message); // 오류 메시지
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버와의 통신에 실패했습니다.');
    }
  };

  return (
    <div className="resetpassword-container">
      <div className="resetpassword-box">
        <h1 className="resetpassword-title">새 비밀번호 설정</h1>
        <form onSubmit={handleSubmit} className="resetpassword-form">
          <input
            type="password"
            name="newPassword"
            placeholder="새 비밀번호"
            value={passwordData.newPassword}
            onChange={handleChange}
            required
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            required
          />
          {confirmPasswordError && <span className="error-message">{confirmPasswordError}</span>}
          <button type="submit" className="resetpassword-button">
            비밀번호 설정
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;