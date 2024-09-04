const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken'); // JWT 패키지 추가

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

// Users 모델 정의 (비밀번호 필드 추가)
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    role: {
        type: DataTypes.ENUM('student', 'driver'),
        allowNull: false,
    },
    student_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    bus_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING, // 비밀번호 필드 추가
        allowNull: false,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'Users',
    timestamps: false,
});

// 데이터베이스 연결 확인
sequelize.authenticate()
    .then(() => console.log('데이터베이스 연결 성공'))
    .catch(err => console.error('데이터베이스 연결 실패:', err));

// 인증번호를 저장할 객체
let verificationCodes = {};

// 인증번호 생성 함수
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6자리 랜덤 숫자 생성
};

// Nodemailer 설정
const transporter = nodemailer.createTransport({
    service: 'naver',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 인증번호를 이메일로 보내는 함수
const sendVerificationEmail = async (toEmail, verificationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: '이메일 인증번호',
        text: `귀하의 인증번호는 다음과 같습니다: ${verificationCode}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('이메일 전송 완료: ' + info.response);
    } catch (error) {
        console.error('이메일 전송 오류: ', error);
        throw new Error('이메일 전송 실패: ' + error.message);
    }
};

// 이메일로 인증번호 보내는 API 엔드포인트
app.post('/send-verification-code', (req, res) => {
    const userEmail = req.body.email;

    if (!userEmail) {
        return res.status(400).json({ message: '이메일이 필요합니다.' });
    }

    const verificationCode = generateVerificationCode();
    verificationCodes[userEmail] = verificationCode; // 이메일과 인증번호를 저장

    sendVerificationEmail(userEmail, verificationCode)
        .then(() => {
            res.status(200).json({ message: '인증번호가 전송되었습니다!' });
        })
        .catch((error) => {
            res.status(500).json({ message: '이메일 전송 중 오류 발생', error: error.message });
        });
});

// 인증번호 확인 및 회원가입 API
app.post('/verify-code', async (req, res) => {
    const { name, studentId, phone, email, code, password } = req.body;

    if (!email || !code || !password) {
        return res.status(400).json({ message: '이메일, 인증번호 및 비밀번호가 필요합니다.' });
    }

    const storedCode = verificationCodes[email]; // 저장된 인증번호 가져오기

    if (storedCode && storedCode === parseInt(code)) {
        try {
            // 전화번호 중복 확인
            const existingUser = await User.findOne({ where: { phone_number: phone } });
            if (existingUser) {
                return res.status(400).json({ message: '이미 가입된 회원입니다.' });
            }

            // 비밀번호 암호화
            const hashedPassword = await bcrypt.hash(password, 10);

            // 사용자 정보를 DB에 저장
            await User.create({
                role: studentId ? 'student' : 'driver',
                student_id: studentId || null,
                email,
                phone_number: phone,
                bus_number: studentId ? null : '1',  // 호차는 예시로 기본값 '1' 사용
                password: hashedPassword,
                verified: true,
            });

            delete verificationCodes[email]; // 인증 완료 후 코드 삭제
            res.status(200).json({ message: '이메일 인증 완료! 회원가입 완료.' });
        } catch (error) {
            res.status(500).json({ message: '사용자 정보 저장 중 오류 발생', error: error.message });
        }
    } else {
        res.status(400).json({ message: '잘못된 인증번호이거나 이메일이 일치하지 않습니다.' });
    }
});

// 기사 회원 가입 API 엔드포인트 (비밀번호 필드 추가)
app.post('/register-driver', async (req, res) => {
    const { name, phone, bus_number, password } = req.body;

    if (!name || !phone || !bus_number || !password) {
        return res.status(400).json({ message: '이름, 전화번호, 호차 및 비밀번호 정보를 모두 입력해야 합니다.' });
    }

    try {
        // 전화번호 중복 확인
        const existingUser = await User.findOne({ where: { phone_number: phone } });
        if (existingUser) {
            return res.status(400).json({ message: '이미 가입된 회원입니다.' });
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 드라이버 정보 저장 (이메일 필드 없이)
        const newDriver = await User.create({
            role: 'driver',
            student_id: null,
            email: null,
            phone_number: phone,
            bus_number: bus_number,
            password: hashedPassword,
            verified: true,
        });

        res.status(201).json({ message: '기사 회원 가입이 완료되었습니다.', driver: newDriver });
    } catch (error) {
        res.status(500).json({ message: '기사 회원 가입 중 오류 발생', error: error.message });
    }
});

// JWT 토큰 인증 미들웨어
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다. 접근이 거부되었습니다.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
        }

        req.user = user;
        next();
    });
};

// 로그인 API 엔드포인트
app.post('/login', async (req, res) => {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
        return res.status(400).json({ message: '이메일 또는 전화번호와 비밀번호가 필요합니다.' });
    }

    try {
        // 사용자 정보 검색 (이메일 또는 전화번호로)
        const user = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email: emailOrPhone },
                    { phone_number: emailOrPhone }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({ message: '존재하지 않는 사용자입니다.' });
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: '비밀번호가 올바르지 않습니다.' });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '10h', // 토큰 유효 기간 설정 (예: 1시간)
        });

        // 사용자에게 토큰 반환
        res.status(200).json({ message: '로그인 성공', token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: '로그인 중 오류 발생', error: error.message });
    }
});

// 보호된 API 엔드포인트 예시
app.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: `안녕하세요, ${req.user.role}님! 이 페이지는 보호된 페이지입니다.` });
});

// 서버 시작
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
