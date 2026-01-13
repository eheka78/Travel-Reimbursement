import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "./styles";
import { shortenName } from "../../utils/shortenName";
import { FormatDateKST } from "../../utils/FormatDateKST";

export default function ExpenseCard({ item, index, filteredExpenses, navigation, tripId, fetchTripAccountStatistics }) {
    const currentDate = FormatDateKST(item.created_at);
    const prevDate = index > 0 ? FormatDateKST(filteredExpenses[index - 1].created_at) : null;
    const showDateHeader = index === 0 || currentDate !== prevDate;

    return (
        <>
            {showDateHeader && (
                <View style={styles.dateHeader}>
                    <View style={styles.dateLine} />
                    <Text style={styles.dateHeaderText}>{currentDate}</Text>
                    <View style={styles.dateLine} />
                </View>
            )}

            <Pressable
                style={[styles.card, showDateHeader && { marginTop: 6 }]}
                onPress={() =>
                    navigation.navigate("ExpenseDetail", {
                        item,
                        tripId,
                        fetchTripAccountStatistics,
                    })
                }
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.description}</Text>
                    <Text style={styles.cardAmount}>${item.amount}</Text>
                </View>

                <Text style={styles.cardMeta}>지불자 · {item.paid_by_name}</Text>

                <View style={styles.shareBox}>
                    {item.shares.map((s, idx) => (
                        <View key={idx} style={styles.shareChip}>
                            <Text style={styles.shareChipText}>{shortenName(s.user_name)} ${s.share}</Text>
                        </View>
                    ))}
                </View>
            </Pressable>
        </>
    );
};
