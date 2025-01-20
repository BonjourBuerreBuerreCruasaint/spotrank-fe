import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 세션 및 로컬스토리지 초기화
        localStorage.removeItem('user_id');
        localStorage.clear();
        sessionStorage.removeItem('user_id');
        sessionStorage.clear();

        // 메인 페이지로 리디렉션
        navigate('/');
      } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
      }
    };

    performLogout();
  }, [navigate]); // navigate를 의존성으로 추가

  return null; // UI를 렌더링하지 않음
};

export default Logout;