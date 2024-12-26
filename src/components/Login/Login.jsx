import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
// import logo from '../../assets/spotrank-logo.png';  // 주석 처리

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('이메일 형식으로 입력해주세요');
      return;
    }
    navigate('/main');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">SpotRank</h1>
        
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
          
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">로그인 상태 유지</label>
          </div>
        </form>

        <button type="button" className="login-detail-button" onClick={handleLogin}>
          로그인
        </button>
        
        <div className="login-footer">
          <a href="/forgot-password" className="text-button">
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
