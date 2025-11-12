import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Pressable } from "react-native";

export default function Home() {
    const navigation = useNavigation();

    return (
        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
            <Text>홈 화면</Text>
            
            <Pressable
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop:20, padding:10, backgroundColor:"#215294", borderRadius:5 }}
            >
                <Text style={{ color:"white" }}>로그인 화면으로 이동</Text>
            </Pressable>
        </View>
    );
}
