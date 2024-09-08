import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import styled from 'styled-components'; // styled-components import
import bus from "../img/bus.png";
// 스타일 정의
const LoginContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
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
  &:disabled {
    background-color: #ccc;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const SignupButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const SignupButton = styled.button`
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const Img = styled.img`
  width: 400px;
  height: 300px;
`;
const Login = () => {
  const [studentIdOrPhone, setStudentIdOrPhone] = useState(''); // 학번 또는 전화번호
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 한국 시간 구하는 함수
  const getKoreanTime = () => {
    const now = new Date();
    const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
    const koreaTimeOffset = 9 * 60 * 60000; // 한국은 UTC+9
    return new Date(utcNow + koreaTimeOffset);
  };

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const koreanTime = getKoreanTime();
    const currentHour = koreanTime.getHours();

    // 07시 이전이거나 22시 이후일 경우 경고 메시지 출력
    if (currentHour < 7 || currentHour >= 22) {
      setError('지금은 예약가능시간이 아닙니다. 7시~22시 사이에 이용 부탁드립니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3003/login', {
        studentIdOrPhone,
        password,
      });

      const { token, role, name } = response.data; // 이름 필드 포함하여 받아오기

      // JWT 토큰, 역할(role), 이름을 localStorage에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
  

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
    <LoginContainer>
      <Title>로그인</Title>
      <Img src={bus} alt="버스 이미지" />
      <Form onSubmit={handleLogin}>
        <div>
          <Label htmlFor="studentIdOrPhone">학번 & 전화번호</Label>
          <Input
            type="text"
            id="studentIdOrPhone"
            value={studentIdOrPhone}
            onChange={(e) => setStudentIdOrPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password"> 비 밀 번 호&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SignupButtons>
        <SignupButton onClick={handleStudentSignup}>학생 회원가입</SignupButton>
        <SignupButton onClick={handleDriverSignup}>기사 회원가입</SignupButton>
      </SignupButtons>
    </LoginContainer>
  );
};

export default Login;
