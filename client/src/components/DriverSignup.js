import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const DriverSignup = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('');  // course 필드 추가
  const [responseMessage, setResponseMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !phone || !busNumber || !password || !course) {  // course 검증 추가
      setResponseMessage('이름, 전화번호, 호차, 비밀번호, 코스를 모두 입력하세요.');
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
          password,
          course,  // course 값 전송
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
    navigate('/');
  };

  return (
    <Container>
      <Title>기사 회원 가입</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="name">이름:</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="이름을 입력하세요"
        />

        <Label htmlFor="phone">전화번호:</Label>
        <Input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="전화번호를 입력하세요"
        />

        <Label htmlFor="busNumber">호차:</Label>
        <Input
          type="text"
          id="busNumber"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
          required
          placeholder="호차를 입력하세요"
        />

        <Label htmlFor="course">코스:</Label>
        <p>안양 - 학교 운영 하시는 기사님은 1 <br />
        범계 - 학교 운영하시는 기사님은 2</p>  {/* 코스 입력 필드 추가 */}
        <Input
          type="text"
          id="course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
          placeholder="코스를 입력하세요"
        />
      
        
        <Label htmlFor="password">비밀번호:</Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="비밀번호를 입력하세요"
        />

        <Button type="submit">회원 가입</Button>
      </Form>

      <Message color={messageColor}>{responseMessage}</Message>
      <Button onClick={handleLogin}>로그인</Button>
    </Container>
  );
}

export default DriverSignup;
