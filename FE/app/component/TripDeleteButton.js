import React, { useState } from "react";
import { View, Text, Pressable, TextInput, Modal, StyleSheet, Alert } from "react-native";
import { colors } from "../constant/colors";
import api from "../../api";

export const TripDeleteButton = ({ trip, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [inputTitle, setInputTitle] = useState("");

    const handleDelete = async () => {
        if (inputTitle !== trip.title) {
            alert("입력한 제목이 여행 제목과 일치하지 않습니다.");
            return;
        }

        try {
            console.log("###################");
            console.log(trip.trip_id, inputTitle);
            const res = await api.delete(`/trips/${trip.trip_id}`, {
                data: { title: inputTitle }
            });

            console.log(res.data);
            alert("여행이 삭제되었습니다.");
            navigation.navigate("Home");
        } catch (err) {
            alert(err.response?.data?.message || "삭제 실패");
        } finally {
            setModalVisible(false);
            setInputTitle("");
        }
    };

    return (
        <View>
            <Pressable
                style={styles.deleteBtn}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.deleteText}>여행 삭제</Text>
            </Pressable>

            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>여행 제목을 입력해주세요</Text>
                        <TextInput
                            placeholder="여행 제목"
							placeholderTextColor="#999"
                            style={styles.input}
                            value={inputTitle}
                            onChangeText={setInputTitle}
                        />
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={styles.cancelBtn}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text>취소</Text>
                            </Pressable>
                            <Pressable
                                style={styles.confirmBtn}
                                onPress={handleDelete}
                            >
                                <Text style={{ color: "white" }}>삭제</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    deleteBtn: {
        marginTop: 15,
        backgroundColor: colors.negative,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    deleteText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    cancelBtn: {
        padding: 10
    },
    confirmBtn: {
        padding: 10,
        backgroundColor: "red",
        borderRadius: 8
    },
});

export default TripDeleteButton;
