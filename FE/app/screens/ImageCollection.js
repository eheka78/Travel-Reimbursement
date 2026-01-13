import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import api from "../../api";

const GAP = "2%"; // 이미지 사이 여백

export default function ImageCollection({ route, navigation }) {
    const { trip } = route.params;
    const [imgList, setImgList] = useState([]);

    const fetchImage = async () => {
        if (!trip?.trip_id) return;

        try {
            const res = await api.get(`/trips/${trip.trip_id}/receipts`);
            setImgList(res.data.receipts || []);
        } catch (err) {
            console.error("이미지 목록 가져오기 실패:", err.message);
            setImgList([]);
        }
    };

    useEffect(() => {
        fetchImage();
    }, [trip]);

    const renderItem = ({ item }) => {
        console.log("item:", item);
        return (
            <Pressable
                style={styles.imageWrapper}
                onPress={() =>
                    navigation.navigate("ReceiptDetail", {
                        receipt: item,
                    })
                }
            >
                <Image
                    source={{
                        uri: `${api.defaults.baseURL}${item.image_url}`,
                    }}
                    style={styles.image}
                />
            </Pressable>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={imgList}
                    keyExtractor={(item) => item.receipt_id}
                    renderItem={renderItem}
                    numColumns={3}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    row: {
        //justifyContent: "space-between",
        marginBottom: GAP,
        gap: GAP,
    },
    imageWrapper: {
        width: "32%",
        aspectRatio: 1, // 정사각형
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#eee",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});
