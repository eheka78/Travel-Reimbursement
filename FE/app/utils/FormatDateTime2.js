// DATE 형식을 보기 좋게 바꿀 때
// BE -> FE

// 날짜만 뽑아내기

export const formatDateTime2 = (date) => {
    if (!date) return;

    const dateOnly = date.split("T")[0];
    console.log(dateOnly); // "2025-11-14"
    return dateOnly;
};