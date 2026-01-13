import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../api/api";

const AddPostScreen = () => {
    const [file, setFile] = useState([]); // [{ uri, fileName, mimeType }] 형태로 보관
    // mimeType 추정
    const guessMime = (uri) => {
        const ext = uri.split(".").pop()?.toLowerCase();
        if (ext === "png") return "image/png";
        if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
        if (ext === "heic") return "image/heic";
        return "image/jpeg";
    };

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
            setFile(next);
        }
    };

    // 이미지 업로드
    const registerPostImage = async (targetPostId, files) => {
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            // 용량 줄이기
            // const img = files[i];
            // const resized = await ImageManipulator.manipulateAsync(
            //   img.uri,
            //   [{ resize: { width: 1024 } }],
            //   { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            // );

            files.forEach((img, i) => {
                formData.append("file", {
                    uri: img.uri,
                    name: img.fileName || `image_${i}.jpg`,
                    type: img.mimeType || "image/jpeg",
                });
            });
        }
        console.log(formData);

        const response = await api.post(`/posts/${targetPostId}/images`, formData);

        console.log("Upload result:", response.data);
        return response.data;
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edge={["top"]}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.flexRow}>
                        <Text style={styles.textLabel}>사진 등록</Text>
                        <Pressable onPress={pickImages} style={styles.imageUploadBtn}>
                            <Image
                                source={require("../assets/uploadImage.png")}
                                style={{
                                    width: 15,
                                    height: 15,
                                    marginRight: 4,
                                }}
                            />
                            <Text style={styles.imageUploadText}>upload</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddPostScreen;

const styles = StyleSheet.create({
    scrollView: {
        marginBottom: 100,
    },
    content: {
        marginHorizontal: 30,
        marginVertical: 15,
        flexDirection: "column",
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    textLabel: {
        fontSize: 13.5,
    },
    inputText: {
        width: 244,
        height: 27,
        paddingVertical: 0,
        lineHeight: 15,
        fontSize: 12.5,
        textAlignVertical: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginVertical: 15,
    },
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 30,
        position: "absolute",
        bottom: 60,
    },
    loginBtn: {
        backgroundColor: "#215294",
        width: 170,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    loginText: {
        color: "white",
        fontSize: 16,
    },
    dropdownPicker: {
        width: 244,
        borderColor: "#d9d9d9",
    },
    imageUploadBtn: {
        backgroundColor: "#215294",
        width: 90,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        alignItems: "center",
        flexDirection: "row",
    },
    imageUploadText: {
        color: "white",
        fontSize: 10,
        fontWeight: "light",
    },
});
