// Express 서버 프레임워크를 로드합니다.
const express = require("express");
// 비밀번호 해시를 위한 bcrypt 모듈을 로드합니다.
const bcrypt = require("bcrypt");
// JWT(제이슨 웹 토큰) 생성 및 검증을 위한 모듈을 로드합니다.
const jwt = require("jsonwebtoken");
// MySQL 데이터베이스 연결 모듈을 로드합니다.
const db = require("../db");
// 환경 변수를 로드합니다.
require("dotenv").config();

// Express의 Router 객체를 생성합니다.
const router = express.Router();

// 회원가입 엔드포인트
router.post("/register", async (req, res) => {
  // ✅ "/api/auth/register"가 자동 적용됨
  // 요청 본문에서 이메일, 비밀번호, 이름을 추출합니다.
  const { email, password, name } = req.body;

  // 필드가 비어있는지 확인합니다.
  if (!email || !password || !name) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
    // 비밀번호를 해시화합니다. 10은 해시화를 위한 salt 라운드 수입니다.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 정보를 데이터베이스에 삽입하는 SQL 쿼리.
    const sql = "INSERT INTO users (email, password, name) VALUES (?, ?, ?)";
    db.query(sql, [email, hashedPassword, name], (err, result) => {
      if (err) {
        // SQL 쿼리 실행 중 오류 발생 시 콘솔에 기록하고 클라이언트에게 응답합니다.
        console.error("회원가입 오류:", err);
        return res.status(500).json({ message: "회원가입 실패" });
      }
      // 성공 시 201 상태 코드와 함께 응답합니다.
      res.status(201).json({ message: "회원가입 성공" });
    });
  } catch (error) {
    // 비밀번호 해시화 중 오류 발생 시 500 상태 코드로 응답합니다.
    res.status(500).json({ message: "서버 오류" });
  }
});

// 로그인 엔드포인트
router.post("/login", (req, res) => {
  // 요청 본문에서 이메일과 비밀번호를 추출합니다.
  const { email, password } = req.body;

  // 필드가 비어있는지 확인합니다.
  if (!email || !password) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  // 이메일에 해당하는 사용자를 찾기 위한 SQL 쿼리.
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      // SQL 쿼리 실행 중 오류 발생 시 콘솔에 기록하고 클라이언트에게 응답합니다.
      console.error("로그인 오류:", err);
      return res.status(500).json({ message: "로그인 실패" });
    }

    // 사용자가 데이터베이스에 없을 경우.
    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    // 찾은 사용자 정보.
    const user = results[0];
    // 입력된 비밀번호와 저장된 해시된 비밀번호를 비교합니다.
    const isMatch = await bcrypt.compare(password, user.password);

    // 비밀번호가 일치하지 않는 경우.
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    // JWT 토큰을 생성합니다. 토큰은 사용자 ID와 이메일을 포함하고, 1시간 후 만료됩니다.
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // 로그인 성공 응답을 보냅니다.
    res.json({ message: "로그인 성공", token });
  });
});

// 라우터를 모듈로 내보냅니다.
module.exports = router;