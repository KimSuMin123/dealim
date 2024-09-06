import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import

const Login = () => {
  const [studentIdOrPhone, setStudentIdOrPhone] = useState(''); // 학번 또는 전화번호
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3003/login', {
        studentIdOrPhone,
        password,
      });

      const { token, role, name } = response.data; // 이름 필드 포함하여 받아오기

      // JWT 토큰, 역할(role), 이름을 localStorage에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name); // 이름도 저장

      alert(`${role === 'student' ? '학생' : '기사'} ${name}님, 로그인 성공!`);

      setLoading(false);

      // 역할(role)에 따라 페이지 리다이렉트
      if (role === 'student') {
        navigate('/reservation'); // 학생일 경우 예약 페이지로 이동
      } else if (role === 'driver') {
        navigate('/drivercheck'); // 기사일 경우 DriverCheck 페이지로 이동
      }
      
    } catch (error) {
      setError('로그인 실패: ' + (error.response?.data?.message || '서버 오류'));
      setLoading(false);
    }
  };
  const handleStudentSignup = () => {
    navigate('/student-signup'); // 학생 회원가입 페이지로 이동
  };

  const handleDriverSignup = () => {
    navigate('/driver-signup'); // 기사 회원가입 페이지로 이동
  };


  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="studentIdOrPhone">학번 또는 전화번호</label>
          <input
            type="text"
            id="studentIdOrPhone"
            value={studentIdOrPhone}
            onChange={(e) => setStudentIdOrPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
       <div className="signup-buttons">
        <button onClick={handleStudentSignup}>학생 회원가입</button>
        <button onClick={handleDriverSignup}>기사 회원가입</button>
      </div>
    </div>
  );
};

export default Login;
