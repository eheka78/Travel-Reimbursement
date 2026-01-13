export function FormatUTCtoDateTime(utcString) {
    // 2026-01-13T02:13:00.000Z
    return utcString.replace("T", " ").replace(/\.\d+Z$/, "");
}