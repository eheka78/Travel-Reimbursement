import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

export default function Exchange() {
    const [rate, setRate] = useState(0);
    const [usd, setUsd] = useState("");
    const [krw, setKrw] = useState("");
    const [lastEdited, setLastEdited] = useState(null); // "USD" | "KRW"

    // 환율 불러오기
    useEffect(() => {
        const fetchRate = async () => {
            const res = await fetch(
                "https://api.exchangerate-api.com/v4/latest/USD"
            );
            const data = await res.json();
            setRate(data.rates.KRW);
        };
        fetchRate();
    }, []);

    // USD → KRW
    useEffect(() => {
        if (!rate || lastEdited !== "USD") return;
        if (usd === "") {
            setKrw("");
            return;
        }
        setKrw((parseFloat(usd) * rate).toFixed(0));
    }, [usd, rate]);

    // KRW → USD
    useEffect(() => {
        if (!rate || lastEdited !== "KRW") return;
        if (krw === "") {
            setUsd("");
            return;
        }
        setUsd((parseFloat(krw) / rate).toFixed(2));
    }, [krw, rate]);

    return (
        <View style={styles.wrapper}>
            <View style={styles.row}>
                {/* USD */}
                <View style={styles.moneyBox}>
                    <Text style={styles.symbol}>$</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={usd}
                        onChangeText={(text) => {
                            setLastEdited("USD");
                            setUsd(text);
                        }}
                        placeholder="🇺🇸"
                        placeholderTextColor="#999"
                    />
                </View>

                {/* = */}
                <View style={styles.equalBox}>
                    <Text style={styles.equalText}>=</Text>
                </View>

                {/* KRW */}
                <View style={styles.moneyBox}>
                    <Text style={styles.symbol}>₩</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={krw}
                        onChangeText={(text) => {
                            setLastEdited("KRW");
                            setKrw(text);
                        }}
                        placeholder="🇰🇷"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            <Text style={styles.rateText}>
                1 USD ≈ {rate ? rate.toLocaleString() : "-"} KRW
            </Text>
        </View>
    );
}



const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 24,
        marginBottom: 18,
    },
    row: {
        flexDirection: "row",
        gap: 8,
    },
    moneyBox: {
        flex: 1,
        height: 46,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    symbol: {
        fontSize: 13,
        color: "#9ca3af",
        marginRight: 6,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#374151",
        paddingVertical: 0,
    },
    resultText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#334155",
    },
    equalBox: {
        width: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    equalText: {
        fontSize: 14,
        color: "#9ca3af",
        fontWeight: "500",
    },
    rateText: {
        marginTop: 6,
        fontSize: 12,
        // textAlign: "right",
        color: "#9ca3af",
    },
});
