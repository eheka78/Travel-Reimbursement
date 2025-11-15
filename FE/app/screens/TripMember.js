import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { formatDateTime2 } from './../utils/FormatDateTime2';

const TripMember = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);

    const trip = route.params.trip;
    console.log("TripMember", trip);

    const fetchMember = async () => {
        if (!trip || !trip.trip_id) return;

        try {
            const res = await api.get(`/trips/${trip.trip_id}/members`);
            // 백엔드에서 members 배열로 반환한다고 가정
            console.log("여행 멤버 목록:", res.data.members);
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

    if (loading) return <Text style={styles.message}>로딩 중...</Text>;
    if (!members || members.length === 0) return <Text style={styles.message}>참여 중인 여행이 없습니다.</Text>;

    return (
        <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <FlatList
                    data={members}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.memberCard}>
                            <Text style={styles.memberName}>{item.id} {item.name}</Text>
                            <Text>역할: {item.role}</Text>
                            <Text>가입일: {formatDateTime2(item.joined_at)}</Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default TripMember;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    memberCard: {
        marginVertical: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        width: "100%",
    },
    memberName: {
        fontWeight: "bold",
        marginBottom: 4,
    },
    message: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 16,
    },
});
