export function getSugarStatus(value) {
    if (value < 4.2) return "low";
    if (value <= 8.5) return "normal";
    if (value <= 12.5) return "bitHigh";
    else return "high";
}