// ✅ Медиана
// ✅ Стандартное отклонение
// ✅ Самый высокий сахар + время
// ✅ Самый низкий сахар + время

function fmt(value) {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return null;
    }
    return value.toFixed(2);
}

function average(values) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    return sorted.length % 2
        ? sorted[middle]
        : (sorted[middle - 1] + sorted[middle]) / 2;
}

function mode(values) {
    const counts = {};

    values.forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
    });

    return Number(
        Object.keys(counts).reduce((a, b) =>
            counts[a] > counts[b] ? a : b
        )
    );
}

function averageByPeriod(records, startHour, endHour) {
    const filtered = records.filter(record => {
        const hour = new Date(record.datetime).getHours();

        if (startHour < endHour) {
            return hour >= startHour && hour < endHour;
        }

        return hour >= startHour || hour < endHour;
    });

    if (!filtered.length) return null;

    return average(filtered.map(record => record.sugar));
}

export default function calculateMetrics(records) {
    if (!records.length) {
        return null;
    }

    const sugars = records.map(record => record.sugar);

    const avg = average(sugars);

    const variance =
        sugars.reduce((sum, value) => sum + (value - avg) ** 2, 0) /
        sugars.length;

    const standardDeviation = Math.sqrt(variance);

    const highest = records.reduce((max, record) =>
        record.sugar > max.sugar ? record : max
    );

    const lowest = records.reduce((min, record) =>
        record.sugar < min.sugar ? record : min
    );

    const uniqueDays = new Set(
        records.map(record => record.datetime.slice(0, 10))
    );

    return {
        // Основные
        average: fmt(avg),
        median: fmt(median(sugars)),
        mode: fmt(mode(sugars)),

        min: fmt(lowest.sugar),
        max: fmt(highest.sugar),

        // Вариабельность
        standardDeviation: fmt(standardDeviation),
        coefficientVariation: fmt((standardDeviation / avg) * 100),

        // Временные диапазоны
        timeLow: fmt((sugars.filter(v => v < 3.9).length / sugars.length) * 100),

        timeInRange: fmt(
            (sugars.filter(v => v >= 3.9 && v <= 8.5).length / sugars.length) * 100
        ),

        timeBitHigh: fmt(
            (sugars.filter(v => v > 8.5 && v <= 12.5).length / sugars.length) * 100
        ),

        timeHigh: fmt((sugars.filter(v => v > 12.5).length / sugars.length) * 100),

        // Количество
        count: sugars.length,

        averagePerDay: fmt(sugars.length / uniqueDays.size),

        // По времени суток
        morningAverage: fmt(averageByPeriod(records, 6, 12)),

        dayAverage: fmt(averageByPeriod(records, 12, 18)),

        eveningAverage: fmt(averageByPeriod(records, 18, 24)),

        nightAverage: fmt(averageByPeriod(records, 0, 6)),
    };
}