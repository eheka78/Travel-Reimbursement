import express from "express";
import mysql from "mysql2/promise"; // promise 버전으로 변경
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MySQL 연결
const db = await mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: 3306
});


console.log("✅ MySQL 연결 성공");


// ------------------------
// 테스트용 API
// ------------------------
app.get("/", (req, res) => {
	res.send("API 서버 정상 작동 중!");
});


// ------------------------
// 로그인 API
// ------------------------
app.post("/login", async (req, res) => {
	const { Id, password } = req.body;
	console.log(Id, password);
	try {
		const [results] = await db.query(
			"SELECT * FROM users WHERE name = ? AND password = ?",
			[Id, password]
		);
		if (results.length > 0) {
			res.json({ success: true, user: results[0] });
		} else {
			res.status(401).json({ success: false, message: "로그인 실패: 아이디 또는 비밀번호 확인" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});


// ------------------------
// 여행 등록 API
// ------------------------
app.post("/trips", async (req, res) => {
	const { title, start_date, end_date, user_id } = req.body;
	if (!title) return res.status(400).json({ message: "여행 제목은 필수입니다." });

	try {
		const [result] = await db.query(
			"INSERT INTO trips (title, start_date, end_date) VALUES (?, ?, ?)",
			[title, start_date, end_date]
		);
		const tripId = result.insertId;

		await db.query(
			"INSERT INTO trip_members (trip_id, user_id, role) VALUES (?, ?, 'owner')",
			[tripId, user_id]
		);

		res.status(201).json({ message: "여행 등록 성공!", tripId, ownerId: user_id });
	} catch (err) {
		if (err.code === "ER_DUP_ENTRY") {
			return res.status(409).json({ message: "이미 존재하는 여행 이름입니다." });
		}
		res.status(500).json({ message: err.message });
	}
});


// ------------------------
// 여행 정보 수정 API
// ------------------------
app.put("/trips/:tripId", async (req, res) => {

	const { tripId } = req.params;
	const { title, start_date, end_date, description } = req.body;

	console.log(tripId, title, start_date, end_date);

	if (!title) {
		return res.status(400).json({ message: "여행 제목은 필수입니다." });
	}

	try {
		const [result] = await db.query(
			`
            UPDATE trips
            SET 
                title = ?,
                start_date = ?,
                end_date = ?,
                description = ?
            WHERE id = ?
            `,
			[title, start_date, end_date, description, tripId]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "여행을 찾을 수 없습니다." });
		}

		res.json({ message: "여행 정보 수정 성공" });
	} catch (err) {
		if (err.code === "ER_DUP_ENTRY") {
			return res.status(409).json({ message: "이미 존재하는 여행 이름입니다." });
		}
		res.status(500).json({ message: err.message });
	}
});



// ------------------------
// 여행 삭제 API
// ------------------------
// DELETE /trips/:tripId
app.delete("/trips/:tripId", async (req, res) => {
	const { tripId } = req.params;
	const { title } = req.body;

	if (!title) {
		return res.status(400).json({ message: "삭제하려면 여행 제목을 입력해야 합니다." });
	}

	try {
		// 1️⃣ 삭제할 여행 확인
		const [tripCheck] = await db.query(
			`SELECT * FROM trips WHERE id = ? AND title = ?`,
			[tripId, title]
		);
		if (tripCheck.length === 0) {
			return res.status(404).json({ message: "여행 제목이 일치하지 않거나 여행을 찾을 수 없습니다." });
		}

		// 2️⃣ 해당 여행의 expenses 찾기
		const [expenses] = await db.query(
			`SELECT id FROM expenses WHERE trip_id = ?`,
			[tripId]
		);
		const expenseIds = expenses.map(e => e.id);

		// 3️⃣ expense_shares 삭제
		if (expenseIds.length > 0) {
			await db.query(
				`DELETE FROM expense_shares WHERE expense_id IN (?)`,
				[expenseIds]
			);
		}

		// 4️⃣ expenses 삭제
		await db.query(
			`DELETE FROM expenses WHERE trip_id = ?`,
			[tripId]
		);

		// 5️⃣ trip_members 삭제
		await db.query(
			`DELETE FROM trip_members WHERE trip_id = ?`,
			[tripId]
		);

		// 6️⃣ trips 삭제
		await db.query(
			`DELETE FROM trips WHERE id = ?`,
			[tripId]
		);

		res.json({ message: "여행 및 관련 데이터가 모두 삭제되었습니다." });

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});






// ------------------------
// 기존 여행 참여
// ------------------------
app.post("/trips/join", async (req, res) => {
	const { trip_name, user_id } = req.body;
	if (!trip_name || !user_id) return res.status(400).json({ message: "trip_name과 user_id가 필요합니다." });

	try {
		const [trips] = await db.query("SELECT id FROM trips WHERE title = ?", [trip_name]);
		if (trips.length === 0) return res.status(404).json({ message: "해당 여행을 찾을 수 없습니다." });

		const tripId = trips[0].id;

		await db.query(
			"INSERT INTO trip_members (trip_id, user_id) VALUES (?, ?)",
			[tripId, user_id]
		);

		res.status(201).json({ message: "여행 참여 성공!", tripId });
	} catch (err) {
		if (err.code === "ER_DUP_ENTRY") {
			return res.status(400).json({ message: "이미 참여 중인 여행입니다." });
		}
		res.status(500).json({ message: err.message });
	}
});


// ------------------------
// 내 여행 목록 조회
// ------------------------
app.get("/my-trips/:userId", async (req, res) => {
	const userId = req.params.userId;
	try {
		const [results] = await db.query(
			`SELECT *
       FROM trips t
       JOIN trip_members tm ON t.id = tm.trip_id
       WHERE tm.user_id = ?
       ORDER BY t.start_date ASC`,
			[userId]
		);
		res.status(200).json({ trips: results });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});


// ------------------------
// 여행 멤버 조회
// ------------------------
app.get("/trips/:tripId/members", async (req, res) => {
	const { tripId } = req.params;
	try {
		const [results] = await db.query(
			`SELECT u.id, u.name, tm.role, tm.joined_at
       FROM trip_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.trip_id = ?`,
			[tripId]
		);
		res.status(200).json({ members: results });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});


// ------------------------
// 소비 내역 저장 API
// ------------------------
app.post("/trips/:tripId/expenses", async (req, res) => {
	const { tripId } = req.params;
	const { paid_by, amount, description, category, participants, shares, created_at } = req.body;

	console.log(paid_by, amount, description, category, participants, shares, created_at);

	try {
		await db.beginTransaction();

		// 1. expenses 테이블에 추가
		const [expenseResult] = await db.query(
			`INSERT INTO expenses (trip_id, paid_by, amount, description, category, created_at)
       		VALUES (?, ?, ?, ?, ?, ?)`,
			[tripId, paid_by, amount, description, category, created_at]
		);

		const expenseId = expenseResult.insertId;

		// 2. shares 입력
		if (shares && shares.length > 0) {
			for (const s of shares) {
				await db.query(
					`INSERT INTO expense_shares (expense_id, user_id, share)
           			VALUES (?, ?, ?)`,
					[expenseId, s.user_id, s.share]
				);
			}
		} else if (participants && participants.length > 0) {
			const perPerson = Number((amount / participants.length).toFixed(2));
			let remaining = amount - perPerson * (participants.length - 1);
			remaining = Number(remaining.toFixed(2));

			for (let i = 0; i < participants.length; i++) {
				const userId = participants[i];
				const share = (i === participants.length - 1) ? remaining : perPerson;

				await db.query(
					`INSERT INTO expense_shares (expense_id, user_id, share)
           VALUES (?, ?, ?)`,
					[expenseId, userId, share]
				);
			}
		} else {
			throw new Error("participants 또는 shares 값이 필요합니다.");
		}

		await db.commit();
		res.json({ message: "지출이 성공적으로 저장되었습니다.", expenseId });
	} catch (err) {
		await db.rollback();
		res.status(500).json({ error: err.message });
	}
});




// ------------------------
// 소비 내역 수정 API
// ------------------------
// PUT /trips/:tripId/expenses/:expenseId
app.put("/trips/:tripId/expenses/:expenseId", async (req, res) => {
	const { tripId, expenseId } = req.params;
	const { paid_by, amount, description, category, shares, created_at } = req.body;
	console.log(paid_by, amount, description, category, shares, created_at);
	console.log(tripId, expenseId);

	if (!paid_by || !amount) {
		return res.status(400).json({ error: "paid_by와 amount는 필수입니다." });
	}

	try {
		await db.beginTransaction();

		// 1️⃣ expenses 테이블 업데이트
		await db.query(
			`UPDATE expenses 
             SET paid_by = ?, amount = ?, description = ?, category = ?, created_at = ?
             WHERE id = ? AND trip_id = ?`,
			[paid_by, amount, description, category, created_at, expenseId, tripId]
		);

		// 2️⃣ 기존 expense_shares만 업데이트
		if (shares && shares.length > 0) {
			for (const s of shares) {
				await db.query(
					`UPDATE expense_shares
                     SET share = ?
                     WHERE expense_id = ? AND user_id = ?`,
					[s.share, expenseId, s.user_id]
				);
			}
		}

		await db.commit();
		res.json({ message: "지출 정보가 성공적으로 수정되었습니다." });

	} catch (err) {
		await db.rollback();
		res.status(500).json({ error: err.message });
	}
});





// ------------------------
// 여행 멤버별 대시보드 API (총액 + 차액)
// ------------------------
app.get("/trips/:tripId/dashboard", async (req, res) => {
	const { tripId } = req.params;

	try {
		// 각 멤버별 총액 계산
		const [rows] = await db.query(
			`SELECT
         u.id AS user_id,
         u.name,
         IFNULL(paid.total_paid, 0) AS paid_total,
         IFNULL(shared.total_share, 0) AS share_total,
         (IFNULL(paid.total_paid, 0) - IFNULL(shared.total_share, 0)) AS balance
       FROM trip_members tm
       JOIN users u ON tm.user_id = u.id
       LEFT JOIN (
         SELECT paid_by, SUM(amount) AS total_paid
         FROM expenses
         WHERE trip_id = ?
         GROUP BY paid_by
       ) paid ON paid.paid_by = u.id
       LEFT JOIN (
         SELECT es.user_id, SUM(es.share) AS total_share
         FROM expense_shares es
         JOIN expenses e ON es.expense_id = e.id
         WHERE e.trip_id = ?
         GROUP BY es.user_id
       ) shared ON shared.user_id = u.id
       WHERE tm.trip_id = ?`,
			[tripId, tripId, tripId]
		);

		res.json({ members: rows });

	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "대시보드 로드 중 오류 발생" });
	}
});


// ------------------------
// 여행 지출 세부 내역 전체 조회 API
// ------------------------
app.get("/trips/:tripId/expenses", async (req, res) => {
	const { tripId } = req.params;

	try {
		// 1) 여행 지출 목록
		const [expenses] = await db.query(
			`SELECT 
         e.id AS expense_id,
         e.description,
         e.amount,
         e.category,
         e.paid_by,
         u.name AS paid_by_name,
         e.created_at
       FROM expenses e
       JOIN users u ON e.paid_by = u.id
       WHERE e.trip_id = ?
       ORDER BY e.created_at DESC`,
			[tripId]
		);

		if (expenses.length === 0) return res.json({ expenses: [] });

		// 2) 각 지출별 참여자 부담액
		const expenseIds = expenses.map(e => e.expense_id);
		const [shares] = await db.query(
			`SELECT 
         es.expense_id,
         es.user_id,
         u.name AS user_name,
         es.share
       FROM expense_shares es
       JOIN users u ON es.user_id = u.id
       WHERE es.expense_id IN (?)
       ORDER BY es.expense_id, es.user_id`,
			[expenseIds]
		);

		// 3) expenses에 shares 합치기
		const expenseMap = expenses.map(exp => {
			return {
				...exp,
				shares: shares.filter(s => s.expense_id === exp.expense_id)
			};
		});

		res.json({ expenses: expenseMap });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "지출 세부 내역 조회 중 오류 발생" });
	}
});


// ------------------------
// 지출 내역 저장 API
// ------------------------
app.post("/trips/:trip_id/expenses", async (req, res) => {

	try {
		const { trip_id } = req.params;
		const { paid_by, amount, description, category, shares } = req.body;

		if (!paid_by || !amount || !shares || shares.length === 0) {
			return res.status(400).json({ error: "필수 항목 누락" });
		}

		// 1️⃣ expenses 저장
		const [expenseResult] = await db.query(
			`INSERT INTO expenses (trip_id, paid_by, amount, description, category)
       VALUES (?, ?, ?, ?, ?)`,
			[trip_id, paid_by, amount, description, category]
		);

		const expenseId = expenseResult.insertId;

		// 2️⃣ shares 저장
		for (const share of shares) {
			await db.query(
				`INSERT INTO expense_shares (expense_id, user_id, share)
         VALUES (?, ?, ?)`,
				[expenseId, share.user_id, share.share]
			);
		}

		res.json({ message: "지출 등록 완료!", expense_id: expenseId });

	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "등록 실패", detail: err });
	}
});


// 지출 삭제
app.delete('/trips/expenses/:expense_id', async (req, res) => {
	const { expense_id } = req.params;

	try {
		// 1. expense_shares 삭제
		await db.query('DELETE FROM expense_shares WHERE expense_id = ?', [expense_id]);

		// 2. expenses 삭제
		const [result] = await db.query(
			'DELETE FROM expenses WHERE id = ?',
			[expense_id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: '삭제할 지출이 없습니다.' });
		}

		res.json({ message: '지출과 관련 부담액 삭제 완료' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: '서버 오류', error: err.message });
	}
});


// ------------------------
// 서버 실행
// ------------------------
app.listen(process.env.PORT || 3000, () => {
	console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
