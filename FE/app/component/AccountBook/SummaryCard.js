import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constant/colors";

export default function SummaryCard({ totalExpense, avgExpense }) {
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.subcard}>
                    <Text style={styles.label}>총 지출</Text>
                    <Text style={styles.value}>${totalExpense}</Text>
                </View>s

                <View style={styles.divider} />

                <View style={styles.subcard}>
                    <Text style={styles.label}>평균 지출</Text>
                    <Text style={styles.value}>${avgExpense}</Text>
                </View>
            </View>
        </View>
    );
};


export const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 18,
        paddingVertical: 22,
        paddingHorizontal: 24,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // 중요
    },
    subcard: {
        width: "47%",
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontSize: 12,
        color: "#9CA3AF",
        marginBottom: 6,
        textAlign: "center",
    },
    value: {
        fontSize: 26,
        fontWeight: "800",
        color: colors.point,
        textAlign: "center",
    },
    divider: {
        width: 1,
        height: 44,
        backgroundColor: "#E5E7EB",
        marginHorizontal: 10, // 좌우 간격 확보
    },
});
