import {
  cacheGet,
  cacheSet,
  outboxAdd,
  outboxAll,
  outboxDelete
} from './db';

const API_URL = import.meta.env.VITE_API_URL;

export async function apiGet(path) {
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    await cacheSet(path, data);
    return data;
  } catch (e) {
    const cached = await cacheGet(path);
    if (cached) {
      return cached.data;
    }
    throw new Error('Нет сети и нет сохранённых данных');
  }
}

export async function apiWrite(method, path, body) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return {
      queued: false,
      data: await res.json().catch(() => null)
    };
  } catch (e) {
    if (e instanceof TypeError) {
      await outboxAdd({
        method,
        path,
        body,
        createdAt: Date.now()
      });
      return {
        queued: true,
        data: null
      };
    }
    throw e;
  }
}

export async function getInsulinAndXEBE(foodItems) {
    if (!foodItems || foodItems.length === 0) {
        return {
            insulin: 0,
            XEBE: 0
        };
    }

    const products = await apiGet('/products');

    let calculatedInsulin = 0;
    let calculatedXEBE = 0;

    for (const item of foodItems) {
        const product = products.find(
            product => product.id === item.value
        );

        if (!product) {
            console.warn(
                `Продукт с id=${item.value} не найден`
            );
            continue;
        }

        const xebe =
            parseFloat(
                String(product["ХЕ + БЖЕ"]).replace(',', '.')
            ) || 0;

        const insulin =
            parseFloat(
                String(product["Всего инсулина"]).replace(',', '.')
            ) || 0;

        const amount = item.amount;

        calculatedXEBE += xebe * amount;
        calculatedInsulin += insulin * amount;
    }

    return {
        insulin: parseFloat(calculatedInsulin.toFixed(2)),
        XEBE: parseFloat(calculatedXEBE.toFixed(2))
    };
}

let syncing = false;

export async function syncOutbox() {
    if (syncing) return;
    syncing = true;
    try {
        for (const item of await outboxAll()) {
            let res;
            try {
                res = await fetch(`${API_URL}${item.path}`, {
                    method: item.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item.body)
                });
            } catch {
                break;
            }
            if (res.status >= 500) {
                break;
            }
            await outboxDelete(item.id);
        }
    } finally {
        syncing = false;
    }
}