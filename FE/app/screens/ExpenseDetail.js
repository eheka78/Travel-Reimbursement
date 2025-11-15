import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import api from "../../api";
import { formatDateTime3 } from "../utils/FormatDateTime3";
import { SafeAreaView } from "react-native-safe-area-context";

const ExpenseDetail = ({ route, navigation }) => {
    const expense = route.params.item; // 그냥 변수로 받음
    console.log("expense: " ,expense);


    const formattedDateTime = formatDateTime3(expense.created_at);

    const delExpense = async () => {
        console.log("delExpense: ", expense.trip_id, expense.expense_id);
        try {
            const res = await api.delete(`/trips/expenses/${expense.expense_id}`);
           
            console.log("지출 내역 삭제:", res.data);
            route.params.fetchTripAccountStatistics();
            navigation.pop();
        } catch (err) {
            console.error("지출 내역 삭제 에러:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View>
                <Text>아이디: {expense.expense_id}</Text>
                <Text>내용: {expense.description}</Text>
                <Text>카테고리: {expense.category}</Text>
                <Text>
                    시간 날짜: {formattedDateTime.date} {formattedDateTime.time}
                </Text>
                <Text>총액: {expense.amount}</Text>
                <Text>지불: {expense.paid_by} {expense.paid_by_name}</Text>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>참여자 부담액</Text>
                    {expense.shares.map((s, idx) => (
                        <View key={idx} style={styles.shareRow}>
                            <Text>{s.user_name} | ${s.share}</Text>
                        </View>
                    ))}
                </View>
                </View>

                <Button 
                    title="삭제하기"
                    onPress={delExpense}
                />
                <Button 
                    title="수정하기"
                    onPress={() => {}}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ExpenseDetail;


const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        flexDirection: "column", 
        paddingHorizontal: 20, 
        justifyContent: "flex-start"  
    },
    shareRow: { 
        flexDirection: "row", 
        paddingVertical: 4, 
        borderBottomWidth: 1, 
        borderColor: "#ddd" 
    },
});
