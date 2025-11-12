import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});

db.connect((err) => {
  if (err) console.error("❌ MySQL 연결 실패:", err);
  else console.log("✅ MySQL 연결 성공");
});

// 테스트용 API
app.get("/", (req, res) => {
  res.send("API 서버 정상 작동 중!");
});

// 로그인 API
app.post("/login", (req, res) => {
  const { studentId, password } = req.body;

  const query = "SELECT * FROM users WHERE name = ? AND password = ?";
  db.query(query, [studentId, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ success: false, message: "로그인 실패: 학번 또는 비밀번호 확인" });
    }
  });
});


app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
