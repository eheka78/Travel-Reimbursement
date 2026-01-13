import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../../api";

export default function ReceiptImagePickerEdit({ file = [], setFile }) {
    useEffect(() => {
        console.log("ReceiptImagePickerEdit - file: ", file);
    }, [file]);


    const pickImages = async () => {
        // 갤러리 접근 권한 요청
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("사진 접근 권한이 필요합니다");
            return;
        }

        // 이미지 선택
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true, // 여러장 선택 가능
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            // assets: { uri, fileName?, mimeType? }
            const next = result.assets.map((a, idx) => {
                const fileName =
                    a.fileName ??
                    `photo_${Date.now()}_${idx}.${a.uri.split(".").pop() || "jpg"}`;
                const mimeType = a.mimeType ?? guessMime(a.uri);
                return { uri: a.uri, fileName, mimeType };
            });
            setFile((prev) => [...prev, ...next]);
        }
    };


    const removeImage = (index) => {
        setFile((prev) => prev.filter((_, i) => i !== index));
    };


    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>
                영수증 이미지 ({file.length}/5)
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {file.map((img, idx) => {
                    console.log("############### img: ", `${api.defaults.baseURL}${img.uri}`);
                    console.log("############### img2: ", img.uri);

                    return (
                        <View key={idx} style={styles.imageWrapper}>
                            <Image
                                source={{ uri: (img.uri.startsWith("file://") ? img.uri : `${api.defaults.baseURL}${img.uri}`) }}
                                style={styles.image}
                            />
                            <Pressable
                                style={styles.removeBtn}
                                onPress={() => removeImage(idx)}
                            >
                                <Text style={styles.removeText}>✕</Text>
                            </Pressable>
                        </View>
                    );
                })}

                {file.length < 5 && (
                    <Pressable
                        style={styles.addBox}
                        onPress={() => {
                            console.log("이미지 선택하기");
                            pickImages();
                        }}
                    >
                        <Text style={styles.plus}>＋</Text>
                        <Text style={styles.addText}>추가</Text>
                    </Pressable>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 10,
        color: "#374151",
    },
    scrollContainer: {
        gap: 10,
        paddingVertical: 4,
        paddingTop: 7,
    },
    imageWrapper: {
        position: "relative",
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 12,
        backgroundColor: "#e5e7eb",
    },
    removeBtn: {
        position: "absolute",
        top: -6,
        right: -6,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#ef4444",
        justifyContent: "center",
        alignItems: "center",
    },
    removeText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
    addBox: {
        width: 90,
        height: 90,
        borderRadius: 12,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#9ca3af",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
    },
    plus: {
        fontSize: 28,
        fontWeight: "700",
        color: "#4f46e5",
    },
    addText: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: -2,
    },
});
