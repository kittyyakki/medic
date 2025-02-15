const dotenv = require("dotenv");

dotenv.config(); // .env 파일 로드

const config = {
  PORT: process.env.PORT || 5000,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  // 기타 구성 옵션 추가 가능
};

module.exports = config;
