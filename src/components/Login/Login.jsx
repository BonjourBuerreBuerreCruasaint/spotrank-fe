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
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 쿠키를 포함하여 요청
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { session_id } = data; // Redis 세션 ID 반환
        if (session_id) {
          sessionStorage.setItem('session_id', session_id); // 세션 ID를 로컬 스토리지에 저장
          console.log('로그인 성공, 세션 ID:', session_id);
          navigate('/ceo-main'); // 메인 페이지로 이동
        } else {
          alert('세션 ID를 받지 못했습니다. 다시 시도하세요.');
        }
      } else {
        alert(data.error || '로그인 실패');
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