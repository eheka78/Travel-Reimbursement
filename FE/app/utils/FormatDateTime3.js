// DATE 형식을 보기 좋게 바꿀 때
// BE -> FE

// 날짜, 시간 뽑아내기

export const formatDateTime3 = (isoString) => {
    if (!isoString) return;

    const dateObj = new Date(isoString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}`;

    return { date, time };
};
