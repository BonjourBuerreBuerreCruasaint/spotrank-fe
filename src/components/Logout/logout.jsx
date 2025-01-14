import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include', // 세션 쿠키 포함
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.removeItem('id');
          localStorage.clear();
          sessionStorage.removeItem('id')
          sessionStorage.clear();
          navigate('/'); // 메인 페이지로 리디렉션
        } else {
          const errorData = await response.json();
          alert(errorData.error || '로그아웃 실패');
        }
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