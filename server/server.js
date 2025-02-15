require("dotenv").config();
const express = require("express");
const db = require("./db"); // 방금 만든 MySQL 설정 불러오기
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 파싱

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
