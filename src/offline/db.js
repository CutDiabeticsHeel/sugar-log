function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('sugar-log', 1);

    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore('cache');
      db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const dbPromise = openDb();

async function run(store, mode, action) {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const request = action(tx.objectStore(store));
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export const cacheSet = (key, data) =>
  run('cache', 'readwrite', (s) => s.put({ data, savedAt: Date.now() }, key));

export const cacheGet = (key) =>
  run('cache', 'readonly', (s) => s.get(key));

export const outboxAdd = (item) =>
  run('outbox', 'readwrite', (s) => s.add(item));

export const outboxAll = () =>
  run('outbox', 'readonly', (s) => s.getAll());

export const outboxDelete = (id) =>
  run('outbox', 'readwrite', (s) => s.delete(id));