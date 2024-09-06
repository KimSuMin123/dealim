import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import img from '../img/pic.jpg';
import DeletePopup from './DeletePopup';

// Styled components for layout and buttons
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #e5f5ff;
    height: 100vh;
`;

const ProfileImage = styled.img`
    width: 150px;
    height: 150px;
    
    margin: 20px 0;
`;

const Title = styled.h2`
    color: #008cba;
    margin-bottom: 20px;
`;

const InfoText = styled.h3`
    margin: 5px 0;
    color: #333;
`;

const ActionButton = styled.button`
    padding: 10px 20px;
    margin: 10px;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    background-color: ${props => props.cancel ? '#ff4d4d' : '#4caf50'};
`;

const CloseButton = styled.button`
    background-color: grey;
    color: white;
    padding: 10px;
    border: none;
    margin-top: 20px;
    border-radius: 5px;
    cursor: pointer;
`;

const Check = () => {
    const [user, setUser] = useState(null); // User information
    const [reservation, setReservation] = useState(null); // Reservation information
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false); // 팝업 표시 상태 관리

    // Fetch user and reservation info from server
    useEffect(() => {
        const fetchUserAndReservation = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3003/protected', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { data } = response;
                const userData = data.user; // Assumed user info from the server
                const reservationData = data.reservation; // Assumed reservation info

                setUser(userData);
                setReservation(reservationData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchUserAndReservation();
    }, []);

    // Cancel reservation handler
    const handleCancelReservation = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3003/cancel-reservation',
                { reservationId: reservation.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setShowPopup(true); // 예약 취소 후 팝업 표시
        } catch (error) {
            console.error('예약 취소 중 오류 발생:', error);
        }
    };

    // 현재 날짜를 포맷
    const today = new Date();
    const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    if (loading) return <div>Loading...</div>;

    return (
        <Container>
            <Title>탑승 확인 페이지</Title>

            {user && (
                <>
                    <p>{formattedDate}</p>
                    <InfoText>{reservation.reservation_time} 승차</InfoText>
                    <ProfileImage src={img} alt="Profile" />
                    
                    <InfoText>{user.student_id}</InfoText>
                    <InfoText>{user.name}</InfoText>

                    {/* Action buttons */}
                    <ActionButton cancel onClick={handleCancelReservation}>예약 취소</ActionButton>
                    <ActionButton>예약 현황</ActionButton>

                    {/* Close Button */}
                    <CloseButton onClick={() => window.close()}>닫기</CloseButton>
                </>
            )}

            {/* 예약 취소 후 팝업 표시 */}
            {showPopup && <DeletePopup onClose={() => setShowPopup(false)} />}
        </Container>
    );
};

export default Check;
