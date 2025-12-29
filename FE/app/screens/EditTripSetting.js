import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../constant/colors";
import api from "../../api";
import { FormatDateKST } from '../utils/FormatDateKST';
import TripDeleteButton from "../component/TripDeleteButton";
import { useAuth } from "../context/AuthContext";

const EditTripSetting = ({ route, navigation }) => {
    const trip = route.params.trip;
    const { user } = useAuth();

    const [title, setTitle] = useState(trip.title);
    const [description, setDescription] = useState(trip.description);
    const [startDate, setStartDate] = useState(new Date(trip.start_date));
    const [endDate, setEndDate] = useState(new Date(trip.end_date));

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const editTrip = async () => {
        console.log(trip.trip_id, title, FormatDateKST(startDate), FormatDateKST(endDate));
        try {
            const res = await api.put(`/trips/${trip.trip_id}`, {
                title,
                start_date: FormatDateKST(startDate),
                end_date: FormatDateKST(endDate),
                description,
            });
            console.log(res.data);

            alert("여행 정보가 수정되었습니다.");
            navigation.navigate("Home");
        } catch (err) {
            alert(err.response?.data?.message || "수정 실패");
        }
    };


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
                            {/* 여행 이름 */}
                            <Text style={styles.label}>여행 이름</Text>
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="여행 이름을 입력하세요"
                            />

                            <Text style={styles.label}>여행 설명</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="여행 설명을 입력하세요"
                                multiline
                                numberOfLines={8}
                                textAlignVertical="top"
                            />

                            {/* 날짜 선택 */}
                            <Text style={styles.label}>여행 기간</Text>

                            <Pressable
                                style={styles.dateBtn}
                                onPress={() => setShowStartPicker(true)}
                            >
                                <Text style={styles.dateText}>
                                    📅 시작일: {FormatDateKST(startDate)}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={styles.dateBtn}
                                onPress={() => setShowEndPicker(true)}
                            >
                                <Text style={styles.dateText}>
                                    📅 종료일: {FormatDateKST(endDate)}
                                </Text>
                            </Pressable>

                            {showStartPicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display="default"
                                    onChange={(e, d) => {
                                        setShowStartPicker(false);
                                        if (d) setStartDate(d); // d는 Date 객체
                                    }}
                                />
                            )}

                            {showEndPicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    onChange={(e, d) => {
                                        setShowEndPicker(false);
                                        if (d) setEndDate(d);
                                    }}
                                />
                            )}

                            {trip.role === "owner" &&
                                <>
                                    {/* 수정 버튼 */}
                                    < Pressable
                                        onPress={() => {
                                            editTrip();
                                        }}
                                        style={styles.saveBtn}
                                    >
                                        <Text style={styles.saveText}>수정하기</Text>
                                    </Pressable>

                                    {/* 여행 삭제 버튼 */}
                                    <TripDeleteButton trip={trip} navigation={navigation} />
                                </>
                            }
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider >
    );
};

export default EditTripSetting;


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
        marginBottom: 40,
        padding: 20,
        borderRadius: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        marginTop: 14,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "ios" ? 14 : 10,
        fontSize: 15,
    },
    textArea: {
        height: 200,
        paddingTop: 12,
    },
    dateBtn: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 14,
        marginTop: 8,
    },
    dateText: {
        fontSize: 14,
        color: "#333",
    },

    saveBtn: {
        marginTop: 24,
        backgroundColor: colors.point,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    saveText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

