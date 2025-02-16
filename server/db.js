const mysql = require("mysql2/promise");
const config = require("./config");

// MySQL 연결 설정
const pool = mysql.createPool({
  host: process.env.DB_HOST, // 여기서 DB_HOST는 .env 파일의 설정값을 사용
  user: process.env.DB_USER, // 여기서 DB_USER는 .env 파일의 설정값을 사용
  password: process.env.DB_PASSWORD, // 여기서 DB_PASSWORD는 .env 파일의 설정값을 사용
  database: process.env.DB_NAME, // 여기서 DB_NAME는 .env 파일의 설정값을 사용
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 연결 테스트
pool.getConnection((err, connection) => {
  if (err) {
    console.error("🔥 MySQL 연결 실패:", err);
  } else {
    console.log("✅ MySQL 연결 성공!");
    connection.release();
  }
});

module.exports = pool;
