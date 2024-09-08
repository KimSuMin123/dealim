import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    background-color: #f4f4f4;
`;

const CourseContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
`;

const CourseSection = styled.div`
    flex: 1;
    min-width: 250px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.th`
    padding: 8px;
    background-color: #333;
    color: white;
`;

const TableCell = styled.td`
    padding: 8px;
    text-align: center;
`;

const CourseTitle = styled.h3`
    color: #333;
    margin: 20px 0 10px;
`;

const DriverCheck = () => {
    const [times, setTimes] = useState({
        timesOne: [],
        timesTwo: [],
        timesThree: [],
        timesFour: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const response = await axios.get('http://localhost:3003/times');
                setTimes(response.data);
                setLoading(false);
            } catch (error) {
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchTimes();
    }, []);

    // 잔여석 계산 함수
    const calculateRemainingSeats = (people) => {
        return people < 30 ? 30 - people : 60 - people;
    };

    // 배차 상태를 계산하는 함수
    const getVehicleRequirement = (people) => {
        if (people <= 29) return "1대 배차";
        if (people <= 59) return "2대 배차";
        return "2대 배차 (만차)";
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Container>
            <h2>운행 배차 상태</h2>
            <CourseContainer>
                {Object.entries(times).map(([key, timeSlots], index) => (
                    <CourseSection key={index}>
                        <CourseTitle>
                            {key === "timesOne" && "안양역에서 학교"}
                            {key === "timesTwo" && "학교에서 안양역"}
                            {key === "timesThree" && "범계에서 학교"}
                            {key === "timesFour" && "학교에서 범계"}
                        </CourseTitle>
                        <Table>
                            <thead>
                                <TableRow>
                                    <TableHeader>시간</TableHeader>
                                    <TableHeader>예약 인원</TableHeader>
                                    <TableHeader>배차 상태</TableHeader>
                                    <TableHeader>잔여석</TableHeader> {/* 잔여석 추가 */}
                                </TableRow>
                            </thead>
                            <tbody>
                                {timeSlots.length > 0 ? timeSlots.map((time, idx) => {
                                    const vehicleRequirement = getVehicleRequirement(time.people);
                                    const remainingSeats = vehicleRequirement === "배차 없음" ? "" : `${calculateRemainingSeats(time.people)}석`;
                                    
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>{time.time}</TableCell>
                                            <TableCell>{time.people}명</TableCell>
                                            <TableCell>{vehicleRequirement}</TableCell>
                                            <TableCell>{remainingSeats}</TableCell> {/* 배차 없으면 빈칸, 있으면 잔여석 계산 */}
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan="4">예약 가능한 시간이 없습니다.</TableCell>
                                    </TableRow>
                                )}
                            </tbody>
                        </Table>
                    </CourseSection>
                ))}
            </CourseContainer>
        </Container>
    );
};

export default DriverCheck;
