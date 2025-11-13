import React, { useState } from "react";
import { Button, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const TripSetting = ({ route, navigation }) => {
    console.log("tripSetting", route.params.trip);
    // tripSetting {"created_at": "2025-11-12T19:29:18.000Z", "end_date": "2025-11-14T15:00:00.000Z", "id": 3, "role": "owner", "start_date": "2025-11-13T15:00:00.000Z", "title": "Test1"}
    const { setIsLoggedIn, setUser } = useAuth(); 

    const [title, setTitle] = useState(route.params.trip.title);
    const [startDate, setStartDate] = useState(route.params.trip.start_date);
    const [endDate, setEndDate] = useState(route.params.trip.end_date);

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const onChangeStart = (event, selectedDate) => {
        setShowStartPicker(Platform.OS === "ios"); // iOS는 picker 유지
        if (selectedDate) setStartDate(selectedDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        setShowEndPicker(Platform.OS === "ios");
        if (selectedDate) setEndDate(selectedDate);
    };

    const formatDateTime = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const hh = String(date.getHours()).padStart(2, "0");
        const mi = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    };
  
    return (
        <SafeAreaView edges={["top", 'bottom']} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.loginContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={{ marginTop: 20 }}>
                    <Text>여행 등록</Text>
                    <TextInput
                        placeholder="여행 이름을 입력해 주세요"
                        style={{ borderWidth: 1, padding: 8, width: 200, marginVertical: 10 }}
                        onChangeText={setTitle}
                        value={title}
                    />

                    {/* 시작 날짜 선택 */}
                    <Button
                        title="시작 날짜 선택"
                        onPress={() => setShowStartPicker(true)}
                    />
                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={onChangeStart}
                        />
                    )}

                    {/* 종료 날짜 선택 */}
                    <Button
                        title="종료 날짜 선택"
                        onPress={() => setShowEndPicker(true)} 
                    />
                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={onChangeEnd}
                        />
                    )}

                    <Text style={{ marginTop: 10 }}>시작: {startDate.toDateString()}</Text>
                    <Text>종료: {endDate.toDateString()}</Text>

                    <Button
                        title="수정하기"
                       
                    />
                     {/*onPress={editTrip} */}  
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default TripSetting;

const styles = StyleSheet.create({
  loginContainer: { flex: 1, flexDirection: "column", paddingHorizontal: 50, alignItems: "center", justifyContent: "center" },
  loginInputView: { borderWidth: 1, borderColor: "#ddd", padding: 22, alignItems: "center" },
  textInput: { width: 272, height: 45, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12, marginVertical: 15 },
  loginBtn: { backgroundColor: "#215294", width: 272, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  loginText: { color: "white", fontSize: 16 },
});
