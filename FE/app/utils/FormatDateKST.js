export function FormatDateKST(utcString) {

    const date = new Date(utcString);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC +9
    const yyyy = kstDate.getUTCFullYear();
    const mm = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(kstDate.getUTCDate()).padStart(2, "0");
    
    return `${yyyy}-${mm}-${dd}`;
}
