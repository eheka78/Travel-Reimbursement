import React, { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, Button, Platform, FlatList, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import api from "../../api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../constant/colors";
import { FormatDateKST } from "../utils/FormatDateKST";

export default function Home({ navigation }) {
    const [loading, setLoading] = useState(true);

    const { isLoggedIn, user } = useAuth();

    const [trips, setTrips] = useState([]);

    const fetchMyTrips = async () => {
        try {
            const res = await api.get(`/my-trips/${user.id}`);
            console.log("내 여행 목록:", res.data.trips);
            setTrips(res.data.trips);
        } catch (err) {
            console.error("여행 목록 가져오기 실패:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        console.log(user.id);
        fetchMyTrips();
    }, [user]);

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("travelReimbutsementUserId");
            await AsyncStorage.removeItem("travelReimbutsementUserPwd");

            navigation.navigate("Login");
        } catch (e) {
            console.error("로그아웃 실패:", e);
        }
    };


    if (loading) return <Text>로딩 중...</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['bottom', 'top']} style={styles.container}>
                {/* 헤더 */}
                <View style={styles.header}>
                    <Text style={styles.welcome}>
                        {isLoggedIn ? `환영합니다, ${user.name} 👋` : "로그인이 필요합니다"}
                    </Text>

                    <Pressable
                        onPress={logout}
                        style={({ pressed }) => [
                            styles.logoutBtn,
                            pressed && { opacity: 0.6 },
                        ]}
                    >
                        <Text style={styles.logoutText}>로그아웃</Text>
                    </Pressable>
                </View>


                {/* 여행 리스트 */}
                <View style={styles.listContainer}>
                    <Text style={styles.sectionTitle}>내 여행 목록</Text>

                    {trips.length === 0 ? (
                        <Text style={styles.emptyText}>참여 중인 여행이 없습니다.</Text>
                    ) : (
                        <FlatList
                            data={trips}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => navigation.navigate("Trip", { trip: item })}
                                    style={({ pressed }) => [
                                        styles.card,
                                        pressed && { opacity: 0.8 },
                                    ]}
                                >
                                    <Text style={styles.cardTitle}>{item.title}</Text>

                                    <View style={styles.dateRow}>
                                        <Text style={styles.dateText}>
                                            📅 {FormatDateKST(item.start_date)} ~ {FormatDateKST(item.end_date)}
                                        </Text>
                                    </View>

                                    <Text style={styles.roleText}>내 역할: {item.role}</Text>
                                </Pressable>
                            )}
                        />
                    )}
                </View>

                {/* 플로팅 + 버튼 */}
                <Pressable
                    style={styles.fab}
                    onPress={() => navigation.navigate("AddTrip")}
                >
                    <Text style={styles.fabText}>＋</Text>
                </Pressable>
                <Pressable
                    style={[styles.fab, { bottom: 120, }]}
                    onPress={() => fetchMyTrips()}
                >
                    <Text style={styles.fabText}>⟳</Text>
                </Pressable>
            </SafeAreaView>
        </SafeAreaProvider>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F7FB",
    },
    header: {
        padding: 20,
        paddingVertical: 40,
    },
    welcome: {
        fontSize: 18,
        fontWeight: "600",
    },
    logoutBtn: {
        position: "absolute",
        right: 20,
        top: 40,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "#EEF1F6",
    },
    logoutText: {
        fontSize: 13,
        color: "#555",
        fontWeight: "500",
    },
    listContainer: {
        flex: 1,
    },
    sectionTitle: {        
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        marginHorizontal: 20,
    },
    emptyText: {
        textAlign: "center",
        color: "#999",
        marginTop: 40,
    },
    card: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        marginHorizontal: 20,
        elevation: 2, // android shadow
        shadowColor: "#000", // ios shadow
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 6,
    },
    dateRow: {
        marginBottom: 4,
    },
    dateText: {
        color: "#555",
        fontSize: 13,
    },
    roleText: {
        marginTop: 6,
        fontSize: 13,
        color: colors.point,
        fontWeight: "500",
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 60,
        width: 45,
        height: 45,
        borderRadius: 28,
        backgroundColor: colors.point,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },
    fabText: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 2,
    },
});
