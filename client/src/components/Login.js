import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [studentIdOrPhone, setStudentIdOrPhone] = useState(''); // 이메일 대신 학번 또는 전화번호 사용
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3003/login', {
        studentIdOrPhone, // 수정된 필드명
        password
      });
      
      const { token, role } = response.data; // response에서 token과 role을 추출

      // JWT 토큰 및 역할(role)을 localStorage에 저장
      localStorage.setItem('token', token); 
      localStorage.setItem('role', role);

      // 사용자에게 역할에 따른 메시지 표시
      alert(`${role === 'student' ? '학생' : '기사'} 회원 로그인 성공!`);
      
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
          <label htmlFor="studentIdOrPhone">학번 또는 전화번호</label> {/* 라벨 수정 */}
          <input
            type="text"
            id="studentIdOrPhone"
            value={studentIdOrPhone} // 상태값 변경
            onChange={(e) => setStudentIdOrPhone(e.target.value)} // 입력 변경 핸들러 수정
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
