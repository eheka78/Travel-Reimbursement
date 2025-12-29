import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    Platform,
    FlatList,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { formatDateTime } from "../utils/FormatDateTime";
import { colors } from "../constant/colors";

export default function AddTrip({ navigation }) {
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [enterTrip, setEnterTrip] = useState("");

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const onChangeStart = (_, selectedDate) => {
        setShowStartPicker(false);
        if (selectedDate) setStartDate(selectedDate);
    };

    const onChangeEnd = (_, selectedDate) => {
        setShowEndPicker(false);
        if (selectedDate) setEndDate(selectedDate);
    };

    const registerTrip = async () => {
        try {
            await api.post("/trips", {
                title,
                start_date: formatDateTime(startDate),
                end_date: formatDateTime(endDate),
                user_id: user.id,
            });
            navigation.goBack();
        } catch (err) {
            console.error(err);
        }
    };

    const joinTrip = async () => {
        try {
            await api.post("/trips/join", {
                trip_name: enterTrip,
                user_id: user.id,
            });
            navigation.goBack();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['bottom', 'top']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <Text style={styles.pageTitle}>여행 관리 ✈️</Text>

                    {/* 여행 생성 */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>여행 생성</Text>

                        <TextInput
                            placeholder="여행 이름"
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Pressable style={styles.dateBtn} onPress={() => setShowStartPicker(true)}>
                            <Text>시작 날짜: {startDate.toLocaleDateString()}</Text>
                        </Pressable>

                        <Pressable style={styles.dateBtn} onPress={() => setShowEndPicker(true)}>
                            <Text>종료 날짜: {endDate.toLocaleDateString()}</Text>
                        </Pressable>

                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={onChangeStart}
                            />
                        )}

                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={onChangeEnd}
                            />
                        )}

                        <Pressable style={styles.primaryBtn} onPress={registerTrip}>
                            <Text style={styles.btnText}>여행 생성</Text>
                        </Pressable>
                    </View>

                    {/* 여행 참여 */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>여행 참여</Text>

                        <TextInput
                            placeholder="여행 이름 입력"
                            style={styles.input}
                            value={enterTrip}
                            onChangeText={setEnterTrip}
                        />

                        <Pressable style={styles.secondaryBtn} onPress={joinTrip}>
                            <Text style={styles.btnText}>참여하기</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F7FB",
    },
    scroll: {
        padding: 20,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 14,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    dateBtn: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 10,
    },
    primaryBtn: {
        marginTop: 10,
        backgroundColor: colors.point,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    secondaryBtn: {
        marginTop: 10,
        backgroundColor: colors.point2,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    },
});
