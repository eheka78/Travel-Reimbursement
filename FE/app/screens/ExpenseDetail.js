import React from "react";
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { colors } from "../constant/colors";
import { FormatDateTimeKST } from './../utils/FormatDateTimeKST';

const ExpenseDetail = ({ route, navigation }) => {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(route.params);
    const expense = route.params.item;
    const tripId = route.params.tripId;
    const fetchTripAccountStatistics = route.params?.fetchTripAccountStatistics;

    const delExpense = async () => {
        try {
            await api.delete(`/trips/expenses/${expense.expense_id}`);

            fetchTripAccountStatistics?.();
            navigation.pop();
        } catch (err) {
            console.error("지출 내역 삭제 에러:", err.response?.data || err.message);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    {/* 카드 */}
                    <View style={styles.card}>
                        <InfoRow label="내용" value={expense.description} />
                        <InfoRow label="카테고리" value={expense.category} />
                        <InfoRow
                            label="날짜"
                            value={FormatDateTimeKST(expense.created_at)}
                        />
                        <InfoRow label="총 금액" value={`$${expense.amount}`} />
                        <InfoRow
                            label="지불자"
                            value={`${expense.paid_by_name}`}
                        />

                        <Text style={styles.sectionTitle}>참여자 부담액</Text>

                        {expense.shares.map((s, idx) => (
                            <View key={idx} style={styles.shareRow}>
                                <Text style={styles.shareName}>{s.user_name}</Text>
                                <Text style={styles.shareAmount}>${s.share}</Text>
                            </View>
                        ))}
                    </View>

                    {/* 버튼 영역 */}
                    <View style={styles.buttonArea}>
                        <Pressable
                            onPress={() => {
                                navigation.navigate("EditExpense", {
                                    expense,
                                    tripId,
                                    fetchTripAccountStatistics
                                });
                            }}
                            style={styles.editButton}
                        >
                            <Text style={styles.editText}>수정하기</Text>
                        </Pressable>

                        <Pressable
                            style={styles.deleteButton}
                            onPress={delExpense}
                        >
                            <Text style={styles.deleteText}>삭제하기</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ExpenseDetail;

/* 라벨 + 값 컴포넌트 */
const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    infoRow: {
        marginBottom: 14,
    },
    label: {
        fontSize: 13,
        color: "#777",
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111",
    },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: "700",
    },
    shareRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    shareName: {
        fontSize: 15,
    },
    shareAmount: {
        fontSize: 15,
        fontWeight: "600",
    },
    buttonArea: {
        marginTop: 20,
        gap: 10,
    },
    editButton: {
        backgroundColor: "#f1f3f5",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
    },
    editText: {
        fontSize: 16,
        fontWeight: "600",
    },
    deleteButton: {
        backgroundColor: colors.negative,
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
    },
    deleteText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
});

