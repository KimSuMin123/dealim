import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import img from '../img/pic.jpg';
import DeletePopup from './DeletePopup';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import

// Styled components
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

const ReservationList = styled.div`
    width: 100%;
    max-width: 600px;
    margin-top: 20px;
`;

const ReservationItem = styled.div`
    background-color: #f0f8ff;
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 5px;
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
    const [reservations, setReservations] = useState([]); // Multiple reservations
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false); // 팝업 표시 상태 관리
    const navigate = useNavigate(); // useNavigate 훅 사용

    // Fetch user and reservations info from server
    useEffect(() => {
        const fetchUserAndReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3003/protected', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { data } = response;
                const userData = data.user; // User info from server
                const reservationData = data.reservations; // Multiple reservations

                setUser(userData);
                setReservations(reservationData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchUserAndReservations();
    }, []);

    // 코스 이름 변환 함수
    const getCourseName = (course) => {
        switch (course) {
            case 'timesone':
                return '안양역에서 학교';
            case 'timestwo':
                return '학교에서 안양역';
            case 'timesthree':
                return '범계에서 학교';
            case 'timesfour':
                return '학교에서 범계';
            default:
                return '알 수 없는 코스';
        }
    };

    // Cancel reservation handler
    const handleCancelReservation = async (reservationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3003/cancel-reservation',
                { reservationId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setShowPopup(true); // 예약 취소 후 팝업 표시
            // Update reservations state by removing the canceled one
            setReservations(prev => prev.filter(r => r.id !== reservationId));
        } catch (error) {
            console.error('예약 취소 중 오류 발생:', error);
        }
    };

    // Format current date
    const today = new Date();
    const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    // Reservation status page navigation handler
    const goToReservationNow = () => {
        navigate('/reservation-now'); // 예약 현황 페이지로 이동
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Container>
            <Title>탑승 확인 페이지</Title>

            {user && (
                <>
                    <p>{formattedDate}</p>
                    <ProfileImage src={img} alt="Profile" />
                    <InfoText>{user.student_id}</InfoText>
                    <InfoText>{user.name}</InfoText>

                    <ReservationList>
                        {reservations.map((reservation) => (
                            <ReservationItem key={reservation.id}>
                                <InfoText>{getCourseName(reservation.course)} </InfoText> {/* 코스 이름 표시 */}
                                <InfoText>{reservation.reservation_time} 승차</InfoText>
                                <InfoText>{new Date(reservation.created_at).toLocaleString()}</InfoText>
                                {reservation.cancelled ? (
                                    <InfoText>취소됨</InfoText>
                                ) : (
                                    <ActionButton cancel onClick={() => handleCancelReservation(reservation.id)}>
                                        예약 취소
                                    </ActionButton>
                                )}
                            </ReservationItem>
                        ))}
                    </ReservationList>
                    <ActionButton onClick={goToReservationNow}>예약 현황</ActionButton>
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
