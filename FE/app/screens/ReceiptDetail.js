import { StyleSheet, View, Image, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";
import { FormatDateKST } from "../utils/FormatDateKST";

export default function ReceiptDetail({ route }) {
    const { receipt } = route.params;
    const { expense, paid_by, image_url } = receipt;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Image
                    source={{ uri: `${api.defaults.baseURL}${image_url}` }}
                    style={styles.image}
                    resizeMode="contain"
                />

                {/* 🔽 정보 영역 */}
                <View style={[styles.overlay, styles.gradient]}>
                    {/* 카테고리 */}
                    <View style={styles.categoryChip}>
                        <Text style={styles.categoryText}>
                            {expense.category}
                        </Text>
                    </View>

                    {/* 설명 / 메모 */}
                    {expense.description && (
                        <Text style={styles.description}>
                            {expense.description}
                        </Text>
                    )}

                    {/* 금액 */}
                    <Text style={styles.amount}>
                        {Number(expense.amount).toLocaleString()}원
                    </Text>

                    {/* 날짜 + 결제자 */}
                    <Text style={styles.subInfo}>
                        {FormatDateKST(expense.expense_date)} · {paid_by.name}
                    </Text>

                    {expense.memo && (
                        <Text style={styles.memo}>
                            {expense.memo}
                        </Text>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    image: {
        width: "100%",
        height: "100%",
    },

    /* 가짜 그라데이션 */
    gradient: {
        width: "100%",
        padding: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: "flex-end",
        backgroundColor: "transparent",
        backgroundColor: "rgba(0,0,0,0.65)",
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingHorizontal: 20,
        paddingBottom: 40, // 홈 인디케이터 대응
    },


    categoryChip: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 10,
    },
    categoryText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    description: {
        fontSize: 28,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 6,
    },

    subInfo: {
        fontSize: 13,
        color: "#ddd",
        marginBottom: 12,
    },

    amount: {
        fontSize: 15,
        color: "#fff",
        marginBottom: 6,
        lineHeight: 20,
    },

    memo: {
        fontSize: 13,
        color: "#bbb",
        lineHeight: 18,
    },
});
