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

const addKeys = async (data: SECRETKEY[]) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx: IDBTransaction = db.transaction(STORE_NAME, "readwrite");
    const store: IDBObjectStore = tx.objectStore(STORE_NAME);

    data.forEach((key) => {
      const request = store.add(key);

      request.onerror = (e) => {
        reject(e);
        console.error(`Error adding key ${key.id}: ${e}`);
      };

      request.onsuccess = () => {
        resolve(request.result);
        console.log(`Key ${key.id} added successfully`);
      };
    });
  });
};
