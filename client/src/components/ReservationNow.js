import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// 스타일 정의
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

const ReservationNow = () => {
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
            <h2>현재 예약 현황 보기</h2>
            <CourseContainer>
                <CourseSection>
                    <CourseTitle>안양역에서 학교</CourseTitle>
                    <Table>
                        <thead>
                            <TableRow>
                                <TableHeader>시간</TableHeader>
                                <TableHeader>예약 인원</TableHeader>
                            </TableRow>
                        </thead>
                        <tbody>
                            {times.timesOne.length > 0 ? (
                                times.timesOne.map((time, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{time.time}</TableCell>
                                        <TableCell>{time.people}명</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="2">예약 가능한 시간이 없습니다.</TableCell>
                                </TableRow>
                            )}
                        </tbody>
                    </Table>
                </CourseSection>

                <CourseSection>
                    <CourseTitle>학교에서 안양역</CourseTitle>
                    <Table>
                        <thead>
                            <TableRow>
                                <TableHeader>시간</TableHeader>
                                <TableHeader>예약 인원</TableHeader>
                            </TableRow>
                        </thead>
                        <tbody>
                            {times.timesTwo.length > 0 ? (
                                times.timesTwo.map((time, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{time.time}</TableCell>
                                        <TableCell>{time.people}명</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="2">예약 가능한 시간이 없습니다.</TableCell>
                                </TableRow>
                            )}
                        </tbody>
                    </Table>
                </CourseSection>

                <CourseSection>
                    <CourseTitle>범계에서 학교</CourseTitle>
                    <Table>
                        <thead>
                            <TableRow>
                                <TableHeader>시간</TableHeader>
                                <TableHeader>예약 인원</TableHeader>
                            </TableRow>
                        </thead>
                        <tbody>
                            {times.timesThree.length > 0 ? (
                                times.timesThree.map((time, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{time.time}</TableCell>
                                        <TableCell>{time.people}명</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="2">예약 가능한 시간이 없습니다.</TableCell>
                                </TableRow>
                            )}
                        </tbody>
                    </Table>
                </CourseSection>

                <CourseSection>
                    <CourseTitle>학교에서 범계</CourseTitle>
                    <Table>
                        <thead>
                            <TableRow>
                                <TableHeader>시간</TableHeader>
                                <TableHeader>예약 인원</TableHeader>
                            </TableRow>
                        </thead>
                        <tbody>
                            {times.timesFour.length > 0 ? (
                                times.timesFour.map((time, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{time.time}</TableCell>
                                        <TableCell>{time.people}명</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="2">예약 가능한 시간이 없습니다.</TableCell>
                                </TableRow>
                            )}
                        </tbody>
                    </Table>
                </CourseSection>
            </CourseContainer>
        </Container>
    );
};

export default ReservationNow;
