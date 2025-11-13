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

// 여행 등록 API
app.post("/trips", (req, res) => {
  const { title, start_date, end_date, user_id } = req.body;
  if (!title) return res.status(400).json({ message: "여행 제목은 필수입니다." });

  const tripQuery = "INSERT INTO trips (title, start_date, end_date) VALUES (?, ?, ?)";

  db.query(tripQuery, [title, start_date, end_date], (err, results) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "이미 존재하는 여행 이름입니다." });
      }
      return res.status(500).json({ message: err.message });
    }

    const tripId = results.insertId;

    const memberQuery = "INSERT INTO trip_members (trip_id, user_id, role) VALUES (?, ?, 'owner')";
    db.query(memberQuery, [tripId, user_id], (err2) => {
      if (err2) return res.status(500).json({ message: err2.message });
      res.status(201).json({ message: "여행 등록 성공!", tripId, ownerId: user_id });
    });
  });
});


// 기존 여행에 들어가기
app.post("/trips/join", (req, res) => {
  const { trip_name, user_id } = req.body;

  if (!trip_name || !user_id) {
    return res.status(400).json({ message: "trip_name과 user_id가 필요합니다." });
  }
  console.log(req);
  // 여행 이름으로 trip id 찾기
  const findTripQuery = "SELECT id FROM trips WHERE title = ?";
  db.query(findTripQuery, [trip_name], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: "해당 여행을 찾을 수 없습니다." });

    const tripId = results[0].id;
    console.log(tripId);
    // trip_members에 추가
    const insertMemberQuery = "INSERT INTO trip_members (trip_id, user_id) VALUES (?, ?)";
    db.query(insertMemberQuery, [tripId, user_id], (err2) => {
      if (err2) {
        // 중복 참여 시
        if (err2.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "이미 참여 중인 여행입니다." });
        }
        return res.status(500).json({ message: err2.message });
      }

      res.status(201).json({ message: "여행 참여 성공!", tripId });
    });
  });
});


// 내 여행 목록 조회
app.get("/my-trips/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT t.id, t.title, t.start_date, t.end_date, t.created_at, tm.role
    FROM trips t
    JOIN trip_members tm ON t.id = tm.trip_id
    WHERE tm.user_id = ?
    ORDER BY t.start_date ASC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    
    console.log("내 여행 목록 조회", results);
    res.status(200).json({ trips: results });
  });
});


// 여행의 멤버 조회
app.get("/trips/:tripId/members", async (req, res) => {
  const { tripId } = req.params;

  const query = 
      `SELECT u.id, u.name, tm.role, tm.joined_at
       FROM trip_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.trip_id = ?`;

    db.query(query, [tripId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    
    console.log("여행 멤버 목록 조회", results);
    res.status(200).json({ trips: results });
  });
});


app.listen(3000, () => console.log("Server running on port 3000"));


app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
