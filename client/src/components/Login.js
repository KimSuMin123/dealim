import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [studentIdOrPhone, setStudentIdOrPhone] = useState(''); // 학번 또는 전화번호
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3003/login', {
        studentIdOrPhone,
        password,
      });
      
      const { token, role, name } = response.data; // 이름 필드도 포함하여 받아오기

      // JWT 토큰, 역할(role), 이름을 localStorage에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name); // 이름도 저장

      alert(`${role === 'student' ? '학생' : '기사'} ${name}님, 로그인 성공!`); // 사용자 이름 표시
      
      setLoading(false);
    } catch (error) {
      setError('로그인 실패: ' + (error.response?.data?.message || '서버 오류'));
      setLoading(false);
    }
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
    </div>
  );
};

export default Login;

