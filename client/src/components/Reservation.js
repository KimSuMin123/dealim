import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reservation = () => {
    const [times, setTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [reservationMessage, setReservationMessage] = useState(null);

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

    // 셔틀 시간 예약 함수
    const handleReservation = async () => {
        if (!selectedTime) {
            setReservationMessage('예약할 시간을 선택해주세요.');
            return;
        }

        try {
            const token = localStorage.getItem('token'); // 사용자의 JWT 토큰을 로컬스토리지에서 가져옴
            const response = await axios.post(
                'http://localhost:3003/reserve',
                { time: selectedTime },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setReservationMessage('예약이 성공적으로 완료되었습니다!');
        } catch (error) {
            setReservationMessage('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
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
            <ul>
                {times.length > 0 ? (
                    times.map((time, index) => (
                        <li key={index}>
                            <label>
                                <input
                                    type="radio"
                                    name="shuttleTime"
                                    value={time.time}
                                    onChange={() => setSelectedTime(time.time)}
                                />
                                {time.time}
                            </label>
                        </li>
                    ))
                ) : (
                    <li>예약 가능한 시간이 없습니다.</li>
                )}
            </ul>

            {/* 예약 버튼 */}
            <button onClick={handleReservation}>예약하기</button>

            {/* 예약 결과 메시지 */}
            {reservationMessage && <p>{reservationMessage}</p>}
        </div>
    );
};

export default Reservation;
