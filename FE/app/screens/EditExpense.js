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


const EditExpense = ({ route, navigation }) => {
	console.log('*****************************');
	console.log( route.params);
	const expense = route.params.expense;
	const tripId = route.params.tripId;
    const fetchTripAccountStatistics = route.params?.fetchTripAccountStatistics;

	console.log(expense);

	const [loading, setLoading] = useState(true);
	const [description, setDescription] = useState(expense.description || "");
	const [amount, setAmount] = useState(expense.amount?.toString() || "");
	const [category, setCategory] = useState(expense.category || "기타");
	const [members, setMembers] = useState([]);
	const [selectedPaidBy, setSelectedPaidBy] = useState(expense.paid_by || null);
	const [shares, setShares] = useState({});
	const [splitMode, setSplitMode] = useState("엔빵");
	const [remaining, setRemaining] = useState(0);

	const [date, setDate] = useState(new Date(expense.created_at));
	const [showPicker, setShowPicker] = useState({ mode: null });

	useEffect(() => {
		const fetchMembers = async () => {
			try {
				console.log(tripId);
				const res = await api.get(`/trips/${tripId}/members`);
				const membersData = res.data.members;
				setMembers(membersData);
				console.log(res.data.members);

				if (membersData.length > 0) {
					// expense.paid_by가 members 안에 있는지 확인
					const initialPaidBy = membersData.some(m => m.id === expense.paid_by)
						? expense.paid_by
						: membersData[0].id;

					setSelectedPaidBy(initialPaidBy);

					const initShares = {};
					membersData.forEach((m) => {
						const shareObj = expense.shares?.find(s => s.user_id === m.id);
						initShares[m.id] = shareObj ? shareObj.share.toString() : "0";
					});
					setShares(initShares);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		console.log("#####################");
		fetchMembers();
		console.log("#####################");
	}, [expense]);


	// 엔빵, 직접입력 계산 로직 그대로
	useEffect(() => {
		if (splitMode !== "엔빵" || !amount || members.length === 0) return;
		const split = (Number(amount) / members.length).toFixed(2);
		const updated = {};
		members.forEach((m) => (updated[m.id] = split));
		setShares(updated);
		setRemaining(0);
	}, [amount, members, splitMode]);

	useEffect(() => {
		if (splitMode !== "직접 입력") return;
		const total = Object.values(shares).reduce(
			(sum, v) => sum + Number(v || 0),
			0
		);
		setRemaining(Number(amount || 0) - total);
	}, [shares, amount, splitMode]);


	// 수정 API 호출
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

		try {
			const res = await api.put(`/trips/${tripId}/expenses/${expense.expense_id}`, {
				paid_by: selectedPaidBy,
				amount: Number(amount),
				description,
				category,
				shares: sharesArray,
				created_at: FormatDateTimeKST(date),
			});
			console.log(res.data);

			alert("지출 내역이 수정되었습니다.");
            route.params.fetchTripAccountStatistics?.();
			navigation.pop();
		} catch (err) {
			alert(err.response?.data?.message || "수정 실패");
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
								<Picker.Item label="숙박" value="숙박" />
								<Picker.Item label="식사" value="식사" />
								<Picker.Item label="교통" value="교통" />
								<Picker.Item label="액티비티" value="액티비티" />
								<Picker.Item label="쇼핑" value="쇼핑" />
								<Picker.Item label="기타" value="기타" />
							</Picker>
						</View>
					</View>

					{/* 지불자 */}
					<View style={styles.card}>
						<Text style={styles.label}>지불자</Text>
						{members.length > 0 && selectedPaidBy && (
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
						)}

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
							<Text style={styles.remaining}>
								남은 금액: {remaining.toFixed(2)} 원
							</Text>
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

					{/* 등록 버튼 */}
					<Pressable style={styles.submitButton} onPress={handleEdit}>
						<Text style={styles.submitText}>수정하기</Text>
					</Pressable>

				</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default EditExpense;

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
