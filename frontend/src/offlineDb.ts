// IndexedDB offline storage for CSC kiosk mode

const DB_NAME = "HaqDaariOffline";
const DB_VERSION = 1;

const STORES = {
  ELIGIBILITY_CACHE: "eligibilityCache",
  QUEUED_APPLICATIONS: "queuedApplications",
  FORM_DRAFTS: "formDrafts",
  SYNC_LOG: "syncLog",
} as const;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORES.ELIGIBILITY_CACHE)) {
        db.createObjectStore(STORES.ELIGIBILITY_CACHE, {
          keyPath: "aadhaarHash",
        });
      }
      if (!db.objectStoreNames.contains(STORES.QUEUED_APPLICATIONS)) {
        const store = db.createObjectStore(STORES.QUEUED_APPLICATIONS, {
          keyPath: "queueId",
          autoIncrement: true,
        });
        store.createIndex("status", "status");
      }
      if (!db.objectStoreNames.contains(STORES.FORM_DRAFTS)) {
        db.createObjectStore(STORES.FORM_DRAFTS, { keyPath: "schemeId" });
      }
      if (!db.objectStoreNames.contains(STORES.SYNC_LOG)) {
        db.createObjectStore(STORES.SYNC_LOG, {
          keyPath: "syncId",
          autoIncrement: true,
        });
      }
    };
  });
}

/** Cache eligibility result for offline access */
export async function cacheEligibilityResult(
  aadhaarHash: string,
  result: unknown,
): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORES.ELIGIBILITY_CACHE, "readwrite");
  tx.objectStore(STORES.ELIGIBILITY_CACHE).put({
    aadhaarHash,
    result,
    cachedAt: new Date().toISOString(),
  });
  db.close();
}

/** Get cached eligibility result */
export async function getCachedEligibility(
  aadhaarHash: string,
): Promise<unknown | null> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORES.ELIGIBILITY_CACHE, "readonly");
    const request = tx.objectStore(STORES.ELIGIBILITY_CACHE).get(aadhaarHash);
    request.onsuccess = () => resolve(request.result?.result ?? null);
    request.onerror = () => resolve(null);
    db.close();
  });
}

/** Queue application for sync when online */
export async function queueApplication(
  application: Record<string, unknown>,
): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.QUEUED_APPLICATIONS, "readwrite");
    const request = tx.objectStore(STORES.QUEUED_APPLICATIONS).add({
      ...application,
      status: "queued",
      queuedAt: new Date().toISOString(),
    });
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
    db.close();
  });
}

/** Get count of queued applications */
export async function getQueuedCount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORES.QUEUED_APPLICATIONS, "readonly");
    const request = tx.objectStore(STORES.QUEUED_APPLICATIONS).count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(0);
    db.close();
  });
}

/** Sync all queued applications when back online */
export async function syncQueuedApplications(apiBase: string): Promise<number> {
  const db = await openDB();
  const tx = db.transaction(STORES.QUEUED_APPLICATIONS, "readonly");
  const store = tx.objectStore(STORES.QUEUED_APPLICATIONS);

  return new Promise((resolve) => {
    const request = store.getAll();
    request.onsuccess = async () => {
      const queued = request.result.filter((a: any) => a.status === "queued");
      let synced = 0;

      for (const app of queued) {
        try {
          const res = await fetch(`${apiBase}/applications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(app),
          });
          if (res.ok) {
            const updateTx = db.transaction(
              STORES.QUEUED_APPLICATIONS,
              "readwrite",
            );
            updateTx.objectStore(STORES.QUEUED_APPLICATIONS).put({
              ...app,
              status: "synced",
              syncedAt: new Date().toISOString(),
            });
            synced++;
          }
        } catch {
          // Still offline, skip
        }
      }
      db.close();
      resolve(synced);
    };
    request.onerror = () => {
      db.close();
      resolve(0);
    };
  });
}

/** Check if currently online */
export function isOnline(): boolean {
  return navigator.onLine;
}

/** Register sync listener — auto-sync when connection restored */
export function registerSyncListener(apiBase: string): void {
  window.addEventListener("online", async () => {
    console.log(
      "[HaqDaari] Connection restored — syncing queued applications...",
    );
    const synced = await syncQueuedApplications(apiBase);
    console.log(`[HaqDaari] Synced ${synced} queued applications`);
  });
}
