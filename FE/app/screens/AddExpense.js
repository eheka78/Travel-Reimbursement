import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../api";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDateTime } from "../utils/FormatDateTime";

const AddExpense = ({ route, navigation }) => {
  const { trip } = route.params;
  console.log("trip: ", route);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("기타");
  const [members, setMembers] = useState([]);
  const [selectedPaidBy, setSelectedPaidBy] = useState(null);
  const [shares, setShares] = useState({});
  const [splitMode, setSplitMode] = useState("입력"); // "엔빵" | "직접 입력"
  const [remaining, setRemaining] = useState(0);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ mode: null });


  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/trips/${trip.trip_id}/members`);
        setMembers(res.data.members);
        if (res.data.members.length > 0) {
          setSelectedPaidBy(res.data.members[0].id);
          resetShares(res.data.members);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const resetShares = (memberList) => {
    const init = {};
    memberList.forEach(m => init[m.id] = "0");
    setShares(init);
    setRemaining(amount ? Number(amount) : 0);
  };

  // 엔빵 모드
  useEffect(() => {
    if (splitMode !== "엔빵" || !amount || members.length === 0) return;

    const split = (Number(amount) / members.length).toFixed(2);
    const updated = {};
    members.forEach(m => updated[m.id] = split);

    setShares(updated);
    setRemaining(0);
  }, [amount, members, splitMode]);

  // 직접 입력 남은 금액 계산
  useEffect(() => {
    if (splitMode !== "직접 입력") return;

    const totalEntered = Object.values(shares).reduce((sum, v) => sum + Number(v || 0), 0);
    const remain = Number(amount || 0) - totalEntered;
    setRemaining(remain);
  }, [shares, amount, splitMode]);

  const handleShareChange = (userId, value) => {
    setShares(prev => ({
      ...prev,
      [userId]: value
    }));
  };

  const handleSplitModeChange = (mode) => {
    setSplitMode(mode);
    if (mode === "직접 입력") {
      resetShares(members);
    }
  };

  const handleSubmit = async () => {
    if (!description || !amount || !selectedPaidBy) {
      alert("설명, 금액, 지불자를 입력해주세요.");
      return;
    }

    if (splitMode === "직접 입력" && remaining !== 0) {
      alert(`금액이 정확히 맞지 않습니다. 남은 금액: ${remaining}`);
      return;
    }

    const sharesArray = members.map(member => ({
      user_id: member.id,
      share: Number(shares[member.id] || 0)
    }));

    try{
      const res = await api.post(`/trips/${route.params.trip.trip_id}/expenses`, {
        paid_by: selectedPaidBy,
        amount: Number(amount),
        description,
        category,
        shares: sharesArray,
        created_at: formatDateTime(date)
      });
      
      console.log("지출 내역 기록: ", res.data);
      route.params.fetchTripAccountStatistics();
      navigation.pop();

    } catch (err) {
        console.error("지출 내역 기록 에러:", err.response?.data || err.message);
    }
  };

  if (loading) return <Text>로딩 중...</Text>;

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>지출 날짜 / 시간</Text>
        <Text style={{ marginBottom: 10 }}>
          {date.toLocaleString()}
        </Text>

        <Button title="날짜 선택" onPress={() => setShowPicker({ mode: "date" })} />
        <Button title="시간 선택" onPress={() => setShowPicker({ mode: "time" })} />

        {showPicker.mode && (
          <DateTimePicker
            value={date}
            mode={showPicker.mode}
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker({ mode: null });
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}


        <Text>총 금액</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text>설명</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} />

        <Text>카테고리</Text>
        <Picker selectedValue={splitMode} onValueChange={handleSplitModeChange}>
          <Picker.Item label="숙박" value="숙박" />
          <Picker.Item label="식사" value="식사" />
          <Picker.Item label="교통" value="교통" />
          <Picker.Item label="액티비티" value="액티비티" />
          <Picker.Item label="쇼핑" value="쇼핑" />
          <Picker.Item label="팁" value="팁" />
          <Picker.Item label="보험" value="보험" />
          <Picker.Item label="기타" value="기타" />
        </Picker>

        <Text>지불자 선택</Text>
        <Picker selectedValue={selectedPaidBy} onValueChange={setSelectedPaidBy}>
          {members.map(m => (
            <Picker.Item key={m.id} label={m.name} value={m.id} />
          ))}
        </Picker>

        <Text>분배 방식</Text>
        <Picker selectedValue={splitMode} onValueChange={handleSplitModeChange}>
          <Picker.Item label="엔빵" value="엔빵" />
          <Picker.Item label="직접 입력" value="직접 입력" />
        </Picker>

        <Text style={styles.sectionTitle}>참여자 부담액 입력</Text>

        {splitMode === "직접 입력" && (
          <Text style={styles.remainingText}>
            남은 금액: {remaining.toFixed(2)} 원
          </Text>
        )}

        {members.map(m => (
          <View key={m.id} style={styles.row}>
            <Text style={{ flex: 1 }}>{m.name}</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              keyboardType="numeric"
              value={shares[m.id]?.toString() || ""}
              onChangeText={(val) => handleShareChange(m.id, val)}
            />
          </View>
        ))}

        <Button title="등록" onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  sectionTitle: { fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  remainingText: { fontSize: 16, marginBottom: 10, color: "red" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 }
});
