import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { FlatList, Pressable, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import api from "../../api";
import SettlementTable from '../component/AccountBook/SettlementTable';
import SummaryCard from "../component/AccountBook/SummaryCard";
import DateFilter from '../component/AccountBook/DateFilter';
import { styles } from "../component/AccountBook/styles";
import ExpenseCard from "../component/AccountBook/ExpenseCard";
import { FormatDateKST } from '../utils/FormatDateKST';
import Exchange from "../component/AccountBook/Exchange";

const AccountBook = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState([]);
    const [expensesDetail, setExpensesDetail] = useState([]);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateFilterOpen, setDateFilterOpen] = useState(false);

    const listRef = useRef(null);
    const tripId = route.params.trip.trip_id;

    const fetchTripAccountData = async () => {
        try {
            setLoading(true);

            const [dashboardRes, expensesRes] = await Promise.all([
                api.get(`/trips/${tripId}/dashboard`),
                api.get(`/trips/${tripId}/expenses`),
            ]);

            setDashboard(dashboardRes.data.members);
            setExpensesDetail(expensesRes.data.expenses);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useFocusEffect(
        useCallback(() => {
            if (!tripId) {
                return;
            }
            console.log(tripId);
            fetchTripAccountData();
        }, [tripId])
    );


    const totalExpense = useMemo(
        () => dashboard.reduce((acc, m) => acc + Number(m.paid_total), 0),
        [dashboard]
    );

    const avgExpense =
        dashboard.length > 0
            ? (totalExpense / dashboard.length).toFixed(2)
            : 0;

    const dateList = useMemo(() => {
        return [
            ...new Set(expensesDetail.map((e) => FormatDateKST(e.created_at))),
        ];
    }, [expensesDetail]);

    const filteredExpenses = useMemo(() => {
        if (!selectedDate) return expensesDetail;
        return expensesDetail.filter(
            (e) => FormatDateKST(e.created_at) === selectedDate
        );
    }, [expensesDetail, selectedDate]);

    if (loading) {
        return (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
                로딩 중...
            </Text>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
                <FlatList
                    ref={listRef}
                    onScroll={(e) => setShowScrollTop(e.nativeEvent.contentOffset.y > 120)}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingBottom: 140 }}
                    ListHeaderComponent={
                        <>
                            {/* 사용 내역 추가 버튼 */}
                            <Pressable
                                style={styles.addButton}
                                onPress={() =>
                                    navigation.navigate("AddExpense", {
                                        trip: route.params.trip
                                    })
                                }
                            >
                                <Text style={styles.addButtonText}>+ 사용 내역 추가하기</Text>
                            </Pressable>

                            <Exchange />

                            {/* 요약 카드 */}
                            <SummaryCard totalExpense={totalExpense} avgExpense={avgExpense} />

                            {/* 정산 테이블 */}
                            <SettlementTable dashboard={dashboard} />

                            {/* 날짜 필터 */}
                            <DateFilter
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                dateList={dateList}
                                open={dateFilterOpen}
                                setOpen={setDateFilterOpen}
                            />
                        </>
                    }
                    data={filteredExpenses}
                    keyExtractor={(item) => String(item.expense_id)}
                    renderItem={({ item, index }) => (
                        <ExpenseCard
                            item={item}
                            index={index}
                            filteredExpenses={filteredExpenses}
                            navigation={navigation}
                            tripId={tripId}
                        />
                    )}
                />

                {/* 새로고침 FAB */}
                <Pressable style={styles.fab} onPress={fetchTripAccountData}>
                    <Text style={styles.fabText}>⟳</Text>
                </Pressable>

                {/* 맨 위로 FAB */}
                {showScrollTop && (
                    <Pressable
                        style={[styles.fab, { bottom: 120 }]}
                        onPress={() =>
                            listRef.current?.scrollToOffset({ offset: 0, animated: true })
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
