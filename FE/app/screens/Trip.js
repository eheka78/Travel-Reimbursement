import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Pressable,
	ScrollView,
	StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constant/colors";
import { FormatDateKST } from "../utils/FormatDateKST";
import api from "../../api";

export default function Trip({ route, navigation }) {
	const { trip } = route.params;

	const [members, setMembers] = useState([]);

	const fetchMember = async () => {
		if (!trip?.trip_id) return;

		try {
			const res = await api.get(`/trips/${trip.trip_id}/members`);
			setMembers(res.data.members || []);
		} catch (err) {
			console.error("여행 멤버 목록 가져오기 실패:", err.response?.data || err.message);
			setMembers([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMember();
	}, [trip]);


	return (
		<SafeAreaProvider>
			<SafeAreaView edges={['top', 'bottom']} style={styles.container}>
				<ScrollView contentContainerStyle={styles.scroll}>
					{/* 기능 버튼 */}
					<View style={styles.menuContainer}>
						<Pressable
							style={styles.menuCard}
							onPress={() => navigation.navigate("AccountBook", { trip })}
						>
							<Text style={styles.menuIcon}>💰</Text>
							<Text style={styles.menuText}>가계부</Text>
						</Pressable>

						<Pressable
							style={styles.menuCard}
							onPress={() => navigation.navigate("ImageCollection", { trip })}
						>
							<Text style={styles.menuIcon}>📷</Text>
							<Text style={styles.menuText}>사진</Text>
						</Pressable>

						<Pressable
							style={styles.menuCard}
							onPress={() => navigation.navigate("TripSetting", { trip })}
						>
							<Text style={styles.menuIcon}>⚙️</Text>
							<Text style={styles.menuText}>설정</Text>
						</Pressable>
					</View>


					{/* 여행 정보 카드 */}
					<View style={styles.infoCard}>
						<Text style={styles.title}>{trip.title}</Text>

						<View style={styles.row}>
							<Text style={styles.label}>📅 기간</Text>
							<Text style={styles.value}>
								{FormatDateKST(trip.start_date)} ~ {FormatDateKST(trip.end_date)}
							</Text>
						</View>

						<View style={styles.row}>
							<Text style={styles.label}>👤 내 역할</Text>
							<Text style={styles.value}>{trip.role}</Text>
						</View>

						<View style={[styles.row]}>
							<Text style={styles.label}>👥 멤버</Text>
							<View style={{ flexDirection: "row", flexWrap: "wrap", }}>
								{members.map((member, index) => (
									<View
										key={index}
										style={{ borderRadius: 20, marginLeft: 6, }}
									>
										<Text style={styles.value}>{member.name}</Text>
									</View>
								))}
							</View>
						</View>


						{trip.description && (
							<ScrollView>
								<View style={styles.descBox}>
									<Text style={styles.descText}>{trip.description}</Text>
								</View>
							</ScrollView>
						)}
					</View>
				</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F6F7FB",
	},
	scroll: {
		padding: 20,
	},
	infoCard: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 18,
		marginBottom: 24,
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 3,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 12,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 6,
	},
	label: {
		fontSize: 14,
		color: "#555",
	},
	value: {
		fontSize: 14,
		fontWeight: "500",
	},
	descBox: {
		marginTop: 12,
		paddingVertical: 18,
		paddingHorizontal: 15,
		backgroundColor: colors.back2,
		borderRadius: 10,
	},
	descText: {
		fontSize: 13,
		color: "#444",
		lineHeight: 18,
	},
	menuContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	menuCard: {
		flex: 1,
		backgroundColor: "white",
		borderRadius: 14,
		paddingVertical: 20,
		marginHorizontal: 5,
		marginBottom: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 2,
	},
	menuIcon: {
		fontSize: 24,
		marginBottom: 6,
	},
	menuText: {
		fontSize: 14,
		fontWeight: "600",
	},

	// 멤버
});

