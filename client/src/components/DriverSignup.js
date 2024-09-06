import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import

function DriverSignup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [password, setPassword] = useState(''); // 비밀번호 필드 추가
  const [responseMessage, setResponseMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !phone || !busNumber || !password) {
      setResponseMessage('이름, 전화번호, 호차, 비밀번호를 모두 입력하세요.');
      setMessageColor('red');
      return;
    }

    try {
      const response = await fetch('http://localhost:3003/register-driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          bus_number: busNumber,
          password, // 비밀번호 포함
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage('기사 회원 가입이 완료되었습니다.');
        setMessageColor('green');
      } else {
        setResponseMessage(`오류: ${data.message}`);
        setMessageColor('red');
      }
    } catch (error) {
      setResponseMessage(`오류: ${error.message}`);
      setMessageColor('red');
    }
  };

  const handleLogin = () => {
    navigate('/'); // 로그인 페이지로 이동
  };

  return (
    <div className="container">
      <h2>기사 회원 가입</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">이름:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="이름을 입력하세요"
        />

        <label htmlFor="phone">전화번호:</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="전화번호를 입력하세요"
        />

        <label htmlFor="busNumber">호차:</label>
        <input
          type="text"
          id="busNumber"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
          required
          placeholder="호차를 입력하세요"
        />

        <label htmlFor="password">비밀번호:</label> {/* 비밀번호 입력란 추가 */}
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="비밀번호를 입력하세요"
        />

        <button type="submit">회원 가입</button>
      </form>

      <p style={{ color: messageColor }}>{responseMessage}</p>
      <button onClick={handleLogin}>로그인</button> {/* 로그인 페이지로 돌아가는 버튼 */}
    </div>
  );
}

export default DriverSignup;
