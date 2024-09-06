import React from 'react';
import styled from 'styled-components';

const PopupContainer = styled.div`
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

const PopupContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 300px;
`;

const ButtonContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
`;

const ConfirmButton = styled.button`
    background-color: green;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
`;

const CancelButton = styled.button`
    background-color: red;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
`;

const ReservationOk = ({ time, onConfirm, onCancel }) => {
    return (
        <PopupContainer>
            <PopupContent>
                <h2>{time}에 셔틀을 예약하시겠습니까?</h2>
                <ButtonContainer>
                    <CancelButton onClick={onCancel}>아니요</CancelButton>
                    <ConfirmButton onClick={onConfirm}>네</ConfirmButton>
                </ButtonContainer>
            </PopupContent>
        </PopupContainer>
    );
};

export default ReservationOk;

