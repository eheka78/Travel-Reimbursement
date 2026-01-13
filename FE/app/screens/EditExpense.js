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
import { CATEGORY } from "../constant/category";
import ReceiptImagePickerEdit from "../component/ReceiptImagePickerEdit";

export default function EditExpense({ route, navigation }) {
	const { expense, tripId, fetchTripAccountStatistics } = route.params;

	const [loading, setLoading] = useState(true);
	const [description, setDescription] = useState(expense.description || "");
	const [memo, setMemo] = useState(expense.memo || "");
	const [amount, setAmount] = useState(expense.amount?.toString() || "");
	const [category, setCategory] = useState(expense.category || "기타");
	const [members, setMembers] = useState([]);
	const [selectedPaidBy, setSelectedPaidBy] = useState(expense.paid_by);
	const [shares, setShares] = useState({});
	const [splitMode, setSplitMode] = useState("엔빵");
	const [remaining, setRemaining] = useState(0);

	// ✅ receipts를 { uri } 형태로 통일
	const [file, setFile] = useState(
		(expense.receipts || []).map((r) => ({ uri: r }))
	);

	const [date, setDate] = useState(new Date(expense.created_at));
	const [showPicker, setShowPicker] = useState({ mode: null });

	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const res = await api.get(`/trips/${tripId}/members`);
				setMembers(res.data.members);

				const initShares = {};
				res.data.members.forEach((m) => {
					const found = expense.shares?.find(s => s.user_id === m.id);
					initShares[m.id] = found ? found.share.toString() : "0";
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

	// 엔빵
	useEffect(() => {
		if (splitMode !== "엔빵" || !amount || members.length === 0) return;
		const split = (Number(amount) / members.length).toFixed(2);
		const next = {};
		members.forEach(m => (next[m.id] = split));
		setShares(next);
		setRemaining(0);
	}, [amount, members, splitMode]);

	// 직접 입력
	useEffect(() => {
		if (splitMode !== "직접 입력") return;
		const total = Object.values(shares).reduce(
			(s, v) => s + Number(v || 0),
			0
		);
		setRemaining(Number(amount || 0) - total);
	}, [shares, amount, splitMode]);

	const handleEdit = async () => {
		console.log("memo:", memo);

		const sharesArray = members.map(m => ({
			user_id: m.id,
			share: Number(shares[m.id] || 0),
		}));

		// ✅ 기존 / 새 이미지 분리
		const keepReceipts = file
			.filter(f => f.uri && !f.uri.startsWith("file://"))
			.map(f => f.uri);

		const newFiles = file.filter(f => f.uri?.startsWith("file://"));

		const formData = new FormData();
		formData.append("paid_by", selectedPaidBy);
		formData.append("amount", Number(amount));
		formData.append("description", description);
		formData.append("memo", memo);
		formData.append("category", category);
		formData.append("created_at", FormatDateTimeKST(date));
		formData.append("shares", JSON.stringify(sharesArray));
		formData.append("keep_receipts", JSON.stringify(keepReceipts));

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
				formData
			);

			fetchTripAccountStatistics?.();
			navigation.pop();
		} catch (e) {
			console.error(e);
			alert("수정 실패");
		}
	};


	if (loading) return <Text>로딩 중...</Text>;

	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={styles.container}>

					{/* 날짜 */}
					<View style={styles.card}>
						<Text style={styles.label}>지출 날짜</Text>
						<Text>{date.toLocaleString()}</Text>
					</View>

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
							<Picker selectedValue={category} onValueChange={setCategory}>
								{CATEGORY.map(c => (
									<Picker.Item key={c} label={c} value={c} />
								))}
							</Picker>
						</View>
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
						<ReceiptImagePickerEdit file={file} setFile={setFile} />
					</View>

					<Pressable style={styles.submitButton} onPress={handleEdit}>
						<Text style={styles.submitText}>수정하기</Text>
					</Pressable>
				</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};



const styles = StyleSheet.create({
	container: { padding: 16 },
	card: {
		backgroundColor: "#fff",
		borderRadius: 14,
		padding: 16,
		marginBottom: 14,
	},
	label: { fontWeight: "700", marginBottom: 6 },
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
