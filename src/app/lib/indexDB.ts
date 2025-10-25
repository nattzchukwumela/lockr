import { rejects } from "node:assert";

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

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (e) => {
      console.error(e || "something went wrong");
    };

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        store.createIndex("name", "account_name", { unique: true });
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
      request.onsuccess = () => {
        console.log(`Key ${key.id} added successfully`);
      };
      request.onerror = (e) => {
        console.error(`Error adding key ${key.id}: ${e}`);
      };
    });
  });
};
