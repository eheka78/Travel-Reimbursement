import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../api";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
    const navigation = useNavigation();
    const [studentId, setStudentId] = useState("");
    const [pwd, setPwd] = useState("");

    const handleLogin = async () => {
    try {
        // 테스트용 GET
        const res = await api.get("/");
        console.log("서버 응답:", res.data);
    } catch (err) {
        console.error("오류:", err);
    }

    try {
        // 실제 로그인 POST
        const res = await api.post("/login", { studentId, password: pwd });

        console.log("로그인 성공!", res.data.user);
        navigation.navigate("Home");
    } catch (err) {
        console.error("로그인 중 오류:", err.response?.data || err.message);
        alert(err.response?.data?.message || "로그인 실패");
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
            style={styles.loginContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.loginInputView}>
            <Text>학번</Text>
            <TextInput
                placeholder="학번 8자리"
                value={studentId}
                onChangeText={setStudentId}
                style={styles.textInput}
            />
            <Text>비밀번호</Text>
            <TextInput
                placeholder="비밀번호를 입력해주세요."
                value={pwd}
                onChangeText={setPwd}
                secureTextEntry
                style={styles.textInput}
            />
            <Pressable
                style={styles.loginBtn}
                onPress={handleLogin}
            >
                <Text style={styles.loginText}>Log In</Text>
            </Pressable>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loginInputView: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 22,
    alignItems: "center",
  },
  textInput: {
    width: 272,
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 15,
  },
  loginBtn: {
    backgroundColor: "#215294",
    width: 272,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontSize: 16,
  },
});
