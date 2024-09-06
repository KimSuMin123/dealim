import React from 'react';
import styled from 'styled-components';

// Styled components for the modal
const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
`;

const CloseButton = styled.button`
    margin-top: 20px;
    background-color: grey;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const DeletePopup = ({ onClose }) => {
    return (
        <ModalBackground>
            <ModalContent>
                <h2>예약이 정상적으로 취소 되었습니다.</h2>
                <p>셔틀을 이용하고 싶으시면 재예약 후 이용 해 주세요.</p>
                <CloseButton onClick={onClose}>닫기</CloseButton>
            </ModalContent>
        </ModalBackground>
    );
};

export default DeletePopup;
