import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Pressable,
    Modal,
    Dimensions,
} from "react-native";
import api from "../../api";

const { width, height } = Dimensions.get("window");
const THUMB_WIDTH = width * 0.85;
const THUMB_HEIGHT = width * 1.25;


export default function ReceiptImageViewer({ receipts = [] }) {
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const scrollRef = useRef(null);

    if (!receipts.length) return null;

    const openViewer = (i) => {
        setIndex(i);
        setVisible(true);
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                x: width * i,
                animated: false,
            });
        }, 0);
    };

    return (
        <View>
            {/* 큰 썸네일 */}
            <ScrollView
                horizontal
                pagingEnabled
                snapToInterval={THUMB_WIDTH + 16}
                snapToAlignment="center"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            >
                {receipts.map((uri, i) => (
                    <Pressable
                        key={i}
                        onPress={() => openViewer(i)}
                        style={styles.thumbnailCard}
                    >
                        <Image
                            source={{ uri: `${api.defaults.baseURL}${uri}` }}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />

                        <View style={styles.indexBadge}>
                            <Text style={styles.indexText}>
                                {i + 1} / {receipts.length}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>


            {/* 전체 화면 */}
            <Modal visible={visible} transparent>
                <View style={styles.modalBg}>
                    <View style={styles.topBar}>
                        <Text style={styles.pageText}>
                            {index + 1} / {receipts.length}
                        </Text>

                        <Pressable
                            onPress={() => setVisible(false)}
                            style={styles.closeBtn}
                        >
                            <Text style={styles.closeText}>✕</Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const newIndex = Math.round(
                                e.nativeEvent.contentOffset.x / width
                            );
                            setIndex(newIndex);
                        }}
                    >
                        {receipts.map((uri, i) => (
                            <Image
                                key={i}
                                source={{ uri: `${api.defaults.baseURL}${uri}` }}
                                style={styles.fullImage}
                                resizeMode="contain"
                            />
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    thumbnailCard: {
        width: THUMB_WIDTH,
        height: THUMB_HEIGHT,
        marginRight: 16,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#eee",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    thumbnail: {
        width: "100%",
        height: "100%",
    },
    indexBadge: {
        position: "absolute",
        bottom: 12,
        left: "50%",
        transform: [{ translateX: -30 }], // 배지 절반 정도
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
    },


    indexText: {
        color: "white",
        fontSize: 12,
        fontWeight: "700",
    },

    modalBg: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.95)",
    },

    topBar: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    pageText: {
        color: "white",
        fontSize: 15,
        fontWeight: "700",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },

    closeBtn: {
        position: "absolute",
        right: 20,
        backgroundColor: "rgba(0,0,0,0.6)",
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    closeText: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
    },

    fullImage: {
        width,
        height,
    },
});
