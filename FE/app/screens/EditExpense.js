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
import { CATEGORY } from "../constant/category";
import ReceiptImagePickerEdit from "../component/ReceiptImagePickerEdit";
import { FormatUTCtoDateTime } from "../utils/FormatUTCtoDateTime";


export default function EditExpense({ route, navigation }) {
	const { expense, tripId } = route.params;

	/* =========================
		state
	========================= */
	const [loading, setLoading] = useState(true);

	const [description, setDescription] = useState(expense.description || "");
	const [memo, setMemo] = useState(expense.memo || "");
	const [amount, setAmount] = useState(
		expense.amount ? String(expense.amount) : ""
	);
	const [category, setCategory] = useState(expense.category || "기타");

	const [members, setMembers] = useState([]);
	const [selectedPaidBy, setSelectedPaidBy] = useState(expense.paid_by);

	const [shares, setShares] = useState(expense.shares);
	const [splitMode, setSplitMode] = useState('');

	// splitMode 엔빵인지 직접 입력인 지 판단하는
	useEffect(() => {
		if(splitMode != ''){
			return;
		}

		if (!expense?.shares || expense.shares.length === 0) return;

		// share 값 숫자로 변환
		const shareValues = expense.shares.map(s => Number(s.share));

		// 기준값 (첫 번째 사람)
		const base = shareValues[0];

		// 전부 같은지 검사
		const isEvenSplit = shareValues.every(v => v === base);

		setSplitMode(isEvenSplit ? "엔빵" : "직접 입력");
	}, [splitMode]);

	const [remaining, setRemaining] = useState(0);

	const [file, setFile] = useState(
		(expense.receipts || []).map((uri) => ({ uri }))
	);

	const [date, setDate] = useState(new Date(expense.created_at));
	const [showPicker, setShowPicker] = useState({ mode: null });

	/* =========================
		members fetch
	========================= */
	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const res = await api.get(`/trips/${tripId}/members`);
				const list = res.data.members || [];
				setMembers(list);

				// shares 초기화
				const initShares = {};
				list.forEach((m) => {
					const found = expense.shares?.find(
						(s) => s.user_id === m.id
					);
					initShares[m.id] = found
						? String(found.share)
						: "0";
				});
				setShares(initShares);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		};

		fetchMembers();
	}, []);

	/* =========================
		엔빵
	========================= */
	useEffect(() => {
		if (splitMode !== "엔빵" || !amount || members.length === 0) return;

		const split = (Number(amount) / members.length).toFixed(2);
		const next = {};
		members.forEach((m) => (next[m.id] = split));

		setShares(next);
		setRemaining(0);
	}, [amount, members, splitMode]);

	/* =========================
		직접 입력
	========================= */
	useEffect(() => {
		if (splitMode !== "직접 입력") return;

		const total = Object.values(shares).reduce(
			(sum, v) => sum + Number(v || 0),
			0
		);
		setRemaining(Number(amount || 0) - total);
	}, [shares, amount, splitMode]);

	/* =========================
		submit
	========================= */
	const handleEdit = async () => {
		if (!description || !amount || !selectedPaidBy) {
			alert("설명, 금액, 지불자를 입력해주세요.");
			return;
		}

		if (splitMode === "직접 입력" && remaining !== 0) {
			alert(`금액이 맞지 않습니다. 남은 금액: ${remaining}`);
			return;
		}

		const sharesArray = members.map((m) => ({
			user_id: m.id,
			share: Number(shares[m.id] || 0),
		}));

		// 기존 / 신규 영수증 분리
		const keepReceipts = file
			.filter((f) => !f.uri.startsWith("file://"))
			.map((f) => f.uri);

		const newFiles = file.filter((f) =>
			f.uri.startsWith("file://")
		);

		const formData = new FormData();
		formData.append("paid_by", selectedPaidBy);
		formData.append("amount", Number(amount));
		formData.append("description", description);
		formData.append("memo", memo);
		formData.append("category", category);
		formData.append(
			"created_at",
			FormatUTCtoDateTime(date.toISOString())
		);
		formData.append("shares", JSON.stringify(sharesArray));
		formData.append(
			"keep_receipts",
			JSON.stringify(keepReceipts)
		);

		newFiles.forEach((img, i) => {
			formData.append("receipts", {
				uri: img.uri,
				name: img.fileName || `receipt_${i}.jpg`,
				type: img.mimeType || "image/jpeg",
			});
		});

		try {
			await api.put(
				`/trips/${tripId}/expenses/${expense.expense_id}`,
				formData,
			);

			navigation.pop(2);
		} catch (e) {
			console.error(e);
			alert("수정 실패");
		}
	};

	if (loading) return <Text style={{ padding: 20 }}>로딩 중...</Text>;

	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={styles.container}>
					{/* 날짜 */}
					<View style={styles.card}>
						<Text style={styles.label}>지출 날짜 / 시간</Text>
						<Text style={styles.value}>
							{date.toLocaleString()}
						</Text>

						<View style={styles.row}>
							<Pressable
								style={styles.subButton}
								onPress={() =>
									setShowPicker({ mode: "date" })
								}
							>
								<Text>날짜 선택</Text>
							</Pressable>
							<Pressable
								style={styles.subButton}
								onPress={() =>
									setShowPicker({ mode: "time" })
								}
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
						<Text style={styles.label}>금액</Text>
						<TextInput
							style={styles.input}
							value={amount}
							onChangeText={setAmount}
							keyboardType="numeric"
						/>
					</View>

					{/* 설명 */}
					<View style={styles.card}>
						<Text style={styles.label}>설명</Text>
						<TextInput
							style={styles.input}
							value={description}
							onChangeText={setDescription}
						/>
					</View>

					{/* 카테고리 */}
					<View style={styles.card}>
						<Text style={styles.label}>카테고리</Text>
						<View style={styles.pickerBox}>
							<Picker
								selectedValue={category}
								onValueChange={setCategory}
							>
								{CATEGORY.map((c) => (
									<Picker.Item
										key={c}
										label={c}
										value={c}
									/>
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
									<Picker.Item
										key={m.id}
										label={m.name}
										value={m.id}
									/>
								))}
							</Picker>
						</View>
					</View>

					{/* 분배 */}
					<View style={styles.card}>
						<Text style={styles.label}>분배 방식</Text>
						<View style={styles.pickerBox}>
							<Picker
								selectedValue={splitMode}
								onValueChange={setSplitMode}
							>
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
										setShares((p) => ({
											...p,
											[m.id]: v,
										}))
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
						/>
					</View>

					{/* 영수증 */}
					<View style={styles.card}>
						<ReceiptImagePickerEdit
							file={file}
							setFile={setFile}
						/>
					</View>

					<Pressable
						style={styles.submitButton}
						onPress={handleEdit}
					>
						<Text style={styles.submitText}>수정하기</Text>
					</Pressable>
				</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

/* =========================
	styles
========================= */
const styles = StyleSheet.create({
	container: { padding: 16 },
	card: {
		backgroundColor: "#fff",
		borderRadius: 14,
		padding: 16,
		marginBottom: 14,
	},
	label: { fontWeight: "700", marginBottom: 6 },
	value: { color: "#555", marginBottom: 10 },
	row: { flexDirection: "row", gap: 10 },
	subButton: {
		flex: 1,
		padding: 12,
		borderRadius: 10,
		backgroundColor: "#f1f3f5",
		alignItems: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		padding: 12,
	},
	pickerBox: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		overflow: "hidden",
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
		backgroundColor: "#4f46e5",
		padding: 18,
		borderRadius: 16,
		alignItems: "center",
		marginVertical: 20,
	},
	submitText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 16,
	},
});