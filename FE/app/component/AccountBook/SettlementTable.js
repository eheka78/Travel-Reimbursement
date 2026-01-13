import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";

export default function SettlementTable({ dashboard }) {
    return (
        <View style={styles.tableWrapper}>
            <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.nameCell]}>이름</Text>
                <Text style={styles.cellRight}>지불</Text>
                <Text style={styles.cellRight}>부담</Text>
                <Text style={styles.cellRight}>차액</Text>
            </View>

            {dashboard.map((item) => (
                <View key={item.user_id} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text>
                    <Text style={styles.cellRight}>${item.paid_total}</Text>
                    <Text style={styles.cellRight}>${item.share_total}</Text>
                    <Text
                        style={[
                            styles.cellRight,
                            item.balance >= 0 ? styles.balancePositive : styles.balanceNegative,
                        ]}
                    >
                        ${item.balance}
                    </Text>
                </View>
            ))}
        </View>
    );
};
