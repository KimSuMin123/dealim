import React from 'react';
import styled from 'styled-components';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const FullPopup = ({ onCancel }) => {
  return (
    <PopupOverlay>
      <PopupContent>
        <h3>만차로 예약이 불가합니다</h3>
        <p>이 셔틀은 이미 만석입니다. 다른 시간을 선택해 주세요.</p>
        <Button onClick={onCancel}>확인</Button>
      </PopupContent>
    </PopupOverlay>
  );
};

export default FullPopup;
