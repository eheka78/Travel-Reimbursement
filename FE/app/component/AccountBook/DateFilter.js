import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "./styles";

export default function DateFilter({ selectedDate, setSelectedDate, dateList, open, setOpen }) {
    return (
        <>
            <Pressable style={styles.dateFilterHeader} onPress={() => setOpen((prev) => !prev)}>
                <Text style={styles.dateFilterHeaderText}>📅 날짜 필터 · {selectedDate ?? "전체"}</Text>
                <Text style={styles.dateFilterArrow}>{open ? "▲" : "▼"}</Text>
            </Pressable>

            {open && (
                <View style={styles.dateFilterRow}>
                    <Pressable
                        style={[styles.dateFilterButton, !selectedDate && styles.dateFilterActive]}
                        onPress={() => {
                            setSelectedDate(null);
                            setOpen(false);
                        }}
                    >
                        <Text style={[styles.dateFilterText, !selectedDate && styles.dateFilterTextActive]}>전체</Text>
                    </Pressable>

                    {dateList.map((date) => (
                        <Pressable
                            key={date}
                            style={[styles.dateFilterButton, selectedDate === date && styles.dateFilterActive]}
                            onPress={() => {
                                setSelectedDate(date);
                                setOpen(false);
                            }}
                        >
                            <Text style={[styles.dateFilterText, selectedDate === date && styles.dateFilterTextActive]}>{date}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </>
    );
};