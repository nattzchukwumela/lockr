const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("lockrDB", 1);

    request.onerror = (e) => {
      console.error(e || "something went wrong");
    };

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("lockr")) {
        const store = db.createObjectStore("lockr", {
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
