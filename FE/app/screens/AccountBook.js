import React, { useEffect, useState, useMemo, useRef } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { shortenName } from "../utils/shortenName";
import { colors } from "../constant/colors";

const AccountBook = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState([]);
    const [expensesDetail, setExpensesDetail] = useState([]);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const listRef = useRef(null);
    const tripId = route.params.trip.trip_id;

    const fetchTripAccountStatistics = async () => {
        try {
            const res = await api.get(`/trips/${tripId}/dashboard`);
            setDashboard(res.data.members);
        } catch (err) {
            console.error(err);
        } finally {
            fetchTripAccountDetail();
        }
    };

    const fetchTripAccountDetail = async () => {
        try {
            const res = await api.get(`/trips/${tripId}/expenses`);
            setExpensesDetail(res.data.expenses);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("ExpensesDetail: ", expensesDetail);
    }, [expensesDetail]);

    useEffect(() => {
        fetchTripAccountStatistics();
    }, []);

    const totalExpense = useMemo(
        () => dashboard.reduce((acc, m) => acc + Number(m.paid_total), 0),
        [dashboard]
    );

    const avgExpense =
        dashboard.length > 0 ? (totalExpense / dashboard.length).toFixed(2) : 0;

    if (loading) {
        return <Text style={{ textAlign: "center", marginTop: 40 }}>로딩 중...</Text>;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
                <FlatList
                    ref={listRef}
                    onScroll={(e) => {
                        setShowScrollTop(e.nativeEvent.contentOffset.y > 120);
                    }}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingBottom: 140 }}
                    ListHeaderComponent={
                        <>
                            {/* 사용 내역 추가 */}
                            <Pressable
                                style={({ pressed }) => [
                                    styles.addButton,
                                    pressed && { opacity: 0.85 },
                                ]}
                                onPress={() =>
                                    navigation.navigate("AddExpense", {
                                        trip: route.params.trip,
                                        fetchTripAccountStatistics,
                                    })
                                }
                            >
                                <Text style={styles.addButtonText}>
                                    + 사용 내역 추가하기
                                </Text>
                            </Pressable>

                            {/* 요약 */}
                            <View style={styles.summaryCard}>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>총 지출</Text>
                                    <Text style={styles.summaryValue}>
                                        ${totalExpense}
                                    </Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>평균 지출</Text>
                                    <Text style={styles.summaryValue}>
                                        ${avgExpense}
                                    </Text>
                                </View>
                            </View>

                            {/* 정산 테이블 */}
                            <View style={styles.tableWrapper}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.cell, styles.nameCell]}>이름</Text>
                                    <Text style={styles.cellRight}>지불</Text>
                                    <Text style={styles.cellRight}>부담</Text>
                                    <Text style={styles.cellRight}>차액</Text>
                                </View>

                                {dashboard.map((item) => (
                                    <View key={item.user_id} style={styles.tableRow}>
                                        <Text style={[styles.cell, styles.nameCell]}>
                                            {item.name}
                                        </Text>
                                        <Text style={styles.cellRight}>
                                            ${item.paid_total}
                                        </Text>
                                        <Text style={styles.cellRight}>
                                            ${item.share_total}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.cellRight,
                                                item.balance >= 0
                                                    ? styles.balancePositive
                                                    : styles.balanceNegative,
                                            ]}
                                        >
                                            ${item.balance}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <Text style={styles.sectionTitle}>지출 내역</Text>
                        </>
                    }
                    data={expensesDetail}
                    keyExtractor={(item) => String(item.expense_id)}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate("ExpenseDetail", {
                                    item,
                                    tripId,
                                    fetchTripAccountStatistics,
                                })
                            }
                        >
                            <View style={styles.cardHeader}>
                                <Text
                                    style={styles.cardTitle}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.description}
                                </Text>
                                <Text style={styles.cardAmount}>
                                    ${item.amount}
                                </Text>
                            </View>

                            <Text style={styles.cardMeta}>
                                지불자 · {item.paid_by_name}
                            </Text>

                            <View style={styles.shareBox}>
                                {item.shares.map((s, idx) => (
                                    <View key={idx} style={styles.shareChip}>
                                        <Text style={styles.shareChipText}>
                                            {shortenName(s.user_name)} ${s.share}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </Pressable>
                    )}
                />

                <Pressable
                    style={[styles.fab]}
                    onPress={() => fetchTripAccountStatistics()}
                >
                    <Text style={styles.fabText}>⟳</Text>
                </Pressable>
                {showScrollTop && (
                    <Pressable
                        style={[styles.fab, { bottom: 120, }]}
                        onPress={() =>
                            listRef.current?.scrollToOffset({
                                offset: 0,
                                animated: true,
                            })
                        }
                    >
                        <Text style={styles.fabText}>↑</Text>
                    </Pressable>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default AccountBook;



const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#F6F7FB",
    },

    addButton: {
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 24,
        height: 52,
        borderRadius: 16,
        backgroundColor: colors.point2,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },

    summaryCard: {
        marginHorizontal: 20,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "white",
        marginBottom: 24,
        gap: 10,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    summaryLabel: {
        fontSize: 14,
        color: "#555",
    },
    summaryValue: {
        fontSize: 17,
        fontWeight: "800",
        color: colors.point2,
    },

    tableWrapper: {
        marginHorizontal: 20,
        borderRadius: 16,
        backgroundColor: "white",
        overflow: "hidden",
        marginBottom: 28,
    },
    tableHeader: {
        flexDirection: "row",
        paddingVertical: 12,
        backgroundColor: colors.back2,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },

    cell: {
        flex: 1,
        fontSize: 13,
    },
    cellRight: {
        flex: 1,
        textAlign: "right",
        paddingRight: 12,
        fontSize: 13,
    },
    nameCell: {
        flex: 1.4,
        paddingLeft: 12,
        fontWeight: "600",
    },

    balancePositive: {
        color: colors.positive,
        fontWeight: "700",
    },
    balanceNegative: {
        color: colors.negative,
        fontWeight: "700",
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginHorizontal: 20,
        marginBottom: 12,
    },

    card: {
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 16,
        borderRadius: 14,
        backgroundColor: "white",
        elevation: 3,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    cardTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: "700",
        marginRight: 8,
    },
    cardAmount: {
        fontSize: 16,
        fontWeight: "800",
        color: colors.point2,
    },
    cardMeta: {
        fontSize: 12,
        color: "#666",
        marginBottom: 8,
    },

    shareBox: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    shareChip: {
        backgroundColor: colors.back,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    shareChipText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.point,
    },

    fab: {
        position: "absolute",
        right: 20,
        bottom: 60,
        width: 45,
        height: 45,
        borderRadius: 28,
        backgroundColor: colors.point,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },
    fabText: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 2,
    },
});
