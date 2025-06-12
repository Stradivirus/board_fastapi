export function formatDate(dateStr: string, timeStr?: string) {
    if (!dateStr) return { date: "", time: "" };

    // 1. 날짜 포맷팅 (예: "2025-05-04" → "2025.05.04")
    const formattedDate = dateStr.split("-").join(".");

    // 2. 시간 포맷팅 (예: "11:26:19.031" → "오전 11:26")
    let formattedTime = "";
    if (timeStr) {
        const [hoursStr, minutesStr] = timeStr.split(".")[0].split(":");
        const hours = parseInt(hoursStr);
        const minutes = minutesStr.padStart(2, "0");

        const ampm = hours >= 12 ? "오후" : "오전";
        const displayHours = hours % 12 || 12; // 0시 → 12시 변환

        formattedTime = `${ampm} ${displayHours.toString().padStart(2, "0")}:${minutes}`;
    }

    return {
        date: formattedDate,
        time: formattedTime
    };
}
