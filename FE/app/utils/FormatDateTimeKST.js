export function FormatDateTimeKST(utcString) {
    const date = new Date(utcString);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC +9

    const yyyy = kstDate.getUTCFullYear();
    const mm = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(kstDate.getUTCDate()).padStart(2, "0");

    const hh = String(kstDate.getUTCHours()).padStart(2, "0");
    const mi = String(kstDate.getUTCMinutes()).padStart(2, "0");
    const ss = String(kstDate.getUTCSeconds()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}