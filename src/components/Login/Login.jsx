import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('이메일 형식으로 입력해주세요');
    } else {
      setEmailError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('이메일 형식으로 입력해주세요');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // 응답이 성공적이면 JSON 파싱
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user_id', data.user_id);  // 사용자 ID를 로컬스토리지에 저장
        navigate(`/ceo-main?id=${data.user_id}`);  // 로그인 성공 후 이동
      } else {
        // 응답이 실패하면 에러 메시지 출력
        const errorData = await response.json();
        alert(errorData.error || '로그인 실패');
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/logo-one.png" alt="로고" className="logo" />
          SpotRank
        </h1>

        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
              className={emailError ? 'error' : ''}
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-detail-button">
            로그인
          </button>

          <div className="login-footer">
            <button className="text-button" onClick={() => navigate('/find-id')}>
              아이디 찾기
            </button>
            <button className="text-button" onClick={() => navigate('/find-password')}>
              비밀번호 찾기
            </button>
            <button className="text-button" onClick={() => navigate('/signup')}>
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
