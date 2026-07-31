import { z } from 'zod';

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

const requiredNumber = (fieldName) =>
    z.preprocess(
        toNumber,
        z.number({
            error: (issue) => {
                if (issue.input === undefined) return `Поле "${fieldName}" обязательно для заполнения`;
                return `Значение должно быть числом`;
            }
        }).min(0, { message: `Значение не может быть отрицательным` })
    );

export const productEntrySchema = z.object({
    nameProduct: z.string({
        error: (issue) => issue.input === undefined
            ? 'Название обязательно для заполнения'
            : 'Название должно быть строкой'
    }).min(1, { message: 'Название не может быть пустым' }),
    protein: requiredNumber('Белки'),
    fat: requiredNumber('Жиры'),
    carbs: requiredNumber('Углеводы'),
    weigth: requiredNumber('Вес'),
});