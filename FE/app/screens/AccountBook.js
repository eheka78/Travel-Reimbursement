import React, { useEffect, useState } from "react";
import { Button, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";

const AccountBook = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState([]);
    const [expensesDetail, seExpensesDetail] = useState([]);

    const fetchTripAccountStatistics = async () => {
        try {
            const res = await api.get(`/trips/${route.params.trip.trip_id}/dashboard`);
            console.log("대시보드:", res.data.members);
            setDashboard(res.data.members);
        } catch (err) {
            console.error("대시보드 가져오기 실패:", err.response?.data || err.message);
        } finally{
            fetchTripAccountDetail();
        }
    };

    const fetchTripAccountDetail = async () => {
        try {
            const res = await api.get(`/trips/${route.params.trip.trip_id}/expenses`);
            console.log("세부 지출 내역:", res.data.expenses);
            seExpensesDetail(res.data.expenses);
        } catch (err) {
            console.error("세부 지출 내역:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(!route.params) return; 
        
        fetchTripAccountStatistics();
    }, [route.params]);

    if (loading) return <Text>로딩 중...</Text>;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >   
                <Button
                    title="사용 내역 추가하기" 
                    onPress={() => navigation.navigate("AddExpense", { trip: route.params.trip, fetchTripAccountStatistics: fetchTripAccountStatistics })}
                />

                {dashboard.length === 0 ? (
                    <Text>참여 중인 여행이 없습니다.</Text>
                ) : (
                    <>
                        <View><Text>총 지출: ${dashboard.reduce((acc, member) => acc + Number(member.paid_total), 0)}</Text></View>
                        <View><Text>참여자 수: ${dashboard.length}</Text></View>
                        <View><Text>평균 지출: ${(dashboard.reduce((acc, member) => acc + Number(member.paid_total), 0)/3).toFixed(2)}</Text></View>
                        
                        <View>
                            {/* 헤더 */}
                            <View style={[styles.row, styles.header]}>
                                <Text style={[styles.cell, { flex: 2 }]}>이름</Text>
                                <Text style={styles.cell}>지불</Text>
                                <Text style={styles.cell}>부담</Text>
                                <Text style={styles.cell}>차액</Text>
                            </View>

                            {/* 데이터 */}
                            {dashboard.map((item) => (
                                <View key={item.user_id} style={styles.row}>
                                <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
                                <Text style={styles.cell}>${item.paid_total}</Text>
                                <Text style={styles.cell}>${item.share_total}</Text>
                                <Text style={styles.cell}>${item.balance}</Text>
                                </View>
                            ))}
                        </View>


                        <FlatList
                            data={expensesDetail}
                            keyExtractor={(item) => String(item.expense_id)}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => navigation.navigate("ExpenseDetail", { item: item, fetchTripAccountStatistics: fetchTripAccountStatistics })}
                                >
                                    <View style={styles.card}>
                                    <Text style={styles.title}>{item.expense_id}. {item.description}</Text>
                                    <Text>총 금액: ${item.amount} | 지불자: {item.paid_by_name}</Text>

                                    {/* 참여자별 부담액 */}
                                    <View style={styles.sharesHeader}>
                                        <Text style={{ flex: 1, fontWeight: "bold" }}>부담액: </Text>
                                    </View>
                                    {item.shares.map((s, idx) => (
                                        <View key={idx} style={styles.shareRow}>
                                        <Text style={{ flex: 1 }}>{s.user_name} | ${s.share}</Text>
                                        </View>
                                    ))}
                                    </View>
                                </Pressable>
                            )}
                            contentContainerStyle={{ padding: 10 }}
                        />

                    </>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AccountBook;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        flexDirection: "column", 
        paddingHorizontal: 20, 
        justifyContent: "center"  // alignItems 제거!
    },
    row: { 
        flexDirection: "row", 
        paddingVertical: 8, 
        borderBottomWidth: 1, 
        borderColor: "#ddd", 
        alignSelf: "stretch"   // 여기 추가
    },
    header: {
        backgroundColor: "#f0f0f0", 
        borderBottomWidth: 2 
    },
    cell: { 
        flex: 1, 
        textAlign: "center" 
    },
});

