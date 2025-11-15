import React, { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, Button, Platform, FlatList, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../api";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { formatDateTime } from "../utils/FormatDateTime";
import { formatDateTime2 } from "../utils/FormatDateTime2";

export default function Home({ navigation }) {
    const [loading, setLoading] = useState(true);

    const { isLoggedIn, user } = useAuth();

    const [enterTrip, setEnterTrip] = useState("");

    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const onChangeStart = (event, selectedDate) => {
        setShowStartPicker(Platform.OS === "ios"); // iOS는 picker 유지
        if (selectedDate) setStartDate(selectedDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        setShowEndPicker(Platform.OS === "ios");
        if (selectedDate) setEndDate(selectedDate);
    };

    
    const registerTrip = async () => {
        console.log("registerTrip: ", title, startDate, endDate, user.id);
        try {
            const res = await api.post("/trips", {
                title,
                start_date: formatDateTime(startDate),
                end_date: formatDateTime(endDate),
                user_id: user.id
            });

            await fetchMyTrips();
            console.log("등록 성공:", res.data);
        } catch (err) {
            console.error("등록 실패:", err.response?.data || err.message);
        }
    };
    
    const [trips, setTrips] = useState([]);

    const fetchMyTrips = async () => {
        try {
            const res = await api.get(`/my-trips/${user.id}`);
            console.log("내 여행 목록:", res.data.trips);
            setTrips(res.data.trips);
        } catch (err) {
            console.error("여행 목록 가져오기 실패:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(!user) return;

        console.log(user.id);
        fetchMyTrips();
    }, [user]);


    const joinTrip = async () => {
        console.log("joinTrip: ", enterTrip, user.id);
        try {
            const res = await api.post("/trips/join", {
                trip_name: enterTrip,
                user_id: user.id
            });

            console.log("참여 성공:", res.data);
        } catch (err) {
            console.error("참여 실패:", err.response?.data || err.message);
        }
        
        fetchMyTrips();
    };




    if (loading) return <Text>로딩 중...</Text>;

    return (
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>{isLoggedIn ? `환영합니다, ${user.name}` : "로그인이 필요합니다"}</Text>
                {!isLoggedIn && (
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                        style={{ marginTop: 20, padding: 10, backgroundColor: "#215294", borderRadius: 5 }}
                    >
                        <Text style={{ color: "white" }}>로그인 화면으로 이동</Text>
                    </Pressable>
                )}

                <View style={{ marginTop: 20 }}>
                    <Text>여행 등록</Text>
                    <TextInput
                        placeholder="여행 이름을 입력해 주세요"
                        style={{ borderWidth: 1, padding: 8, width: 200, marginVertical: 10 }}
                        onChangeText={setTitle}
                    />

                    {/* 시작 날짜 선택 */}
                    <Button
                        title="시작 날짜 선택"
                        onPress={() => setShowStartPicker(true)}
                    />
                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={onChangeStart}
                        />
                    )}

                    {/* 종료 날짜 선택 */}
                    <Button
                        title="종료 날짜 선택"
                        onPress={() => setShowEndPicker(true)} 
                    />
                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={onChangeEnd}
                        />
                    )}

                    <Text style={{ marginTop: 10 }}>시작: {startDate.toDateString()}</Text>
                    <Text>종료: {endDate.toDateString()}</Text>

                    <Button
                        title="등록하기"
                        onPress={registerTrip}
                    />
                </View>


                <View>
                    <Text>여행 추가</Text>
                    <TextInput
                        placeholder="여행 이름을 입력해 주세요"
                        style={{ borderWidth: 1, padding: 8, width: 200, marginVertical: 10 }}
                        onChangeText={setEnterTrip}
                    />

                    <Button
                        title="등록하기"
                        onPress={joinTrip}
                    />
                </View>

                {/* 내 여행 목록 */}
                <View style={{ marginTop: 30, width: "90%", flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>내 여행 목록</Text>
                    {loading ? (
                        <Text>로딩 중...</Text>
                    ) : trips.length === 0 ? (
                        <Text>참여 중인 여행이 없습니다.</Text>
                    ) : (
                        <FlatList
                            data={trips}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => navigation.navigate("Trip", { trip: item })}
                                >
                                    <View style={{ marginVertical: 5, padding: 10, borderWidth: 1, borderRadius: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                                        <Text>시작: {formatDateTime2(item.start_date)}</Text>
                                        <Text>종료: {formatDateTime2(item.end_date)}</Text>
                                        <Text>내 역할: {item.role}</Text>
                                    </View>
                                </Pressable>
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    )}
                </View>

            </View>
        </SafeAreaView>
    );
}
