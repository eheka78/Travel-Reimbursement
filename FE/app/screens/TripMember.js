import React, { useEffect, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { formatDateTime2 } from "../utils/FormatDateTime2";
import { colors } from "../constant/colors";

export default function TripMember({ route }) {
    const [loading, setLoading] = useState(true);
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


    const trip = route.params.trip;



    useEffect(() => {
        fetchMember();
    }, [trip]);

    if (loading) return <Text style={styles.message}>로딩 중...</Text>;
    if (members.length === 0)
        return <Text style={styles.message}>참여 중인 여행이 없습니다.</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
                <FlatList
                    data={members}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.header}>
                                <Text style={styles.name}>{item.name}</Text>
                                <View style={styles.roleBadge}>
                                    <Text style={styles.roleText}>{item.role}</Text>
                                </View>
                            </View>

                            <Text style={styles.subText}>
                                가입일 · {formatDateTime2(item.joined_at)}
                            </Text>
                        </View>
                    )}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 14,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 17,
        fontWeight: "700",
    },
    roleBadge: {
        backgroundColor: colors.back,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    roleText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.point,
    },

    subText: {
        marginTop: 8,
        fontSize: 13,
        color: "#6b7280",
    },

    message: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 16,
        color: "#555",
    },
});


