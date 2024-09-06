import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmPopup from '../components/ReservationOk';
import styled from 'styled-components';

const TimeGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const TimeButton = styled.button`
    flex: 1 1 calc(20% - 10px); /* 한 줄에 5개 배치 (100% / 5 = 20%) */
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    
    &:hover {
        background-color: #0056b3;
    }
`;

const Reservation = () => {
    const [times, setTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // 셔틀 시간 데이터를 가져오는 함수
    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const response = await axios.get('http://localhost:3003/times');
                setTimes(response.data.times);
                setLoading(false);
            } catch (error) {
                setError('시간 데이터를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchTimes();
    }, []);

    // 팝업을 열기 위한 함수
    const openPopup = (time) => {
        setSelectedTime(time);
        setIsPopupOpen(true);
    };

    // 팝업 닫기 함수
    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedTime('');
    };

    // 셔틀 시간 예약 함수
    const handleReservation = async () => {
        try {
            const token = localStorage.getItem('token'); // 사용자의 JWT 토큰을 로컬스토리지에서 가져옴
            await axios.post(
                'http://localhost:3003/reserve',
                { time: selectedTime },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('예약이 성공적으로 완료되었습니다!');
            closePopup();
        } catch (error) {
            alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    // 로딩 중일 때 표시할 내용
    if (loading) {
        return <div>시간 데이터를 불러오는 중입니다...</div>;
    }

    // 에러가 발생한 경우
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>셔틀 예약 가능한 시간 목록</h2>
            <TimeGrid>
                {times.length > 0 ? (
                    times.map((time, index) => (
                        <TimeButton key={index} onClick={() => openPopup(time.time)}>
                            {time.time}
                        </TimeButton>
                    ))
                ) : (
                    <div>예약 가능한 시간이 없습니다.</div>
                )}
            </TimeGrid>

            {/* 팝업 컴포넌트 */}
            {isPopupOpen && (
                <ConfirmPopup
                    time={selectedTime}
                    onConfirm={handleReservation}
                    onCancel={closePopup}
                />
            )}
        </div>
    );
};

export default Reservation;
