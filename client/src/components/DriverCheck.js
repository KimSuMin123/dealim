import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// 스타일 정의
const Container = styled.div`
    padding: 20px;
    background-color: #f4f4f4;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
`;

const TableContainer = styled.div`
    width: 24%;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
    text-align: center;
`;

const DriverCheck = () => {
    const [times, setTimes] = useState({
        timesOne: [],
        timesTwo: [],
        timesThree: [],
        timesFour: []
    }); // 코스별 셔틀 시간 목록
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태

    // API에서 데이터를 가져오는 함수
    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const response = await axios.get('http://localhost:3003/times'); // 서버의 /times API 호출
                setTimes(response.data); // 데이터를 상태에 저장
                setLoading(false);
            } catch (error) {
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchTimes(); // 컴포넌트가 로드될 때 호출
    }, []);

    // 배차 계산 함수
    const getBusAllocation = (people) => {
        if (people === 0) {
            return '배차 없음';
        } else if (people <= 30) {
            return '1대 배차';
        } else {
            return '2대 배차';
        }
    };

    // 로딩 중일 때 표시할 내용
    if (loading) {
        return <p>로딩 중...</p>;
    }

    // 에러가 발생한 경우 표시할 내용
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Container>
            {/* 각 코스별 배차 상태를 표시 */}
            <TableContainer>
                <CourseTitle>안양역에서 학교 (TimesOne)</CourseTitle>
                <Table>
                    <thead>
                        <TableRow>
                            <TableHeader>시간</TableHeader>
                            <TableHeader>예약 인원</TableHeader>
                            <TableHeader>배차 현황</TableHeader>
                        </TableRow>
                    </thead>
                    <tbody>
                        {times.timesOne.length > 0 ? (
                            times.timesOne.map((time, index) => (
                                <TableRow key={index}>
                                    <TableCell>{time.time}</TableCell>
                                    <TableCell>{time.people}명</TableCell>
                                    <TableCell>{getBusAllocation(time.people)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="3">예약 가능한 시간이 없습니다.</TableCell>
                            </TableRow>
                        )}
                    </tbody>
                </Table>
            </TableContainer>

            <TableContainer>
                <CourseTitle>학교에서 안양역 (TimesTwo)</CourseTitle>
                <Table>
                    <thead>
                        <TableRow>
                            <TableHeader>시간</TableHeader>
                            <TableHeader>예약 인원</TableHeader>
                            <TableHeader>배차 현황</TableHeader>
                        </TableRow>
                    </thead>
                    <tbody>
                        {times.timesTwo.length > 0 ? (
                            times.timesTwo.map((time, index) => (
                                <TableRow key={index}>
                                    <TableCell>{time.time}</TableCell>
                                    <TableCell>{time.people}명</TableCell>
                                    <TableCell>{getBusAllocation(time.people)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="3">예약 가능한 시간이 없습니다.</TableCell>
                            </TableRow>
                        )}
                    </tbody>
                </Table>
            </TableContainer>

            <TableContainer>
                <CourseTitle>범계에서 학교 (TimesThree)</CourseTitle>
                <Table>
                    <thead>
                        <TableRow>
                            <TableHeader>시간</TableHeader>
                            <TableHeader>예약 인원</TableHeader>
                            <TableHeader>배차 현황</TableHeader>
                        </TableRow>
                    </thead>
                    <tbody>
                        {times.timesThree.length > 0 ? (
                            times.timesThree.map((time, index) => (
                                <TableRow key={index}>
                                    <TableCell>{time.time}</TableCell>
                                    <TableCell>{time.people}명</TableCell>
                                    <TableCell>{getBusAllocation(time.people)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="3">예약 가능한 시간이 없습니다.</TableCell>
                            </TableRow>
                        )}
                    </tbody>
                </Table>
            </TableContainer>

            <TableContainer>
                <CourseTitle>학교에서 범계 (TimesFour)</CourseTitle>
                <Table>
                    <thead>
                        <TableRow>
                            <TableHeader>시간</TableHeader>
                            <TableHeader>예약 인원</TableHeader>
                            <TableHeader>배차 현황</TableHeader>
                        </TableRow>
                    </thead>
                    <tbody>
                        {times.timesFour.length > 0 ? (
                            times.timesFour.map((time, index) => (
                                <TableRow key={index}>
                                    <TableCell>{time.time}</TableCell>
                                    <TableCell>{time.people}명</TableCell>
                                    <TableCell>{getBusAllocation(time.people)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="3">예약 가능한 시간이 없습니다.</TableCell>
                            </TableRow>
                        )}
                    </tbody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default DriverCheck;
