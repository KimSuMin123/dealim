import React, { useState, useEffect } from 'react';

function StudentSignup() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState(''); // 비밀번호 필드 추가
  const [responseMessage, setResponseMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  // 학번이 변경될 때마다 이메일 주소를 자동으로 생성
  useEffect(() => {
    if (studentId) {
      setEmail(`${studentId}@email.daelim.ac.kr`);
    } else {
      setEmail(''); // 학번이 없을 경우 이메일을 비움
    }
  }, [studentId]);

  // 인증번호 요청 함수
  const requestVerificationCode = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3003/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage('인증번호가 전송되었습니다! 이메일을 확인하세요.');
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

  // 인증번호 확인 및 회원가입 완료 함수
  const verifyCode = async (event) => {
    event.preventDefault();

    if (!password) {
      setResponseMessage('비밀번호를 입력하세요.');
      setMessageColor('red');
      return;
    }

    try {
      const response = await fetch('http://localhost:3003/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          studentId,
          phone,
          email,
          code: verificationCode,
          password, // 비밀번호 포함
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message); // 회원가입 성공 메시지
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

  return (
    <div className="container">
      <h2>학생 회원가입</h2>

      {/* 기본 정보 입력 폼 */}
      <form>
        <label htmlFor="name">이름을 입력하세요:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="이름을 입력하세요"
        />
        <label htmlFor="studentId">학번을 입력하세요:</label>
        <input
          type="text"
          id="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          placeholder="학번을 입력하세요"
        />
        <label htmlFor="phone">전화번호를 입력하세요:</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="전화번호를 입력하세요"
        />
        <label htmlFor="password">비밀번호를 입력하세요:</label> {/* 비밀번호 입력란 추가 */}
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="비밀번호를 입력하세요"
        />
      </form>

      {/* 인증번호 요청 폼 */}
      <form onSubmit={requestVerificationCode}>
        <label htmlFor="email">이메일:</label>
        <input
          type="email"
          id="email"
          value={email}
          readOnly
          placeholder="자동 생성된 이메일"
        />
        <button type="submit">인증번호 전송</button>
      </form>

      {/* 인증번호 확인 폼 */}
      <form onSubmit={verifyCode}>
        <label htmlFor="code">인증번호를 입력하세요:</label>
        <input
          type="text"
          id="code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          placeholder="수신한 인증번호를 입력하세요"
        />
        <button type="submit">인증번호 확인</button>
      </form>

      <p style={{ color: messageColor }}>{responseMessage}</p>
    </div>
  );
}

export default StudentSignup;
