const express = require("express");
const db = require("./db"); // 방금 만든 MySQL 설정 불러오기
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const authRouter = require("./routes/auth"); //회원가입, 로그인 라우터
require("dotenv").config();

// 미들웨어 설정
app.use(
  cors({
    origin: "http://localhost:3000", // 클라이언트 URL
    credentials: true, // 쿠키, 인증 정보 포함 가능
  })
);
app.use(express.json()); // JSON 파싱(데이터와 파일을 전송할 때 필요)
app.use("/api/auth", authRouter); // /api/auth 경로로 라우팅

console.log("✅ 서버가 실행되었으며, 라우터가 등록되었습니다.");
console.log("authRouter:", authRouter);

app.get("/", (req, res) => {
  res.send("🚀 서버가 정상적으로 실행 중입니다!");
});

// API 테스트용 엔드포인트 (MySQL 연결 확인)
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS solution");
    res.json({ message: "✅ MySQL 연결 성공!", result: rows[0].solution });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ MySQL 연결 실패!" });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
