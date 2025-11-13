import React, { useEffect, useState } from "react";
import { Button, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { formatDateTime2 } from './../utils/FormatDateTime2';

const TripMember = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true);
    console.log("TripMember", route.params.trip);
    // tripSetting {"created_at": "2025-11-12T19:29:18.000Z", "end_date": "2025-11-14T15:00:00.000Z", "id": 3, "role": "owner", "start_date": "2025-11-13T15:00:00.000Z", "title": "Test1"}
    const [members, setMembers] = useState([]);

    const fetchMember = async () => {
        try {
            const res = await api.get(`/trips/${route.params.trip.id}/members`);
            
            console.log("여행 멤버 목록:", res.data.trips);

            setMembers(res.data.trips);
        } catch (err) {
            console.error("여행 멤버 목록 가져오기 실패:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(!route.params.trip) return; 

        fetchMember();
    }, [route.params.trip]);

    
    if (loading) return <Text>로딩 중...</Text>;

    return (
        <SafeAreaView edges={["top", 'bottom']} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.loginContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {loading ? (
                    <Text>로딩 중...</Text>
                ) : members.length === 0 ? (
                    <Text>참여 중인 여행이 없습니다.</Text>
                ) : (
                    <FlatList
                        data={members}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={{ marginVertical: 5, padding: 10, borderWidth: 1, borderRadius: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>{item.id} {item.name}</Text>
                                <Text>역할: {item.role}</Text>
                                <Text>{formatDateTime2(item.joined_at)}</Text>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default TripMember;

const styles = StyleSheet.create({
  loginContainer: { flex: 1, flexDirection: "column", paddingHorizontal: 50, alignItems: "center", justifyContent: "center" },
  loginInputView: { borderWidth: 1, borderColor: "#ddd", padding: 22, alignItems: "center" },
  textInput: { width: 272, height: 45, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12, marginVertical: 15 },
  loginBtn: { backgroundColor: "#215294", width: 272, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  loginText: { color: "white", fontSize: 16 },
});
