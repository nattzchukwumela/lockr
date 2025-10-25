interface SECRETKEY {
  id?: number | string;
  name: string;
  email: boolean;
  secret: string;
  type: string;
  addedAt: Date;
}

const DB_NAME = "lockrDB";
const STORE_NAME = "lockr";
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (e) => {
      console.error("IndexedDB error:", e);
      reject(e);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        // match your interface -> "name", not "account_name"
        store.createIndex("name", "name", { unique: true });
        store.createIndex("email", "email", { unique: false });
        store.createIndex("type", "type", { unique: false });
      }
    };
  });
};

const addKeys = async (data: SECRETKEY[]): Promise<void> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    tx.oncomplete = () => {
      console.log("All keys added successfully");
      resolve();
    };

    tx.onerror = (e) => {
      console.error("Transaction failed:", e);
      reject(e);
    };

    data.forEach((key) => {
      const request = store.add(key);
      request.onsuccess = () => {
        console.log(`Added key for ${key.name}`);
      };
      request.onerror = (e) => {
        console.error(`Error adding key for ${key.name}:`, e);
      };
    });
  });
};

const updateKeyDetails = async (
  id: number | string,
  key: SECRETKEY,
): Promise<void> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    // Ensure the record has the right ID
    if (!key.id) key.id = id;

    const request = store.put(key);

    request.onsuccess = () => {
      console.log(`Updated key for ${key.name}`);
    };

    request.onerror = (e) => {
      console.error(`Error updating key for ${key.name}:`, e);
      reject(e);
    };

    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
};

const deleteKey = async (id: number | string): Promise<void> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const request = store.delete(id);

    request.onsuccess = () => {
      console.log(`Deleted key with id: ${id}`);
    };

    request.onerror = (e) => {
      console.error(`Failed to delete key with id: ${id}`, e);
      reject(e);
    };

    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
};

const deleteAllKeys = async (): Promise<void> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const request = store.clear();

    request.onsuccess = () => {
      console.log(`Deleted all keys`);
    };

    request.onerror = (e) => {
      console.error(`Failed to delete all keys`, e);
      reject(e);
    };

    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
};
