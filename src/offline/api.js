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
    const res = await fetch(`${API_URL}${path}`, {credentials: 'include',});
    if (res.status === 401) {
      window.location.replace("/");
      throw new Error("Unauthorized");
    }
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
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (res.status === 401) {
      window.location.replace("/");
    }
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

export async function getInsulinAndXEBE(foodItems, shortInsulin) {
    if (!foodItems || foodItems.length === 0 || !shortInsulin) {
        return { insulin: 0, XEBE: 0 };
    }

    const products = await apiGet('/products');
    let totalXEBE = 0;

    for (const item of foodItems) {
        const product = products.find(p => p.id === item.value);
        if (!product) {
            console.warn(`Продукт с id=${item.value} не найден`);
            continue;
        }
        const xebe = parseFloat(String(product["ХЕ + БЖЕ"]).replace(',', '.')) || 0;
        totalXEBE += xebe * item.amount;
    }

    return {
        insulin: parseFloat((totalXEBE * shortInsulin).toFixed(2)),
        XEBE: parseFloat(totalXEBE.toFixed(2)),
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
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item.body)
                });
            } catch {
                break;
            }
            if (res.status === 401) {
              window.location.replace("/");
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