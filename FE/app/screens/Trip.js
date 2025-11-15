import React, { useState } from "react";
import { Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { formatDateTime2 } from './../utils/FormatDateTime2';

const Trip = ({ route, navigation }) => {
    const { setIsLoggedIn, setUser } = useAuth(); 
    const trip = useState(route.params.trip);
    
  
    return (
        <SafeAreaView edges={["top", 'bottom']} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.Container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={{ width: "100%", alignItems: "center" }}>
                    <View style={{ marginVertical: 5, padding: 10, borderWidth: 1, borderRadius: 5 }}>
                        <Text style={{ fontWeight: "bold" }}>{trip[0].title}</Text>
                        <Text>시작: {formatDateTime2(trip[0].start_date)}</Text>
                        <Text>종료: {formatDateTime2(trip[0].end_date)}</Text>
                        <Text>내 역할: {trip[0].role}</Text>
                        <Text>설명: {trip[0].description}</Text>
                    </View>
                    
                    <Button
                        title="멤버"
                        onPress={() => navigation.navigate("TripMember", { trip: route.params.trip })}
                    />
                    <Button
                        title="가계부"
                        onPress={() => navigation.navigate("AccountBook", { trip: route.params.trip })}
                    />
                    <Button
                        title="설정하기"
                        onPress={() => navigation.navigate("TripSetting", { trip: route.params.trip })}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Trip;

const styles = StyleSheet.create({
  Container: { flex: 1, flexDirection: "column", paddingHorizontal: 20, alignItems: "center", justifyContent: "center" },
});
