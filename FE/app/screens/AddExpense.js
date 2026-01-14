import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	ScrollView,
	StyleSheet,
	Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { FormatDateTimeKST } from "../utils/FormatDateTimeKST";
import ReceiptImagePicker from "../component/ReceiptImagePicker";
import { CATEGORY } from '../constant/category';
import { FormatUTCtoDateTime } from "../utils/FormatUTCtoDateTime";

export default function AddExpense({ route, navigation }) {
	const { trip } = route.params;

	const [loading, setLoading] = useState(true);
	const [description, setDescription] = useState("");
	const [memo, setMemo] = useState("");
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState("기타");
	const [members, setMembers] = useState([]);
	const [selectedPaidBy, setSelectedPaidBy] = useState(null);
	const [shares, setShares] = useState({});
	const [splitMode, setSplitMode] = useState("엔빵");  // 엔빵, 직접 입력
	const [remaining, setRemaining] = useState(0);

	const [file, setFile] = useState([]);	// 영수증 이미지 저장

	const [date, setDate] = useState(new Date());
	const [showPicker, setShowPicker] = useState({ mode: null });

	useEffect(() => {
		console.log(date);
	}, [date]);

	useEffect(() => {
		const fetchMembers = async () => {
			const res = await api.get(`/trips/${trip.trip_id}/members`);
			setMembers(res.data.members);
			if (res.data.members.length > 0) {
				setSelectedPaidBy(res.data.members[0].id);
				const init = {};
				res.data.members.forEach((m) => (init[m.id] = "0"));
				setShares(init);
			}
			setLoading(false);
		};
		fetchMembers();
	}, []);

	useEffect(() => {
		if (splitMode !== "엔빵" || !amount || members.length === 0) {
			return;
		}
		const split = (Number(amount) / members.length).toFixed(2);
		const updated = {};
		members.forEach((m) => (updated[m.id] = split));
		setShares(updated);
		setRemaining(0);
	}, [amount, members, splitMode]);

	useEffect(() => {
		if (splitMode !== "직접 입력") { return; }

		const total = Object.values(shares).reduce(
			(sum, v) => sum + Number(v || 0),
			0
		);
		setRemaining(Number(amount || 0) - total);
	}, [shares, amount, splitMode]);

	const handleSubmit = async () => {
		console.log("==== [SUBMIT START] ====");

		if (!description || !amount || !selectedPaidBy) {
			alert("설명, 금액, 지불자를 입력해주세요.");
			return;
		}

		if (splitMode === "직접 입력" && remaining !== 0) {
			alert(`금액이 맞지 않습니다. 남은 금액: ${remaining}`);
			return;
		}

		// shares 배열 생성
		const sharesArray = members.map((m) => ({
			user_id: m.id,
			share: Number(shares[m.id] || 0),
		}));

		console.log("sharesArray:", sharesArray);

		const formData = new FormData();

		// 기본 필드
		formData.append("paid_by", String(selectedPaidBy));
		formData.append("amount", String(amount));
		formData.append("description", description);
		formData.append("memo", memo);
		formData.append("category", category);
		formData.append("created_at", FormatUTCtoDateTime(date.toISOString()));

		// ⭐ 배열은 JSON 문자열
		formData.append("shares", JSON.stringify(sharesArray));

		// 이미지
		file.forEach((img, i) => {
			console.log(`[IMAGE ${i}]`, img);
			formData.append("receipts", {
				uri: img.uri,
				name:
					img.fileName ||
					`${FormatDateTimeKST(date)}_${description}_receipt_${i}.jpg`,
				type: img.mimeType || "image/jpeg",
			});
		});

		// 🔍 FormData 내부 로그
		console.log("---- FormData ----");
		for (const [key, value] of formData._parts) {
			console.log(key, value);
		}
		console.log("------------------");

		try {
			console.log("🚀 API REQUEST START");
			const res = await api.post(
				`/trips/${trip.trip_id}/expenses`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			console.log("✅ API RESPONSE:", res.data);

			navigation.goBack();
		} catch (err) {
			console.error("❌ API ERROR:", err.response?.data || err.message);
			alert("지출 저장에 실패했습니다.");
		}
	};



	if (loading) return <Text style={{ padding: 20 }}>로딩 중...</Text>;

	return (
		<SafeAreaProvider>
			<SafeAreaView edges={['bottom', 'top']} style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={styles.container}>

					{/* 날짜 */}
					<View style={styles.card}>
						<Text style={styles.label}>지출 날짜 / 시간</Text>
						<Text style={styles.value}>{date.toLocaleString()}</Text>

						<View style={styles.row}>
							<Pressable
								style={styles.subButton}
								onPress={() => setShowPicker({ mode: "date" })}
							>
								<Text>날짜 선택</Text>
							</Pressable>
							<Pressable
								style={styles.subButton}
								onPress={() => setShowPicker({ mode: "time" })}
							>
								<Text>시간 선택</Text>
							</Pressable>
						</View>
					</View>

					{showPicker.mode && (
						<DateTimePicker
							value={date}
							mode={showPicker.mode}
							onChange={(e, d) => {
								setShowPicker({ mode: null });
								if (d) setDate(d);
							}}
						/>
					)}

					{/* 금액 */}
					<View style={styles.card}>
						<Text style={styles.label}>총 금액</Text>
						<TextInput
							style={styles.input}
							value={amount}
							onChangeText={setAmount}
							keyboardType="numeric"
							placeholder="금액 입력"
						/>
					</View>

					{/* 설명 */}
					<View style={styles.card}>
						<Text style={styles.label}>설명</Text>
						<TextInput
							style={styles.input}
							value={description}
							onChangeText={setDescription}
							placeholder="사용 내역"
						/>
					</View>

					{/* 카테고리 */}
					<View style={styles.card}>
						<Text style={styles.label}>카테고리</Text>
						<View style={styles.pickerBox}>
							<Picker selectedValue={category} onValueChange={setCategory}>
								{CATEGORY.map((cat, index) => (
									<Picker.Item key={index} label={cat} value={cat} />
								))}
							</Picker>
						</View>
					</View>

					{/* 지불자 */}
					<View style={styles.card}>
						<Text style={styles.label}>지불자</Text>
						<View style={styles.pickerBox}>
							<Picker
								selectedValue={selectedPaidBy}
								onValueChange={setSelectedPaidBy}
							>
								{members.map((m) => (
									<Picker.Item key={m.id} label={m.name} value={m.id} />
								))}
							</Picker>
						</View>
					</View>

					{/* 분배 */}
					<View style={styles.card}>
						<Text style={styles.label}>분배 방식</Text>
						<View style={styles.pickerBox}>
							<Picker selectedValue={splitMode} onValueChange={setSplitMode}>
								<Picker.Item label="엔빵" value="엔빵" />
								<Picker.Item label="직접 입력" value="직접 입력" />
							</Picker>
						</View>

						{splitMode === "직접 입력" && (
							<View style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								marginTop: 10
							}}>
								<Text style={styles.remaining}>
									남은 금액: {remaining.toFixed(2)} 원
								</Text>

								<Pressable
									style={[styles.subButton, {
										flex: 0,
										borderRadius: 20,
										paddingVertical: 5,
										paddingHorizontal: 10
									}]}
									onPress={() => {
										const cleared = {};
										members.forEach((m) => cleared[m.id] = "");
										setShares(cleared);
										setRemaining(Number(amount || 0));
									}}
								>
									<Text style={{ fontWeight: "700", fontSize: 13 }}>⟳ 초기화</Text>
								</Pressable>
							</View>
						)}



						{members.map((m) => (
							<View key={m.id} style={styles.memberRow}>
								<Text style={{ flex: 1 }}>{m.name}</Text>
								<TextInput
									style={[styles.input, { flex: 1 }]}
									keyboardType="numeric"
									value={shares[m.id]}
									onChangeText={(v) =>
										setShares((p) => ({ ...p, [m.id]: v }))
									}
								/>
							</View>
						))}
					</View>

					{/* 메모 */}
					<View style={styles.card}>
						<Text style={styles.label}>메모</Text>
						<TextInput
							style={styles.input}
							value={memo}
							onChangeText={setMemo}
							placeholder="메모"
						/>
					</View>


					{/* 영수증 이미지 */}
					<View style={styles.card}>
						<ReceiptImagePicker file={file} setFile={setFile} />
					</View>


					{/* 등록 버튼 */}
					<Pressable style={styles.submitButton} onPress={handleSubmit}>
						<Text style={styles.submitText}>사용 내역 추가하기</Text>
					</Pressable>

				</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};


const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: "#f8f9fa",
	},
	card: {
		backgroundColor: "white",
		borderRadius: 14,
		padding: 16,
		marginBottom: 14,
	},
	label: {
		fontWeight: "700",
		marginBottom: 6,
	},
	value: {
		color: "#555",
		marginBottom: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		padding: 12,
		backgroundColor: "white",
	},
	pickerBox: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		overflow: "hidden",
	},
	row: {
		flexDirection: "row",
		gap: 10,
	},
	subButton: {
		flex: 1,
		padding: 12,
		borderRadius: 10,
		backgroundColor: "#f1f3f5",
		alignItems: "center",
	},
	memberRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginTop: 10,
	},
	remaining: {
		color: "#e03131",
		fontWeight: "600",
		marginTop: 10,
	},
	submitButton: {
		marginVertical: 30,
		backgroundColor: "#4f46e5",
		padding: 18,
		borderRadius: 16,
		alignItems: "center",
	},
	submitText: {
		color: "white",
		fontSize: 16,
		fontWeight: "700",
	},
});
