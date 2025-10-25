interface Task {
  id?: number | string;
  name: string;
  email: boolean;
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
