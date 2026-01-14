import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { colors } from "../constant/colors";
import ReceiptImageViewer from "../component/ReceiptImageViewer";
import { FormatDateTimeKST2 } from './../utils/FormatDateTimeKST2';


export default function ExpenseDetail({ route, navigation }) {
    const expense = route.params.item;
    const tripId = route.params.tripId;
    const fetchTripAccountStatistics =
        route.params?.fetchTripAccountStatistics;

    const delExpense = async () => {
        try {
            await api.delete(`/trips/expenses/${expense.expense_id}`);
            fetchTripAccountStatistics?.();
            navigation.pop();
        } catch (err) {
            console.error(err);
        }
    };

    
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                >
                    {/* 🖼 영수증 */}
                    <View style={styles.imageCard}>
                        {expense.receipts?.length ? (
                            <ReceiptImageViewer receipts={expense.receipts} />
                        ) : (
                            <Text style={styles.emptyImage}>
                                첨부된 영수증이 없습니다
                            </Text>
                        )}
                    </View>

                    {/* 💳 지출 정보 */}
                    <View style={styles.card}>
                        <Text style={styles.amount}>
                            ${Number(expense.amount).toLocaleString()}
                        </Text>

                        <View style={styles.chip}>
                            <Text style={styles.chipText}>
                                {expense.category}
                            </Text>
                        </View>

                        <InfoRow
                            label="내용"
                            value={expense.description}
                        />
                        <InfoRow
                            label="지불자"
                            value={expense.paid_by_name}
                        />
                        <InfoRow
                            label="날짜"
                            value={FormatDateTimeKST2(expense.created_at)}
                        />

                        {expense.memo && (
                            <View style={styles.memoBox}>
                                <Text style={styles.memoLabel}>메모</Text>
                                <Text style={styles.memoText}>
                                    {expense.memo}
                                </Text>
                            </View>
                        )}

                        <Text style={styles.sectionTitle}>
                            참여자 부담액
                        </Text>

                        {expense.shares.map((s, idx) => (
                            <View key={idx} style={styles.shareRow}>
                                <Text style={styles.shareName}>
                                    {s.user_name}
                                </Text>
                                <Text style={styles.shareAmount}>
                                    ${s.share}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* 🔘 버튼 */}
                    <View style={styles.buttonArea}>
                        <Pressable
                            onPress={() =>
                                navigation.navigate("EditExpense", {
                                    expense,
                                    tripId,
                                    fetchTripAccountStatistics,
                                })
                            }
                            style={styles.editButton}
                        >
                            <Text style={styles.editText}>
                                수정하기
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={delExpense}
                            style={styles.deleteButton}
                        >
                            <Text style={styles.deleteText}>
                                삭제하기
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};


/* ---------- 공통 ---------- */
const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

/* ---------- 스타일 ---------- */
const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },

    imageCard: {
        borderRadius: 20,
        backgroundColor: "#fff",
        marginBottom: 20,
        overflow: "hidden",
        justifyContent: "center",
        elevation: 4,
        paddingVertical: 10,
    },

    emptyImage: {
        textAlign: "center",
        color: "#adb5bd",
        fontSize: 14,
    },

    card: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        elevation: 4,
    },

    amount: {
        fontSize: 26,
        fontWeight: "900",
        color: colors.point2,
        marginBottom: 12,
    },

    chip: {
        alignSelf: "flex-start",
        backgroundColor: "#EDF2FF",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        marginBottom: 16,
    },

    chipText: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.point,
    },

    infoRow: {
        marginBottom: 14,
    },

    label: {
        fontSize: 12,
        color: "#868e96",
        marginBottom: 4,
    },

    value: {
        fontSize: 15,
        fontWeight: "600",
        color: "#212529",
    },

    memoBox: {
        marginTop: 5,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: "#F1F3F5",
        borderRadius: 15,
    },

    memoLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#868e96",
        marginBottom: 6,
    },

    memoText: {
        fontSize: 14,
        color: "#343a40",
        lineHeight: 20,
    },

    sectionTitle: {
        marginTop: 26,
        marginBottom: 12,
        fontSize: 16,
        fontWeight: "800",
        color: "#343a40",
    },

    shareRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#f1f3f5",
    },

    shareName: {
        fontSize: 14,
        color: "#495057",
    },

    shareAmount: {
        fontSize: 14,
        fontWeight: "800",
        color: "#212529",
    },

    buttonArea: {
        marginTop: 24,
        gap: 12,
    },

    editButton: {
        backgroundColor: "#EDF2FF",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
    },

    editText: {
        fontSize: 16,
        fontWeight: "800",
        color: colors.point,
    },

    deleteButton: {
        backgroundColor: colors.negative,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
    },

    deleteText: {
        color: "white",
        fontSize: 16,
        fontWeight: "800",
    },
});
