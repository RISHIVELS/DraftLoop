import { openDB, type IDBPDatabase } from 'idb'
import type { HistoryRun } from './types'

const DB_NAME = 'draftloop'
const DB_VERSION = 1
const STORE = 'runs'

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt')
      }
    },
  })
}

export async function saveRun(run: HistoryRun): Promise<void> {
  const db = await getDB()
  await db.put(STORE, run)
}

export async function listRuns(): Promise<HistoryRun[]> {
  const db = await getDB()
  const all = await db.getAll(STORE)
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

export async function getRunById(id: string): Promise<HistoryRun | undefined> {
  const db = await getDB()
  return db.get(STORE, id)
}

export async function deleteRun(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE, id)
}
