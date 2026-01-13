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

	/** 🔹 앱 시작 시 자동 로그인 체크 */
	// 저장되어 있는 Id, Pwd 가져와서 로그인
	useEffect(() => {
		const checkSavedLogin = async () => {
			try {
				const travelReimbutsementUserId =
					await AsyncStorage.getItem("travelReimbutsementUserId");
				const travelReimbutsementUserPwd =
					await AsyncStorage.getItem("travelReimbutsementUserPwd");

				const res = await api.post("/login", {
					Id: travelReimbutsementUserId,
					password: travelReimbutsementUserPwd,
				});
				console.log(res.data.user);

				// 로그인 상태 저장
				setIsLoggedIn(true);
				setUser(res.data.user);

				navigation.replace("Home");

			} catch (err) {
				// 자동로그인 catch문
			} finally {
				setCheckingAutoLogin(false);
			}
		};

		checkSavedLogin();
	}, []);


	/** 🔹 로그인 */
	const handleLogin = async () => {
		try {
			const res = await api.post("/login", {
				Id,
				password: pwd,
			});
			console.log(res.data.user);

			// 로그인 상태 저장
			setIsLoggedIn(true);
			setUser(res.data.user);

			// 📌 아이디 저장
			await AsyncStorage.setItem("travelReimbutsementUserId", Id);
			await AsyncStorage.setItem("travelReimbutsementUserPwd", pwd);

			navigation.replace("Home");
		} catch (err) {
			alert(err.response?.data?.message || "로그인 실패");
		}
	};

	/** 자동 로그인 확인 중이면 로딩 */
	if (checkingAutoLogin) {
		return (
			<SafeAreaView edges={['bottom', 'top']} style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#215294" />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView edges={['bottom', 'top']} style={styles.container}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.container}
				>
					{/* 헤더 */}
					<View style={styles.header}>
						<Text style={styles.logo}>✈️ Travel Reimbursement</Text>
						<Text style={styles.subText}>여행을 더 쉽게 기록하세요</Text>
					</View>

					{/* 로그인 카드 */}
					<View style={styles.card}>
						<Text style={styles.label}>아이디</Text>
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
							secureTextEntry
							style={styles.input}
						/>

						<Pressable style={styles.loginBtn} onPress={handleLogin}>
							<Text style={styles.loginText}>로그인</Text>
						</Pressable>
					</View>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};



const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F6F7FB",
	},
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
	loginBtn: {
		marginTop: 10,
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
});
