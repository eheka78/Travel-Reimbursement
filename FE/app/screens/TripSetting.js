import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constant/colors";
import { FormatDateKST } from '../utils/FormatDateKST';


export default function TripSetting({ route, navigation }) {
    const trip = route.params.trip;

    const [title, setTitle] = useState(trip.title);
    const [description, setDescription] = useState(trip.description);
    const [startDate, setStartDate] = useState(new Date(trip.start_date));
    const [endDate, setEndDate] = useState(new Date(trip.end_date));


    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['bottom', 'top']} style={styles.container}>
                <ScrollView>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                    >
                        {/* 헤더 */}
                        <View style={styles.header}>
                            <Text style={styles.title}>여행 설정</Text>
                            <Text style={styles.subText}>여행 정보를 수정할 수 있어요</Text>
                        </View>

                        {/* 카드 */}
                        <View style={styles.card}>
                            {/* 여행 Id */}
                            <View style={styles.row}>
                                <Text style={styles.label}>여행 아이디</Text>
                                <Text style={styles.value}>{trip.trip_id}</Text>
                            </View>

                            {/* 여행 이름 */}
                            <View style={styles.row}>
                                <Text style={styles.label}>여행 이름</Text>
                                <Text style={styles.value}>{title}</Text>
                            </View>

                            {/* 여행 설명 */}
                            <View style={styles.row}>
                                <Text style={styles.label}>여행 설명</Text>
                                <Text style={styles.value}>{description || "-"}</Text>
                            </View>

                            {/* 여행 기간 */}
                            <View style={styles.row}>
                                <Text style={styles.label}>여행 기간</Text>
                                <Text style={styles.value}>📅 {FormatDateKST(startDate)} ~ {FormatDateKST(endDate)}</Text>
                            </View>
                        </View>

                        <View style={styles.buttonGroup}>
                            <Pressable
                                onPress={() => navigation.navigate("TripMember", { trip })}
                                style={[styles.editBtn, {
                                    backgroundColor: "white",
                                    borderWidth: 2,
                                    borderColor: colors.point
                                }]}
                            >
                                <Text style={[styles.buttonText, { color: colors.point }]}>멤버</Text>
                            </Pressable>
                        </View>

                        {/* 버튼 그룹 */}
                        {trip.role === "owner" &&
                            <View style={[styles.buttonGroup, { marginTop: 0 }]}>
                                <Pressable
                                    onPress={() => navigation.navigate("EditTripSetting", { trip })}
                                    style={styles.editBtn}
                                >
                                    <Text style={styles.buttonText}>수정하기</Text>
                                </Pressable>
                            </View>
                        }
                    </KeyboardAvoidingView>
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
    header: {
        padding: 24,
    },
    title: {
        fontSize: 22,
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
        marginHorizontal: 20,
        padding: 24,
        borderRadius: 16,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
    },
    row: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        color: "#888",
        marginBottom: 4,
        fontWeight: "500",
    },
    value: {
        fontSize: 15,
        color: "#333",
        fontWeight: "600",
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginVertical: 30,
    },
    editBtn: {
        flex: 1,
        backgroundColor: colors.point,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginRight: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
