import { z } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

function toNumber(val) {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const normalized = val.trim().replace(',', '.');
        if (normalized === '') return undefined;
        const n = Number(normalized);
        return Number.isNaN(n) ? val : n;
    }
    return val;
}

const numericField = (schema) => z.preprocess(toNumber, schema);

export const sugarEntrySchema = z.object({
    date: z.string().refine(
        (val) => dayjs(val, 'YYYY-MM-DD', true).isValid(),
        { message: 'Некорректная дата, ожидается формат YYYY-MM-DD' }
    ),
    time: z.string().refine(
        (val) => dayjs(val, 'HH:mm', true).isValid(),
        { message: 'Некорректное время, ожидается формат HH:mm' }
    ),
    sugar: numericField(
        z.number({ invalid_type_error: 'Сахар должен быть числом' })
         .gt(1, { message: 'Сахар должен быть больше 1' })
         .lt(40, { message: 'Сахар должен быть меньше 40' })
    ),
    insulin: numericField(
        z.number({ invalid_type_error: 'Инсулин должен быть числом' })
         .min(0).optional()
    ),
    XEBE: numericField(
        z.number({ invalid_type_error: 'ХЕ должно быть числом' })
         .min(0).optional()
    ),
    protein: numericField(z.number({ invalid_type_error: ' должно быть числом' }).optional()),
    fat: numericField(z.number({ invalid_type_error: ' должно быть числом' }).optional()),
    carb: numericField(z.number({ invalid_type_error: ' должно быть числом' }).optional()),
    food: z.any(),
    foodText: z.any(),
    activity: z.any(),
    notes: z.any(),
});