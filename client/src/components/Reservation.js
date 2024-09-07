import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmPopup from '../components/ReservationOk';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 10px;
  max-width: 600px;
  margin: 20px auto;
`;

const TimeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const TimeButton = styled.button`
  flex: 1 1 100%; // Full width on smaller screens
  max-width: calc(20% - 10px); // Maximum five items per row
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    max-width: calc(33.333% - 10px); // Three items per row on tablet
  }

  @media (max-width: 480px) {
    max-width: calc(50% - 10px); // Two items per row on mobile
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const SelectCourse = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Reservation = () => {
    const [times, setTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('timesone');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const response = await axios.get(`http://localhost:3003/times/${selectedCourse}`);
                setTimes(response.data.times);
                setLoading(false);
            } catch (error) {
                setError('시간 데이터를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };
        fetchTimes();
    }, [selectedCourse]);

    const getKoreanTime = () => {
        const now = new Date();
        const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
        const koreaTimeOffset = 9 * 60 * 60000;
        return new Date(utcNow + koreaTimeOffset);
    };

    const isTimeReservable = (shuttleTime) => {
        const koreanNow = getKoreanTime();
        const [shuttleHours, shuttleMinutes] = shuttleTime.split(':');
        const shuttleDate = new Date(koreanNow);
        shuttleDate.setHours(shuttleHours);
        shuttleDate.setMinutes(shuttleMinutes);
        shuttleDate.setSeconds(0);
        const tenMinutesBeforeShuttle = new Date(shuttleDate.getTime() - 10 * 60000);
        return koreanNow < tenMinutesBeforeShuttle;
    };

    const openPopup = (time) => {
        setSelectedTime(time);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedTime('');
    };

    const handleReservation = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3003/reserve',
                { time: selectedTime, course: selectedCourse },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('예약이 성공적으로 완료되었습니다!');
            closePopup();
            navigate('/check');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    if (loading) return <div>시간 데이터를 불러오는 중입니다...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container>
            <Title>셔틀 예약 가능한 시간 목록</Title>
            <SelectCourse onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
                <option value="timesone">안양역에서 학교</option>
                <option value="timestwo">학교에서 안양역</option>
                <option value="timesthree">범계에서 학교</option>
                <option value="timesfour">학교에서 범계</option>
            </SelectCourse>
            <TimeGrid>
                {times.length > 0 ? times.filter((time) => isTimeReservable(time.time)).map((time, index) => (
                    <TimeButton key={index} onClick={() => openPopup(time.time)}>
                        {time.time}
                    </TimeButton>
                )) : <div>예약 가능한 시간이 없습니다.</div>}
            </TimeGrid>
            {isPopupOpen && (
                <ConfirmPopup time={selectedTime} onConfirm={handleReservation} onCancel={closePopup} />
            )}
        </Container>
    );
};

export default Reservation;
