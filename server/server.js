const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("🚀 서버가 정상적으로 실행 중!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
