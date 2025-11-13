import React, { useState } from "react";
import { Button, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { formatDateTime2 } from './../utils/FormatDateTime2';

const Trip = ({ route, navigation }) => {
    console.log(route.params.trip);
    // {"created_at": "2025-11-12T19:15:46.000Z", "end_date": "2025-11-20T15:00:00.000Z", "id": 1, "role": "member", "start_date": "2025-11-13T15:00:00.000Z", "title": "미국"}

    const { setIsLoggedIn, setUser } = useAuth(); 
    const trip = useState(route.params.trip);
    console.log(trip);
    // [{"created_at": "2025-11-12T19:15:46.000Z", "end_date": "2025-11-20T15:00:00.000Z", "id": 1, "role": "member", "start_date": "2025-11-13T15:00:00.000Z", "title": "미국"}, [Function bound dispatchSetState]]

  
    return (
        <SafeAreaView edges={["top", 'bottom']} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.loginContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={{ marginVertical: 5, padding: 10, borderWidth: 1, borderRadius: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>{trip[0].title}</Text>
                    <Text>시작: {formatDateTime2(trip[0].start_date)}</Text>
                    <Text>종료: {formatDateTime2(trip[0].end_date)}</Text>
                    <Text>내 역할: {trip[0].role}</Text>
                </View>
                <Button
                    title="설정하기"
                    onPress={() => navigation.navigate("TripSetting", { trip: route.params.trip })}
                ></Button>
                <Button
                    title="멤버"
                    onPress={() => navigation.navigate("TripMember", { trip: route.params.trip })}
                ></Button>
                
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Trip;

const styles = StyleSheet.create({
  loginContainer: { flex: 1, flexDirection: "column", paddingHorizontal: 50, alignItems: "center", justifyContent: "center" },
  loginInputView: { borderWidth: 1, borderColor: "#ddd", padding: 22, alignItems: "center" },
  textInput: { width: 272, height: 45, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12, marginVertical: 15 },
  loginBtn: { backgroundColor: "#215294", width: 272, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  loginText: { color: "white", fontSize: 16 },
});
