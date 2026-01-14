// 오전 오후 표시

export function FormatDateTimeKST2(utcString) {
	const date = new Date(utcString);
	const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC +9

	const yyyy = kstDate.getUTCFullYear();
	const mm = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
	const dd = String(kstDate.getUTCDate()).padStart(2, "0");

	let hour = kstDate.getUTCHours();
	const mi = String(kstDate.getUTCMinutes()).padStart(2, "0");
	const ss = String(kstDate.getUTCSeconds()).padStart(2, "0");

	const period = hour < 12 ? "오전" : "오후";
	hour = hour % 12;
	hour = hour === 0 ? 12 : hour;

	const hh = String(hour).padStart(2, "0");

	return `${yyyy}-${mm}-${dd} ${period} ${hh}:${mi}:${ss}`;
}
