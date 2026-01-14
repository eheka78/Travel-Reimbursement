import React, { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
	ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../constant/colors";

export default function Login() {
	const navigation = useNavigation();
	const { setIsLoggedIn, setUser } = useAuth();

	const [Id, setId] = useState("");
	const [pwd, setPwd] = useState("");
	const [checkingAutoLogin, setCheckingAutoLogin] = useState(true);

	/* 🔹 자동 로그인 */
	useEffect(() => {
		const checkSavedLogin = async () => {
			try {
				const savedId = await AsyncStorage.getItem(
					"travelReimbutsementUserId"
				);
				const savedPwd = await AsyncStorage.getItem(
					"travelReimbutsementUserPwd"
				);

				console.log("saved:", savedId, savedPwd);

				// 저장된 로그인 정보 없으면 그냥 통과
				if (!savedId || !savedPwd) {
					console.log("$$$$$$$1");
					setCheckingAutoLogin(false);
					return;
				}

				console.log("$$$$$$$2");

				const res = await api.post("/login", {
					Id: savedId,
					password: savedPwd,
				});

				console.log("$$$$$$$3");
				console.log(res.data);

				setIsLoggedIn(true);
				setUser(res.data.user);
				navigation.replace("Home");
			} catch (err) {
				console.log("자동 로그인 실패:", err.response?.data || err.message);
			} finally {
				// ⭐⭐⭐ 무조건 실행되게
				console.log("####################");
				setCheckingAutoLogin(false);
			}
		};

		checkSavedLogin();
	}, []);

	/* 🔹 로그아웃 */
	const logout = async () => {
		try {
			await AsyncStorage.removeItem("travelReimbutsementUserId");
			await AsyncStorage.removeItem("travelReimbutsementUserPwd");
		} catch (e) {
			console.error("로그아웃 실패:", e);
		}
	};


	/* 🔹 수동 로그인 */
	const handleLogin = async () => {
		try {
			const res = await api.post("/login", {
				Id,
				password: pwd,
			});

			setIsLoggedIn(true);
			setUser(res.data.user);

			await AsyncStorage.setItem("travelReimbutsementUserId", Id);
			await AsyncStorage.setItem("travelReimbutsementUserPwd", pwd);

			navigation.replace("Home");
		} catch (err) {
			console.log("로그인 실패:", err.response?.data || err.message);
			alert(err.response?.data?.message || "로그인 실패");
		}
	};

	/* 🔹 자동 로그인 체크 중 */
	if (checkingAutoLogin) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={colors.point} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.container}
				>
					<View style={styles.header}>
						<Text style={styles.logo}>✈️ Travel Reimbursement</Text>
						<Text style={styles.subText}>여행을 더 쉽게 기록하세요</Text>
					</View>

					<View style={styles.card}>
						<Text style={styles.label}>아이디</Text>
						<TextInput
							value={Id}
							onChangeText={setId}
							style={styles.input}
							autoCapitalize="none"
						/>

						<Text style={styles.label}>비밀번호</Text>
						<TextInput
							value={pwd}
							onChangeText={setPwd}
							style={styles.input}
						/>

						<Pressable style={styles.loginBtn} onPress={handleLogin}>
							<Text style={styles.loginText}>로그인</Text>
						</Pressable>

						<Pressable
							style={styles.moveBtn}
							onPress={() => navigation.replace("Signup")}
						>
							<Text style={styles.moveText}>회원가입 화면으로</Text>
						</Pressable>
					</View>

					<Pressable style={styles.logoutBtn} onPress={logout}>
						<Text style={styles.logoutText}>로그아웃</Text>
					</Pressable>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F6F7FB",
	},
	container: {
		flex: 1,
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
		elevation: 4,
	},
	label: {
		fontSize: 14,
		marginBottom: 6,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		padding: 12,
		marginBottom: 16,
	},
	loginBtn: {
		backgroundColor: colors.point,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	loginText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	moveBtn: {
		marginTop: 10,
		alignItems: "center",
	},
	moveText: {
		textDecorationLine: "underline",
	},
});