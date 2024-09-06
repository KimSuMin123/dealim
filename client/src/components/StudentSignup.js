import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import styled from 'styled-components'; // styled-components import

// 스타일 정의
const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${(props) => props.color || 'black'};
`;

const StudentSignup = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState(''); // 비밀번호 필드 추가
  const [responseMessage, setResponseMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const navigate = useNavigate(); // useNavigate 훅 사용

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

  const handleLogin = () => {
    navigate('/'); // 로그인 페이지로 이동
  };

  return (
    <Container>
      <Title>학생 회원가입</Title>

      {/* 기본 정보 입력 폼 */}
      <Form>
        <Label htmlFor="name">이름을 입력하세요:</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="이름을 입력하세요"
        />
        <Label htmlFor="studentId">학번을 입력하세요:</Label>
        <Input
          type="text"
          id="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          placeholder="학번을 입력하세요"
        />
        <Label htmlFor="phone">전화번호를 입력하세요:</Label>
        <Input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="전화번호를 입력하세요"
        />
        <Label htmlFor="password">비밀번호를 입력하세요:</Label> {/* 비밀번호 입력란 추가 */}
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="비밀번호를 입력하세요"
        />
      </Form>

      {/* 인증번호 요청 폼 */}
      <Form onSubmit={requestVerificationCode}>
        <Label htmlFor="email">이메일:</Label>
        <Input
          type="email"
          id="email"
          value={email}
          readOnly
          placeholder="자동 생성된 이메일"
        />
        <Button type="submit">인증번호 전송</Button>
      </Form>

      {/* 인증번호 확인 폼 */}
      <Form onSubmit={verifyCode}>
        <Label htmlFor="code">인증번호를 입력하세요:</Label>
        <Input
          type="text"
          id="code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          placeholder="수신한 인증번호를 입력하세요"
        />
        <Button type="submit">인증번호 확인</Button>
      </Form>

      <Message color={messageColor}>{responseMessage}</Message>

      {/* 로그인으로 이동하는 버튼 추가 */}
      <Button onClick={handleLogin}>로그인</Button>
    </Container>
  );
}

export default StudentSignup;
