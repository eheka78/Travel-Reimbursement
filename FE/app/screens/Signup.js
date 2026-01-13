import React, { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
	Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../constant/colors";

export default function Signup() {
	const navigation = useNavigation();

	const [Id, setId] = useState("");
	const [pwd, setPwd] = useState("");
	const [confirmPwd, setConfirmPwd] = useState("");

	const handleSignup = async () => {
		if (!Id || !pwd || !confirmPwd) {
			return Alert.alert("입력 오류", "모든 항목을 입력해주세요");
		}

		if (pwd !== confirmPwd) {
			return Alert.alert("비밀번호 오류", "비밀번호가 일치하지 않습니다");
		}

		try {
			const res = await api.post("/signup", {
				Id,
				password: pwd,
			});

			Alert.alert("회원가입 성공", "로그인해주세요", [
				{
					text: "확인",
					onPress: () => navigation.replace("Login"),
				},
			]);
		} catch (err) {
			Alert.alert(
				"회원가입 실패",
				err.response?.data?.message || "회원가입 중 오류 발생"
			);
		}
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView edges={["bottom", "top"]} style={styles.container}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.container}
				>
					{/* 헤더 */}
					<View style={styles.header}>
						<Text style={styles.logo}>✈️ Travel Reimbursement</Text>
						<Text style={styles.subText}>회원가입</Text>
					</View>

					{/* 회원가입 카드 */}
					<View style={styles.card}>
						<Text style={styles.label}>아이디(닉네임)</Text>
						<TextInput
							placeholder="아이디를 입력하세요"
							value={Id}
							onChangeText={setId}
							style={styles.input}
							autoCapitalize="none"
						/>

						<Text style={styles.label}>비밀번호</Text>
						<TextInput
							placeholder="비밀번호를 입력하세요"
							value={pwd}
							onChangeText={setPwd}
							style={styles.input}
							secureTextEntry
						/>

						<Text style={styles.label}>비밀번호 확인</Text>
						<TextInput
							placeholder="비밀번호를 다시 입력하세요"
							value={confirmPwd}
							onChangeText={setConfirmPwd}
							style={styles.input}
							secureTextEntry
						/>

						<Pressable style={styles.signupBtn} onPress={handleSignup}>
							<Text style={styles.signupText}>회원가입</Text>
						</Pressable>
					</View>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 30,
		backgroundColor: "#F6F7FB",
	},
	header: {
		alignItems: "center",
		marginBottom: 40,
	},
	logo: {
		fontSize: 28,
		fontWeight: "bold",
		color: colors.point,
		marginBottom: 6,
	},
	subText: {
		fontSize: 14,
		color: "#666",
	},
	card: {
		backgroundColor: "white",
		marginHorizontal: 30,
		padding: 24,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	label: {
		fontSize: 14,
		marginBottom: 6,
		color: "#333",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: Platform.OS === "ios" ? 14 : 10,
		marginBottom: 16,
		fontSize: 15,
	},
	signupBtn: {
		marginTop: 10,
		backgroundColor: colors.point,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	signupText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
});